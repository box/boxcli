using System;
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
    public class WebhooksUpdateCommand : WebhooksSubCommandBase
    {
        private CommandOption _path;
        private CommandLineApplication _app;
        public WebhooksUpdateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names) : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Update a webhook";
            _path = FilePathOption.ConfigureOption(command);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await RunUpdate();
            return await base.Execute();
        }

        private async Task RunUpdate()
        {
            if(!string.IsNullOrEmpty(_path.Value()))
            {
                await base.ProcessWebhooksFromFile(_path.Value(), _asUser.Value());
            }
        }
    }
}