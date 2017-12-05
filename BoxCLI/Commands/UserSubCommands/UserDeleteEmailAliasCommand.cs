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
    public class UserDeleteEmailAliasCommand : UserSubCommandBase
    {
        private CommandArgument _userId;
        private CommandArgument _aliasId;
        private CommandLineApplication _app;
        public UserDeleteEmailAliasCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Delete an email alias from a user";
            _userId = command.Argument("userId",
                                   "User ID to delete email alias");
            _aliasId = command.Argument("aliasId",
                                   "The ID of the email alias to delete");
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunDeleteEmailAlias();
            return await base.Execute();
        }

        private async Task RunDeleteEmailAlias()
        {
            base.CheckForId(this._aliasId.Value, this._app);
            base.CheckForId(this._userId.Value, this._app);
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());

            var alias = await boxClient.UsersManager.DeleteEmailAliasAsync(this._userId.Value, this._aliasId.Value);

            Reporter.WriteSuccess($"Removed alias {this._aliasId.Value} from user {this._userId.Value}");
        }
    }
}