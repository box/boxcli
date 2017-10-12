using System;
using System.Collections.Generic;
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
        private CommandArgument _id;
        private CommandArgument _type;
        private CommandArgument _triggers;
        private CommandArgument _address;
        private CommandOption _path;
        private CommandOption _save;
        private CommandOption _idOnly;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public WebhooksCreateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names) : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Create a new webhook";
            _path = BulkFilePathOption.ConfigureOption(command);
            _save = SaveOption.ConfigureOption(command);
            _idOnly = IdOnlyOption.ConfigureOption(command);
            _id = command.Argument("boxItemId",
                                   "Id of the Box item");
            _type = command.Argument("boxItemType", "Type of Box item");
            _triggers = command.Argument("triggers", "Triggers for webhook, enter as comma separated list. For example: FILE.DELETED,FILE.PREVIEWED");
            _address = command.Argument("address", "URL for your webhook handler");
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
            if (!string.IsNullOrEmpty(_path.Value()))
            {
                var json = false;
                if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
                {
                    json = true;
                }
                await base.CreateWebhooksFromFile(_path.Value(), _asUser.Value(), this._save.HasValue(), json: json);
                return;
            }
            base.CheckForValue(this._id.Value, this._app, "A Box item ID is required for this call.");
            base.CheckForValue(this._type.Value, this._app, "A Box item type is required for this call.");
            base.CheckForValue(this._triggers.Value, this._app, "Triggers are required for this call.");
            base.CheckForValue(this._address.Value, this._app, "A webhook handler URL is required for this call.");

            var boxClient = base.ConfigureBoxClient(this._asUser.Value());

            var type = base.ProcessType(this._type.Value);
            var webhookRequest = new BoxWebhookRequest();
            webhookRequest.Target = new BoxRequestEntity()
            {
                Id = this._id.Value,
                Type = type
            };

            var triggerStrings = this._triggers.Value.Split(',');
            var triggers = new List<string>();
            foreach (var trigger in triggerStrings)
            {
                triggers.Add(trigger.Trim().ToUpper());
            }

            webhookRequest.Triggers = triggers;
            webhookRequest.Address = this._address.Value;
            var createdWebhook = await boxClient.WebhooksManager.CreateWebhookAsync(webhookRequest);
            if (this._idOnly.HasValue())
            {
                Reporter.WriteInformation(createdWebhook.Id);
                return;
            }
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(createdWebhook);
                return;
            }
            Reporter.WriteSuccess("Created new webhook...");
            base.PrintWebhook(createdWebhook);
        }
    }
}