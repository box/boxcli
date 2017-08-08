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
        public UserGetEmailAliasesCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
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
            var boxClient = base.ConfigureBoxClient(returnServiceAccount: true);

            var alias = await boxClient.UsersManager.GetEmailAliasesAsync(this._userId.Value);

            Reporter.WriteSuccess($"Retrieved email alises for user {this._userId.Value}");
            base.PrintAliases(alias);
        }
    }
}