using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.TokenSubCommands
{
    public class TokenGetCommand : TokenSubCommandBase
    {
        private CommandOption _user;
        private CommandLineApplication _app;
        public TokenGetCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get a token. Returns the service account token by default.";
            _user = command.Option("-u|--user-id", 
                                            "Get a user token from a user ID.", 
                                            CommandOptionType.SingleValue);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            this.RunGet();
            return await base.Execute();
        }

        private void RunGet()
        {
            var Box = base._boxPlatformBuilder.Build();
            if(this._user.HasValue())
            {
                Reporter.WriteInformation(Box.GetUserToken(this._user.Value()));
            }
            else 
            {
                Reporter.WriteInformation(Box.GetServiceAccountToken());
            }
        }
    }
}