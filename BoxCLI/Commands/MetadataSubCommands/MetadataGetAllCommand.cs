using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.MetadataSubCommands
{
    public class MetadataGetAllCommand : MetadataSubCommandBase
    {
        private CommandArgument _id;
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
            base.PrintMetadataCollection(metadataCollection);
        }
    }
}