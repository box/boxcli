using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.MetadataSubCommands
{
    public class MetadataCreateCommand : MetadataSubCommandBase
    {
        private CommandArgument _id;
        private CommandArgument _scope;
        private CommandArgument _template;
        private CommandOption _bulkFilePath;
        private CommandLineApplication _app;
        public MetadataCreateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names, BoxType t) 
            : base(boxPlatformBuilder, home, names, t)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get information about a metadata object.";
            _id = command.Argument("boxItemId",
                                   "Id of the Box item");
            _scope = command.Argument("scope",
                                   "The scope of the metadata object");
            _template = command.Argument("template",
                                   "The key of the template");
            _bulkFilePath = BulkFilePathOption.ConfigureOption(command);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunCreate();
            return await base.Execute();
        }

        private async Task RunCreate()
        {
            if(this._bulkFilePath.HasValue())
            {
                await base.AddMetadataToItemFromFile(this._bulkFilePath.Value());
                return;
            }
            base.CheckForId(this._id.Value, this._app);
            base.CheckForScope(this._scope.Value, this._app);
            base.CheckForTemplate(this._template.Value, this._app);
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            var metadata = base.MetadataKeyValuesFromConsole();
            if (base._t == BoxType.file)
            {
                metadata = await boxClient.MetadataManager.CreateFileMetadataAsync(this._id.Value, metadata, this._scope.Value, this._template.Value);
            }
            else if (base._t == BoxType.folder)
            {
                metadata = await boxClient.MetadataManager.CreateFolderMetadataAsync(this._id.Value, metadata, this._scope.Value, this._template.Value);
            }
            else
            {
                throw new Exception("This item doesn't currently support metadata.");
            }
            Reporter.WriteSuccess("Created metadata.");
            base.PrintMetadata(metadata);
        }
    }
}