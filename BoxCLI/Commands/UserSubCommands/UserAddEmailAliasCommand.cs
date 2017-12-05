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
    public class UserAddEmailAliasCommand : UserSubCommandBase
    {
        private CommandArgument _userId;
        private CommandArgument _userEmail;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public UserAddEmailAliasCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Add a new email alias to a user";
            _userId = command.Argument("userId",
                                   "User ID to add email alias");
            _userEmail = command.Argument("userEmail",
                                   "Email to add as alias");
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunAddEmailAlias();
            return await base.Execute();
        }

        private async Task RunAddEmailAlias()
        {
            base.CheckForValue(this._userEmail.Value, this._app, "A user email is required for this command");
            base.CheckForId(this._userId.Value, this._app);
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());

            var alias = await boxClient.UsersManager.AddEmailAliasAsync(this._userId.Value, this._userEmail.Value);
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(alias);
                return;
            }
            Reporter.WriteSuccess($"Added alias {this._userEmail.Value} to user {this._userId.Value}");
        }
    }
}