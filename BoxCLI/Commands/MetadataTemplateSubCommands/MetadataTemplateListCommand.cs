using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.BoxPlatform.Utilities;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandModels;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.CsvModels;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.MetadataTemplateSubCommands
{
    public class MetadataTemplateListCommand : MetadataTemplateSubCommandBase
    {
        private CommandOption _save;
        private CommandOption _fileFormat;
        private CommandLineApplication _app;
        public MetadataTemplateListCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get all metadata templates in your Enterprise.";

            _save = SaveOption.ConfigureOption(command);
            _fileFormat = FileFormatOption.ConfigureOption(command);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunList();
            return await base.Execute();
        }

        private async Task RunList()
        {
            var boxClient = base.ConfigureBoxClient(returnServiceAccount: true);
            if (this._save.HasValue())
            {
                var dateString = DateTime.Now.ToString(GeneralUtilities.GetDateFormatString());
                var fileNameTemplates = $"{base._names.CommandNames.MetadataTemplates}-{base._names.SubCommandNames.List}-{dateString}";
                var fileNameFields = $"{base._names.CommandNames.MetadataTemplateFields}-{base._names.SubCommandNames.List}-{dateString}";
                Reporter.WriteInformation("Saving file...");
                var saveMetadataTemplates = await boxClient.MetadataManager.GetEnterpriseMetadataAsync();
                var saved = base.WriteMetadataTemplateCollectionResultsToReport(saveMetadataTemplates.Entries, fileNameTemplate: fileNameTemplates, fileNameFields: fileNameFields, fileFormat: this._fileFormat.Value());
                Reporter.WriteInformation($"File saved: {saved}");
                return;
            }
            var collection = await boxClient.MetadataManager.GetEnterpriseMetadataAsync();
            foreach (var template in collection.Entries)
            {
                base.PrintMetadataTemplate(template);
            }
        }
    }
}