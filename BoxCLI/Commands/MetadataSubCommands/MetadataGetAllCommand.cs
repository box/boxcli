using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandModels;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.MetadataSubCommands
{
    public class MetadataGetAllCommand : MetadataSubCommandBase
    {
        private CommandArgument _id;
        private CommandOption _save;
        private CommandOption _fileFormat;
        private CommandLineApplication _app;
        public MetadataGetAllCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names, BoxType t)
            : base(boxPlatformBuilder, home, names, t)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get all metadata on a Box item.";
            _id = command.Argument("boxItemId",
                                   "Id of the Box item");
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
            await this.RunGetAll();
            return await base.Execute();
        }

        private async Task RunGetAll()
        {
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            if (this._save.HasValue())
            {
                var fileName = $"{base._names.CommandNames.Metadata}-{base._names.SubCommandNames.GetAll}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
                BoxMetadataTemplateCollection<Dictionary<string, object>> metadataCollectionForReport;
                var type = "";
                if (base._t == BoxType.file)
                {
                    type = "file";
                    metadataCollectionForReport = await boxClient.MetadataManager.GetAllFileMetadataTemplatesAsync(_id.Value);
                }
                else if (base._t == BoxType.folder)
                {
                    type = "folder";
                    metadataCollectionForReport = await boxClient.MetadataManager.GetAllFolderMetadataTemplatesAsync(_id.Value);
                }
                else
                {
                    throw new Exception("This item doesn't currently support metadata.");
                }

                var metadataFullObjectCollection = new List<BoxMetadataForCsv>();

                foreach (var metadata in metadataCollectionForReport.Entries)
                {
                    metadataFullObjectCollection.Add(new BoxMetadataForCsv()
                    {
                        ItemId = this._id.Value,
                        ItemType = type,
                        Metadata = metadata
                    });
                }
                base.WriteMetadataCollectionResultsToReport(metadataFullObjectCollection, fileName, fileFormat: this._fileFormat.Value());
                return;
            }
            base.CheckForId(this._id.Value, _app);
            BoxMetadataTemplateCollection<Dictionary<string, object>> metadataCollection;
            if (base._t == BoxType.file)
            {
                metadataCollection = await boxClient.MetadataManager.GetAllFileMetadataTemplatesAsync(_id.Value);
            }
            else if (base._t == BoxType.folder)
            {
                metadataCollection = await boxClient.MetadataManager.GetAllFolderMetadataTemplatesAsync(_id.Value);
            }
            else
            {
                throw new Exception("This item doesn't currently support metadata.");
            }
            if (base._json.HasValue())
            {
                base.OutputJson(metadataCollection);
                return;
            }
            base.PrintMetadataCollection(metadataCollection);
        }
    }
}