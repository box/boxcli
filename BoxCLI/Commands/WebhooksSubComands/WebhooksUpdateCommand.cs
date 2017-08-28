using System;
using System.Collections.Generic;
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
        private CommandArgument _id;
        private CommandOption _path;
        private CommandOption _save;
        private CommandOption _triggers;
        private CommandOption _address;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public WebhooksUpdateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names) : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Update a webhook";
            _path = BulkFilePathOption.ConfigureOption(command);
            _save = SaveOption.ConfigureOption(command);
            _id = command.Argument("webhookId",
                                   "Id of the webhook");
            _triggers = command.Option("-t|--triggers <TRIGGERS>", "Triggers for webhook, enter as comma separated list. For example: FILE.DELETED,FILE.PREVIEWED", CommandOptionType.SingleValue);
            _address = command.Option("-a|--address", "URL for your webhook handler", CommandOptionType.SingleValue);
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
            if (!string.IsNullOrEmpty(_path.Value()))
            {
                await base.UpdateWebhooksFromFile(_path.Value(), _asUser.Value(), this._save.HasValue());
                return;
            }
            base.CheckForValue(this._id.Value, this._app, "A webhook ID is required for this call.");

            var boxClient = base.ConfigureBoxClient(this._asUser.Value());
            var webhookRequest = new BoxWebhookRequest();
            webhookRequest.Id = this._id.Value;
            if (this._triggers.HasValue())
            {
                var triggerStrings = this._triggers.Value().Split(',');
                var triggers = new List<string>();
                foreach (var trigger in triggerStrings)
                {
                    triggers.Add(trigger.Trim().ToUpper());
                }
                webhookRequest.Triggers = triggers;
            }

            if (this._address.HasValue())
            {
                webhookRequest.Address = this._address.Value();
            }
            var webhook = await boxClient.WebhooksManager.UpdateWebhookAsync(webhookRequest);
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(webhook);
                return;
            }
            Reporter.WriteSuccess("Updated webhook...");
            base.PrintWebhook(webhook);
        }
    }
}