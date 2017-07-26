using System;
using System.Collections.Generic;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.MetadataTemplateSubCommands
{
    public class MetadataTemplateSubCommandBase : BoxBaseCommand
    {
        public MetadataTemplateSubCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
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