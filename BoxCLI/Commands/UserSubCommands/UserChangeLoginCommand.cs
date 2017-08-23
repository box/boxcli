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
    public class UserChangeLoginCommand : UserSubCommandBase
    {
        private CommandArgument _userId;
        private CommandArgument _userEmail;
        private CommandLineApplication _app;
        public UserChangeLoginCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Change a user's primary email to a confirmed alias";
            _userId = command.Argument("userId",
                                   "User ID to change email");
            _userEmail = command.Argument("userEmail",
                                   "Email alias to make primary email");
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunChangeEmail();
            return await base.Execute();
        }

        private async Task RunChangeEmail()
        {
            base.CheckForValue(this._userEmail.Value, this._app, "A user email is required for this command");
            base.CheckForId(this._userId.Value, this._app);
            var boxClient = base.ConfigureBoxClient(returnServiceAccount: true);

            var user = await boxClient.UsersManager.ChangeUsersLoginAsync(this._userId.Value, this._userEmail.Value);
            if (base._json.HasValue())
            {
                base.OutputJson(user);
                return;
            }
            Reporter.WriteSuccess($"Changed user {this._userId.Value} primary email to {this._userEmail.Value} ");
            base.PrintUserInfo(user);
        }
    }
}