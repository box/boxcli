using System.Threading.Tasks;
using Box.V2;
using Box.V2.Auth.Token;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.TokenSubCommands
{
    public class TokenExchangeCommand : TokenSubCommandBase
    {
        private CommandArgument _scope;
        private CommandOption _fileId;
        private CommandOption _folderId;
        private CommandOption _token;
        private CommandOption _user;
        private CommandLineApplication _app;
        public TokenExchangeCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Downscope a token. Uses the service account token by default.";
            _scope = command.Argument("scope", "Provide the scope for the token");

            _fileId = command.Option("--file-id",
                                        "Scope the token to a specific file.",
                                        CommandOptionType.SingleValue);
            _folderId = command.Option("--folder-id",
                                        "Scope the token to a specific folder.",
                                        CommandOptionType.SingleValue);
            _token = command.Option("-t|--token",
                                        "Provide a token to downscope.",
                                        CommandOptionType.SingleValue);
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
            this.RunExchange();
            return await base.Execute();
        }

        private void RunExchange()
        {
            base.CheckForValue(this._scope.Value, this._app, "A scope is required for this command");
            var Box = base._boxPlatformBuilder.Build();
            TokenExchange tokenExchange;
            if (this._token.HasValue())
            {
                tokenExchange = new TokenExchange(this._token.Value(), this._scope.Value);
            }
            else if (this._user.HasValue())
            {
                tokenExchange = new TokenExchange(Box.GetUserToken(this._user.Value()), this._scope.Value);
            }
            else
            {
                tokenExchange = new TokenExchange(Box.GetServiceAccountToken(), this._scope.Value);
            }

            if (this._fileId.HasValue())
            {
                tokenExchange.SetResource($"{base.FilesResourceUrl}{this._fileId.Value()}");
            }
            else if (this._folderId.HasValue())
            {
                tokenExchange.SetResource($"{base.FoldersResourceUrl}{this._folderId.Value()}");
            }

            Reporter.WriteInformation($"Scoped token: {tokenExchange.Exchange()}");
        }
    }
}