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
    public class WebhooksListCommand : WebhooksSubCommandBase
    {
        private CommandOption _save;
        private CommandOption _path;
        private CommandOption _fileFormat;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public WebhooksListCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }


        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "List all webhooks.";
            _save = SaveOption.ConfigureOption(command);
            _path = FilePathOption.ConfigureOption(command);
            _fileFormat = FileFormatOption.ConfigureOption(command);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunList();
            return await base.Execute();
        }

        public async Task RunList()
        {
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            var BoxCollectionsIterators = base.GetIterators();
            if (_save.HasValue())
            {
                var fileName = $"{base._names.CommandNames.Webhooks}-{base._names.SubCommandNames.List}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
                var webhooks = await boxClient.WebhooksManager.GetWebhooksAsync(autoPaginate: true);
                var saved = base.WriteMarkerCollectionResultsToReport<BoxWebhook, BoxWebhookMap>(webhooks, fileName, _path.Value(), _fileFormat.Value());
            }
            else if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                var webhooks = await boxClient.WebhooksManager.GetWebhooksAsync(autoPaginate: true);
                base.OutputJson(webhooks);
                return;
            }
            else
            {
                await BoxCollectionsIterators.ListMarkerCollectionToConsole<BoxWebhook>((marker) =>
                {
                    return boxClient.WebhooksManager.GetWebhooksAsync(nextMarker: marker);
                }, base.PrintWebhook);
            }
            Reporter.WriteInformation("Finished...");
        }
    }
}