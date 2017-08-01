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
    public class WebhooksDeleteCommand : WebhooksSubCommandBase
    {
        private CommandArgument _webhookId;
        private CommandOption _path;
        private CommandLineApplication _app;
        public WebhooksDeleteCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Delete a webhook.";
            _webhookId = command.Argument("webhookId",
                                   "Id of webhook to delete");
            _path = BulkFilePathOption.ConfigureOption(command);

            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunDelete();
            return await base.Execute();
        }

        private async Task RunDelete()
        {
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            if (!string.IsNullOrEmpty(_path.Value()))
            {
                var path = GeneralUtilities.TranslatePath(_path.Value());
                System.Console.WriteLine(path);
                var ids = base.ReadFileForIds(path);
                foreach (var id in ids)
                {
                    var result = false;
                    try
                    {
                        result = await boxClient.WebhooksManager.DeleteWebhookAsync(id);
                    }
                    catch
                    {

                    }
                    this.LogResult(result, id);
                }
                Reporter.WriteInformation("Finished deleting webhooks...");
            }
            else if (!string.IsNullOrEmpty(_webhookId.Value))
            {
                this.LogResult(await boxClient.WebhooksManager.DeleteWebhookAsync(_webhookId.Value));
            }
            else
            {
                _app.ShowHelp();
                throw new Exception("Must include a webhook ID or a path to a file.");
            }
        }

        private void LogResult(bool result, string id = "")
        {
            if (string.IsNullOrEmpty(id))
            {
                id = _webhookId.Value;
            }
            if (result)
            {
                Reporter.WriteSuccess($"Deleted webhook {id}");
            }
            else
            {
                Reporter.WriteError($"Couldn't delete webhook {id}");
            }
        }
    }
}