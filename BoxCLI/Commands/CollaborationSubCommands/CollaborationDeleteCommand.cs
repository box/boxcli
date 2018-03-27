using System;
using System.Threading.Tasks;
using Box.V2;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.CollaborationSubCommands
{
    public class CollaborationDeleteCommand : CollaborationSubCommandBase
    {
        private CommandArgument _id;
        private CommandOption _dontPrompt;
        private CommandOption _bulkPath;
        private CommandLineApplication _app;
        public CollaborationDeleteCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names, BoxType t)
            : base(boxPlatformBuilder, home, names, t)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Remove a collaboration";
            _id = command.Argument("collaborationId",
                                   "ID of the collaboration");
            _dontPrompt = SuppressDeletePromptOption.ConfigureOption(command);
            _bulkPath = BulkFilePathOption.ConfigureOption(command);
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
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            if (this._bulkPath.HasValue())
            {
                var path = GeneralUtilities.TranslatePath(this._bulkPath.Value());
                var ids = base.ReadFileForIds(path);
                foreach (var id in ids)
                {
                    bool result;
                    try
                    {
                        result = await boxClient.CollaborationsManager.RemoveCollaborationAsync(id);
                        if (result)
                        {
                            Reporter.WriteSuccess($"Deleted collaboration {id}");
                        }
                        else
                        {
                            Reporter.WriteError($"Couldn't delete collaboration {id}.");
                        }
                    }
                    catch (Exception e)
                    {
                        Reporter.WriteError($"Error deleting collaboration {id}.");
                        Reporter.WriteError(e.Message);
                    }
                }
                Reporter.WriteInformation("Finished deleting collaborations...");
                return;
            }
            base.CheckForValue(this._id.Value, this._app, "A collaboration ID is required for this command.");
            bool collabDeleted = false;
            if (this._dontPrompt.HasValue())
            {
                collabDeleted = await boxClient.CollaborationsManager.RemoveCollaborationAsync(this._id.Value);
            }
            else
            {
                Reporter.WriteWarningNoNewLine("Are you sure you want to delete this collaboration? y/N ");
                var yNKey = "n";
                yNKey = Console.ReadLine().ToLower();
                if (yNKey != "y")
                {
                    Reporter.WriteInformation("Aborted collaboration deletion.");
                    return;
                }
                else
                {
                    collabDeleted = await boxClient.CollaborationsManager.RemoveCollaborationAsync(this._id.Value);
                }
            }
            if (collabDeleted)
            {
                Reporter.WriteSuccess($"Collaboration {this._id.Value} successfully removed");
            }
            else
            {
                Reporter.WriteSuccess($"Couldn't remove collaboration {this._id.Value}");
            }
        }
    }
}