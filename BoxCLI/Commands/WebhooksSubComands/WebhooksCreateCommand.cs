using System;
using System.Linq;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.CsvModels;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.WebhooksSubComands
{
    public class WebhooksCreateCommand : WebhooksSubCommandBase
    {
        private CommandOption _path;
        private CommandLineApplication _app;
        public WebhooksCreateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names) : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Create a new webhook";
            _path = FilePathOption.ConfigureOption(command);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await RunCreate();
            return await base.Execute();
        }

        private async Task RunCreate()
        {
            if(!string.IsNullOrEmpty(_path.Value()))
            {
                await base.ProcessWebhooksFromFile(_path.Value(), _asUser.Value());
            }
        }
    }
}