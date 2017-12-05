using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Box.V2.Converter;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandModels;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.CsvModels;
using BoxCLI.CommandUtilities.Globalization;
using CsvHelper;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.MetadataTemplateSubCommands
{
    public class MetadataTemplateSubCommandBase : BoxBaseCommand
    {
        private CommandLineApplication _app;
        protected CommandOption _asUser;

        public MetadataTemplateSubCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            _asUser = AsUserOption.ConfigureOption(command);
            base.Configure(command);
        }

        protected virtual void CheckForScope(string scope, CommandLineApplication app)
        {
            if (string.IsNullOrEmpty(scope))
            {
                app.ShowHelp();
                throw new Exception("The scope of the metadata template is required for this command.");
            }
        }
        protected virtual void CheckForName(string name, CommandLineApplication app)
        {
            if (string.IsNullOrEmpty(name))
            {
                app.ShowHelp();
                throw new Exception("The name of the metadata template is required for this command.");
            }
        }

        protected virtual void CheckForTemplate(string template, CommandLineApplication app)
        {
            if (string.IsNullOrEmpty(template))
            {
                app.ShowHelp();
                throw new Exception("The key of the template is required for this command.");
            }
        }

        protected virtual List<BoxMetadataTemplateField> BuildTemplateFromConsole()
        {
            var yN = "n";
            var display = "";
            var type = "";
            var mdt = new List<BoxMetadataTemplateField>();
            do
            {
                var mdtField = new BoxMetadataTemplateField();
                if (mdt.Count > 0)
                {
                    Reporter.WriteInformation("Current metadata template fields:");
                    foreach (var m in mdt)
                    {
                        Reporter.WriteInformation($"{m.DisplayName}");
                    }
                }
                Reporter.WriteInformation("Enter the metadata template field display name:");
                display = Console.ReadLine();
                mdtField.DisplayName = display;
                var yNKey = "y";
                Reporter.WriteInformation($"Use {display} as metadata template field key? (Y/n)");
                yNKey = Console.ReadLine().ToLower();
                if (string.IsNullOrEmpty(yNKey) || yNKey == "y")
                {
                    mdtField.Key = display;
                }
                else
                {
                    Reporter.WriteInformation("Enter the key for this metadata template field:");
                    mdtField.Key = Console.ReadLine();
                }

                Reporter.WriteInformation("Enter a number to select a metadata template field type:");
                Reporter.WriteInformation("1. string");
                Reporter.WriteInformation("2. enum");
                Reporter.WriteInformation("3. float");
                Reporter.WriteInformation("4. date");
                type = Console.ReadLine();
                switch (type)
                {
                    case "1":
                        type = "string";
                        break;
                    case "2":
                        type = "enum";
                        break;
                    case "3":
                        type = "float";
                        break;
                    case "4":
                        type = "date";
                        break;
                    default:
                        type = "";
                        break;
                }
                if (string.IsNullOrEmpty(type))
                {
                    Reporter.WriteWarning("Not a valid selection");
                    continue;
                }
                mdtField.Type = type;
                if (type == "enum")
                {
                    var yNOpts = "n";
                    var opts = new List<BoxMetadataTemplateFieldOption>();
                    do
                    {
                        var opt = new BoxMetadataTemplateFieldOption();
                        Reporter.WriteInformation("Enter an enum option key: ");
                        opt.Key = Console.ReadLine();
                        opts.Add(opt);
                        Reporter.WriteInformation("Enter another option? (y/N)");
                        yNOpts = Console.ReadLine().ToLower();
                        if (string.IsNullOrEmpty(yNOpts))
                        {
                            break;
                        }
                    }
                    while (yNOpts == "y");
                    mdtField.Options = opts;
                }
                mdt.Add(mdtField);
                Reporter.WriteInformation("Enter another metadata template field? (y/N)");
                yN = Console.ReadLine().ToLower();
                if (string.IsNullOrEmpty(yN))
                {
                    break;
                }
            }
            while (yN != "n");
            Reporter.WriteSuccess("Finished building metadata template fields.");
            return mdt;
        }

        protected virtual List<BoxMetadataTemplate> ReadMetadataTemplateJsonFile(string filePathTemplates)
        {
            var jsonString = File.ReadAllText(filePathTemplates);
            var converter = new BoxJsonConverter();
            var collection = converter.Parse<BoxEnterpriseMetadataTemplateCollection<BoxMetadataTemplate>>(jsonString);
            return collection.Entries.ToList();
        }

        protected virtual List<BoxMetadataTemplate> ReadMetadataTemplateCsvFile(string filePathTemplate, string filePathFields)
        {
            var templates = new List<BoxMetadataTemplate>();
            var fields = new List<BoxMetadataTemplateFieldForCsv>();
            using (var fs = File.OpenText(filePathTemplate))
            using (var csv = new CsvReader(fs))
            {
                csv.Configuration.RegisterClassMap(typeof(BoxMetadataTemplateMap));
                templates = csv.GetRecords<BoxMetadataTemplate>().ToList();
            }
            using (var fs = File.OpenText(filePathFields))
            using (var csv = new CsvReader(fs))
            {
                csv.Configuration.RegisterClassMap(typeof(BoxMetadataTemplateFieldMap));
                fields = csv.GetRecords<BoxMetadataTemplateFieldForCsv>().ToList();
            }
            var templateCollection = new List<BoxMetadataTemplate>();
            foreach (var template in templates)
            {
                var matches = fields.FindAll(f => f.TemplateKey == template.TemplateKey);
                if (matches.Count > 0)
                {
                    template.Fields = new List<BoxMetadataTemplateField>();
                    foreach (var match in matches)
                    {
                        var field = new BoxMetadataTemplateField();
                        field.DisplayName = match.DisplayName;
                        field.Hidden = match.Hidden;
                        field.Key = match.Key;
                        field.Type = match.Type;
                        if (match.OptionsFromCsv != null && match.OptionsFromCsv.Count > 0)
                        {
                            field.Options = new List<BoxMetadataTemplateFieldOption>();
                            foreach (var option in match.OptionsFromCsv)
                            {
                                field.Options.Add(new BoxMetadataTemplateFieldOption()
                                {
                                    Key = option
                                });
                            }
                        }
                        template.Fields.Add(field);
                    }
                }
                templateCollection.Add(template);
            }
            return templateCollection;
        }

        protected async virtual Task CreateMetadataTemplatesFromFile(string filePath, string filePathFields = "",
            bool save = false, string overrideSavePath = "", string overrideSaveFileFormat = "", bool json = false)
        {
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: this._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            if (!string.IsNullOrEmpty(filePath))
            {
                filePath = GeneralUtilities.TranslatePath(filePath);
            }
            if (!string.IsNullOrEmpty(filePathFields))
            {
                filePathFields = GeneralUtilities.TranslatePath(filePathFields);
            }
            try
            {
                var fileFormat = base.ProcessFileFormatFromPath(filePath);
                List<BoxMetadataTemplate> templateRequests;
                if (fileFormat.ToLower() == base._settings.FILE_FORMAT_CSV)
                {
                    templateRequests = this.ReadMetadataTemplateCsvFile(filePath, filePathFields);
                }
                else if (fileFormat.ToLower() == base._settings.FILE_FORMAT_JSON)
                {
                    templateRequests = this.ReadMetadataTemplateJsonFile(filePath);
                }
                else
                {
                    throw new Exception($"File format {fileFormat} is not currently supported.");
                }

                var saveCreated = new List<BoxMetadataTemplate>();

                foreach (var templateRequest in templateRequests)
                {
                    BoxMetadataTemplate createdTemplate = null;
                    try
                    {
                        createdTemplate = await boxClient.MetadataManager.CreateMetadataTemplate(templateRequest);
                    }
                    catch (Exception e)
                    {
                        Reporter.WriteError("Couldn't create metadata template...");
                        Reporter.WriteError(e.Message);
                    }
                    if (createdTemplate != null)
                    {
                        this.PrintMetadataTemplate(createdTemplate, json);
                        if (save || !string.IsNullOrEmpty(overrideSavePath) || base._settings.GetAutoSaveSetting())
                        {
                            saveCreated.Add(createdTemplate);
                        }
                    }
                }
                if (save || !string.IsNullOrEmpty(overrideSavePath) || base._settings.GetAutoSaveSetting())
                {
                    var saveFileFormat = base._settings.GetBoxReportsFileFormatSetting();
                    if (!string.IsNullOrEmpty(overrideSaveFileFormat))
                    {
                        saveFileFormat = overrideSaveFileFormat;
                    }
                    var savePath = base._settings.GetBoxReportsFolderPath();
                    if (!string.IsNullOrEmpty(overrideSavePath))
                    {
                        savePath = overrideSavePath;
                    }
                    var dateString = DateTime.Now.ToString(GeneralUtilities.GetDateFormatString());
                    var fileName = $"{base._names.CommandNames.MetadataTemplates}-{base._names.SubCommandNames.Create}-{dateString}";
                    var fileNameFields = $"{base._names.CommandNames.MetadataTemplateFields}-{base._names.SubCommandNames.Create}-{dateString}";
                    base.WriteMetadataTemplateCollectionResultsToReport(saveCreated, fileName, fileNameFields: fileNameFields, filePathTemplate: savePath, fileFormat: fileFormat);
                }
            }
            catch (Exception e)
            {
                Reporter.WriteError(e.Message);
            }
        }

        protected virtual void PrintMetadataTemplate(BoxMetadataTemplate mdt, bool json)
        {
            if (json)
            {
                base.OutputJson(mdt);
                return;
            }
            else
            {
                this.PrintMetadataTemplate(mdt);
            }
        }
        protected virtual void PrintMetadataTemplate(BoxMetadataTemplate mdt)
        {
            Reporter.WriteInformation($"Template Name: {mdt.DisplayName}");
            Reporter.WriteInformation($"Template Key: {mdt.TemplateKey}");
            Reporter.WriteInformation($"Template Scope: {mdt.Scope}");
            if (mdt.Fields != null && mdt.Fields.Count > 0)
            {
                foreach (var field in mdt.Fields)
                {
                    Reporter.WriteInformation($"Field Type: {field.Type}");
                    Reporter.WriteInformation($"Field Name: {field.DisplayName}");
                    Reporter.WriteInformation($"Field Key: {field.Key}");
                    if (field.Options != null && field.Options.Count > 0)
                    {
                        foreach (var option in field.Options)
                        {
                            Reporter.WriteInformation($"Option Key: {option.Key}");
                        }
                    }
                }
            }
        }
    }
}