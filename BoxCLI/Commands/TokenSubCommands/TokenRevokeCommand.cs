using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.TokenSubCommands
{
    public class TokenRevokeCommand : TokenSubCommandBase
    {
        private CommandArgument _token;
        private CommandLineApplication _app;
        public TokenRevokeCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }


        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Revoke a token.";
            _token = command.Argument("token", "Provide the token to revoke");
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunRevoke();
            return await base.Execute();
        }

        private async Task RunRevoke()
        {
            base.CheckForValue(this._token.Value, this._app, "A token is required for this command");
            await base._boxPlatformBuilder.Build().ClientFromToken(this._token.Value).Auth.LogoutAsync();
            Reporter.WriteSuccess("Token revoked.");
        }
    }
}