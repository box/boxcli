using System;
using System.Threading.Tasks;
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

            base.CheckForValue(this._id.Value, this._app, "A collaboration ID is required for this command.");
            bool collabDeleted = false;
            if (this._dontPrompt.HasValue())
            {
                collabDeleted = await this.DeleteCollaboration();
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
                    collabDeleted = await this.DeleteCollaboration();
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

        private async Task<bool> DeleteCollaboration()
        {
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            return await boxClient.CollaborationsManager.RemoveCollaborationAsync(this._id.Value);
        }
    }
}