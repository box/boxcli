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
    public class UserMoveRootContentCommand : UserSubCommandBase
    {
        private CommandArgument _userId;
        private CommandArgument _newUserId;
        private CommandOption _notify;
        private CommandLineApplication _app;
        public UserMoveRootContentCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Move a user's root content to another user";
            _userId = command.Argument("userId",
                                   "User whose content should be moved");
            _newUserId = command.Argument("newUserId",
                                   "User to whom the content should be moved");
            _notify = command.Option("--notify","Notify the user that their content has been moved",CommandOptionType.NoValue);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunMoveRoot();
            return await base.Execute();
        }

        private async Task RunMoveRoot()
        {
            base.CheckForId(this._userId.Value, this._app);
            base.CheckForId(this._newUserId.Value, this._app);
            var boxClient = base.ConfigureBoxClient(returnServiceAccount: true);

            if(this._notify.HasValue()) 
            {
                var folder = await boxClient.UsersManager.MoveUserFolderAsync(this._userId.Value, this._newUserId.Value,"0",true);
            }
            else
            {
                var folder = await boxClient.UsersManager.MoveUserFolderAsync(this._userId.Value, this._newUserId.Value);
            }
            Reporter.WriteSuccess($"Moved all items to user {this._newUserId.Value} from user {this._userId.Value}");
        }
    }
}