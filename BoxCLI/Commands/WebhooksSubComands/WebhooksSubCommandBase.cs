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

        protected async Task CreateWebhooksFromFile(string path, string asUser = "",
            bool save = false, string overrideSavePath = "", string overrideSaveFileFormat = "")
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
                List<BoxWebhook> saveCreated = new List<BoxWebhook>();

                foreach (var webhookRequest in webhookRequests)
                {
                    Reporter.WriteInformation($"Processing a webhook request: {webhookRequest.Address}");
                    BoxWebhook createdWebhook = null;
                    try
                    {
                        createdWebhook = await boxClient.WebhooksManager.CreateWebhookAsync(webhookRequest);
                    }
                    catch (Exception e)
                    {
                        Reporter.WriteError("Couldn't create webhook...");
                        Reporter.WriteError(e.Message);
                    }
                    Reporter.WriteSuccess("Created a webhook:");
                    if (createdWebhook != null)
                    {
                        this.PrintWebhook(createdWebhook);
                        if (save || !string.IsNullOrEmpty(overrideSavePath) || base._settings.GetAutoSaveSetting())
                        {
                            saveCreated.Add(createdWebhook);
                        }
                    }
                }
                Reporter.WriteInformation("Finished processing webhooks...");
                if (save || !string.IsNullOrEmpty(overrideSavePath) || base._settings.GetAutoSaveSetting())
                {
                    var fileFormat = base._settings.GetBoxReportsFileFormatSetting();
                    if (!string.IsNullOrEmpty(overrideSaveFileFormat))
                    {
                        fileFormat = overrideSaveFileFormat;
                    }
                    var savePath = base._settings.GetBoxReportsFolderPath();
                    if (!string.IsNullOrEmpty(overrideSavePath))
                    {
                        savePath = overrideSavePath;
                    }
                    var fileName = $"{base._names.CommandNames.Webhooks}-{base._names.SubCommandNames.Create}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
                    base.WriteListResultsToReport<BoxWebhook, BoxWebhookMap>(saveCreated, fileName, savePath, fileFormat);
                }
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e.Message);
                Reporter.WriteError(e.Message);
            }
        }

		protected async Task UpdateWebhooksFromFile(string path, string asUser = "",
			bool save = false, string overrideSavePath = "", string overrideSaveFileFormat = "")
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
				List<BoxWebhook> saveUpdated = new List<BoxWebhook>();

				foreach (var webhookRequest in webhookRequests)
				{
					Reporter.WriteInformation($"Processing a webhook request: {webhookRequest.Address}");
                    BoxWebhook updatedWebhook = null;
					try
					{
						updatedWebhook = await boxClient.WebhooksManager.UpdateWebhookAsync(webhookRequest);
					}
					catch (Exception e)
					{
						Reporter.WriteError("Couldn't update webhook...");
						Reporter.WriteError(e.Message);
					}
					Reporter.WriteSuccess("Updated a webhook:");
					if (updatedWebhook != null)
					{
						this.PrintWebhook(updatedWebhook);
						if (save || !string.IsNullOrEmpty(overrideSavePath) || base._settings.GetAutoSaveSetting())
						{
							saveUpdated.Add(updatedWebhook);
						}
					}
				}
				Reporter.WriteInformation("Finished processing webhooks...");
				if (save || !string.IsNullOrEmpty(overrideSavePath) || base._settings.GetAutoSaveSetting())
				{
					var fileFormat = base._settings.GetBoxReportsFileFormatSetting();
					if (!string.IsNullOrEmpty(overrideSaveFileFormat))
					{
						fileFormat = overrideSaveFileFormat;
					}
					var savePath = base._settings.GetBoxReportsFolderPath();
					if (!string.IsNullOrEmpty(overrideSavePath))
					{
						savePath = overrideSavePath;
					}
					var fileName = $"{base._names.CommandNames.Webhooks}-{base._names.SubCommandNames.Update}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
					base.WriteListResultsToReport<BoxWebhook, BoxWebhookMap>(saveUpdated, fileName, savePath, fileFormat);
				}
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