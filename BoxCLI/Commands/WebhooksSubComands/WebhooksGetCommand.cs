using System;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.WebhooksSubComands
{
    public class WebhooksGetCommand : WebhooksSubCommandBase
    {
        private CommandArgument _webhookId;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public WebhooksGetCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get information about a webhook.";
            _webhookId = command.Argument("webhookId",
                                   "Id of webhook");

            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunGet(_webhookId.Value, base._asUser.Value());
            return await base.Execute();
        }

        private async Task RunGet(string id, string asUser)
        {
            var boxClient = base.ConfigureBoxClient(asUser);
            var webhook = await boxClient.WebhooksManager.GetWebhookAsync(id);
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(webhook);
                return;
            }
            base.PrintWebhook(webhook);
        }
    }
}