using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.SharedItemSubCommands
{
    public class SharedItemGetCommand : SharedItemSubCommandBase
    {
        private CommandArgument _url;
        private CommandOption _password;
        private CommandLineApplication _app;
        public SharedItemGetCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get information from a shared item URL.";
            _url = command.Argument("itemUrl",
                                   "Shared item url");
            _password = command.Option("--password",
                                   "Shared item password", CommandOptionType.SingleValue);

            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunGet();
            return await base.Execute();
        }

        private async Task RunGet()
        {
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            base.PrintItem(await boxClient.SharedItemsManager.SharedItemsAsync(this._url.Value, this._password.Value()));
        }
    }
}