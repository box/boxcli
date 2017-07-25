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
    public class WebhooksSubCommandBase : BoxBaseCommand
    {
        protected readonly List<string> _fields;
        protected CommandOption _asUser;
        protected CommandOption _json;
        public WebhooksSubCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _asUser = AsUserOption.ConfigureOption(command);
            _json = OutputJsonOption.ConfigureOption(command);
            base.Configure(command);
        }

        protected async Task ProcessWebhooksFromFile(string path, string asUser = "")
        {
            var boxClient = base.ConfigureBoxClient(asUser);
            if (!string.IsNullOrEmpty(path))
            {
                path = GeneralUtilities.TranslatePath(path);
            }
            System.Console.WriteLine($"Path: {path}");
            try
            {
                System.Console.WriteLine("Reading file...");
                var webhookRequests = base.ReadFile<BoxWebhookRequest, BoxWebhookRequestMap>(path);
                foreach (var webhookRequest in webhookRequests)
                {
                    System.Console.WriteLine($"Processing a webhook request: {webhookRequest.Address}");
                    var createdWebhook = await boxClient.WebhooksManager.CreateWebhookAsync(webhookRequest);
                    this.PrintWebhook(createdWebhook);
                }
                System.Console.WriteLine("Created all webhooks...");
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e.Message);
                Reporter.WriteError(e.Message);
            }
        }

        protected void PrintWebhook(BoxWebhook wh)
        {
            Reporter.WriteInformation($"ID: {wh.Id}");
            Reporter.WriteInformation($"Target ID: {wh.Target.Id}");
            Reporter.WriteInformation($"Target Type: {wh.Target.Type}");
            Reporter.WriteInformation($"Address: {wh.Address}");
            Reporter.WriteInformation($"Created At: {wh.CreatedAt}");
            if (wh.CreatedBy != null)
            {
                Reporter.WriteInformation($"Created By Name: {wh.CreatedBy.Name}");
                Reporter.WriteInformation($"Created By Login: {wh.CreatedBy.Login}");
                Reporter.WriteInformation($"Created By ID: {wh.CreatedBy.Id}");
            }
            if (wh.Triggers != null)
            {
                Reporter.WriteInformation("Triggers:");
                foreach (var trigger in wh.Triggers)
                {
                    Reporter.WriteInformation($"Trigger: {trigger}");
                }
            }
        }
    }
}