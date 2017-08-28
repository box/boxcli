using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.MetadataSubCommands
{
    public class MetadataGetCommand : MetadataSubCommandBase
    {
        private CommandArgument _id;
        private CommandArgument _scope;
        private CommandArgument _template;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public MetadataGetCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names, BoxType t)
            : base(boxPlatformBuilder, home, names, t)
        {
            _home = home;
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

            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunGet();
            return await base.Execute();
        }

        private async Task RunGet()
        {
            base.CheckForId(this._id.Value, this._app);
            base.CheckForScope(this._scope.Value, this._app);
            base.CheckForTemplate(this._template.Value, this._app);
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            Dictionary<string, object> metadata;
            if (base._t == BoxType.file)
            {
                metadata = await boxClient.MetadataManager.GetFileMetadataAsync(_id.Value, _scope.Value, _template.Value);
            }
            else if (base._t == BoxType.folder)
            {
                metadata = await boxClient.MetadataManager.GetFolderMetadataAsync(_id.Value, _scope.Value, _template.Value);
            }
            else
            {
                throw new Exception("This item doesn't currently support metadata.");
            }
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(metadata);
                return;
            }
            base.PrintMetadata(metadata);
        }
    }
}