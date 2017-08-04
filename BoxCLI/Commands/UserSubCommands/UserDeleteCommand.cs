using System;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.UserSubCommands
{
    public class UserDeleteCommand : UserSubCommandBase
    {
        private CommandArgument _userId;
        private CommandOption _notify;
        private CommandOption _force;
        private CommandOption _dontPrompt;
        private CommandLineApplication _app;
        public UserDeleteCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Delete a Box User";
            _userId = command.Argument("userId",
                                   "User ID to Delete");
            _notify = command.Option("--notify", "The user should be notified", CommandOptionType.NoValue);
            _force = command.Option("-f|--force", "Delete user even if they own files", CommandOptionType.NoValue);
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
            base.CheckForUserId(this._userId.Value, this._app);
            var boxClient = base.ConfigureBoxClient(returnServiceAccount: true);
            var userDeleted = new BoxUser();
            if (this._dontPrompt.HasValue())
            {
                userDeleted = await boxClient.UsersManager.DeleteEnterpriseUserAsync(this._userId.Value, this._notify.HasValue(), this._force.HasValue());
            }
            else
            {
                Reporter.WriteWarningNoNewLine("Are you sure you want to delete this user? y/N ");
                var yNKey = "n";
                yNKey = Console.ReadLine().ToLower();
                if (yNKey != "y")
                {
                    Reporter.WriteInformation("Aborted user deletion.");
                    return;
                }
                else
                {
                    userDeleted = await boxClient.UsersManager.DeleteEnterpriseUserAsync(this._userId.Value, this._notify.HasValue(), this._force.HasValue());
                }
            }

            if (userDeleted == null)
            {
                Reporter.WriteSuccess($"Deleted user {this._userId.Value}");
            }
            else
            {
                Reporter.WriteError($"Couldn't delete user {this._userId.Value}");
            }
        }
    }
}