using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Box.V2;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.MetadataSubCommands
{
    public class MetadataDeleteCommand : MetadataSubCommandBase
    {
        private CommandArgument _id;
        private CommandArgument _scope;
        private CommandArgument _template;
        private CommandOption _dontPrompt;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public MetadataDeleteCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names, BoxType t)
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
            _dontPrompt = SuppressDeletePromptOption.ConfigureOption(command);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunDelete();
            return await base.Execute();
        }

        private async Task RunDelete()
        {
            base.CheckForId(this._id.Value, this._app);
            base.CheckForScope(this._scope.Value, this._app);
            base.CheckForTemplate(this._template.Value, this._app);
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            try
            {
                bool didDeleteMetadata;
                if (this._dontPrompt.HasValue())
                {
                    didDeleteMetadata = await DeleteMetadata(boxClient);
                }
                else
                {
                    Reporter.WriteWarningNoNewLine("Are you sure you want to delete this metadata? y/N ");
                    var yNKey = "n";
                    yNKey = Console.ReadLine().ToLower();
                    if (yNKey != "y")
                    {
                        Reporter.WriteInformation("Aborted task deletion.");
                        return;
                    }
                    else
                    {
                        didDeleteMetadata = await DeleteMetadata(boxClient);
                    }
                }

                if (didDeleteMetadata)
                {
                    Reporter.WriteSuccess($"Successfully deleted metadata {this._template.Value}.");
                }
                else
                {
                    Reporter.WriteError("Couldn't delete this metadata.");
                }
            }
            catch (Exception e)
            {
                Reporter.WriteError("Couldn't delete this metadata.");
                Reporter.WriteError(GeneralUtilities.FormatErrorResponseFromAPI(e));
            }
        }

        private async Task<bool> DeleteMetadata(BoxClient boxClient)
        {
            if (base._t == BoxType.file)
            {
                return await boxClient.MetadataManager.DeleteFileMetadataAsync(_id.Value, _scope.Value, _template.Value);
            }
            else if (base._t == BoxType.folder)
            {
                return await boxClient.MetadataManager.DeleteFolderMetadataAsync(_id.Value, _scope.Value, _template.Value);
            }
            else
            {
                throw new Exception("This item doesn't currently support metadata.");
            }
        }
    }
}