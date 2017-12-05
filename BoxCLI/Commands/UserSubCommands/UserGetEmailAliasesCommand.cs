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
    public class UserGetEmailAliasesCommand : UserSubCommandBase
    {
        private CommandArgument _userId;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public UserGetEmailAliasesCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get all Email Aliases for a User";
            _userId = command.Argument("userId",
                                   "User ID to get email aliases");
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunGetEmailAliases();
            return await base.Execute();
        }

        private async Task RunGetEmailAliases()
        {
            base.CheckForId(this._userId.Value, this._app);
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());

            var alias = await boxClient.UsersManager.GetEmailAliasesAsync(this._userId.Value);
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(alias);
                return;
            }
            Reporter.WriteSuccess($"Retrieved email alises for user {this._userId.Value}");
            base.PrintAliases(alias);
        }
    }
}