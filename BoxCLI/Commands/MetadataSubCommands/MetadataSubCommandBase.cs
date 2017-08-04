using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandModels;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.CsvModels;
using BoxCLI.CommandUtilities.Globalization;
using CsvHelper;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.MetadataSubCommands
{
    public class MetadataSubCommandBase : BoxBaseCommand
    {
        protected CommandOption _asUser;
        protected readonly BoxType _t;
        public MetadataSubCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names, BoxType t)
            : base(boxPlatformBuilder, home, names)
        {
            _t = t;
        }

        public override void Configure(CommandLineApplication command)
        {
            _asUser = AsUserOption.ConfigureOption(command);
            base.Configure(command);
        }

        protected virtual void CheckForScope(string scope, CommandLineApplication app)
        {
            if (string.IsNullOrEmpty(scope))
            {
                app.ShowHelp();
                throw new Exception("The scope of the metadata object is required for this command.");
            }
        }

        protected virtual void CheckForTemplate(string template, CommandLineApplication app)
        {
            if (string.IsNullOrEmpty(template))
            {
                app.ShowHelp();
                throw new Exception("The key of the template is required for this command.");
            }
        }

        protected virtual Dictionary<string, object> MetadataKeyValuesFromConsole()
        {
            var q = "";
            var key = "";
            var val = "";
            var md = new Dictionary<string, object>();
            do
            {
                if (md.Count > 0)
                {
                    Reporter.WriteInformation("Current metadata object:");
                    foreach (var k in md.Keys)
                    {
                        Reporter.WriteInformation($"Key: {k} - Value: {md[k]}");
                    }
                }
                Reporter.WriteInformation("Enter the metadata key:");
                key = Console.ReadLine();
                Reporter.WriteInformation("Enter the metadata value:");
                val = Console.ReadLine();
                md.Add(key, val);
                Reporter.WriteInformation("Enter to continue, q to quit.");
                q = Console.ReadLine().ToLower();
            }
            while (q != "q");
            Reporter.WriteSuccess("Finished building metadata.");
            return md;
        }

        protected virtual void PrintMetadataCollection(BoxMetadataTemplateCollection<Dictionary<string, object>> mdt)
        {
            foreach (var md in mdt.Entries)
            {
                this.PrintMetadata(md);
            }
        }
        protected virtual void PrintMetadata(Dictionary<string, object> md)
        {
            foreach (var key in md.Keys)
            {
                Reporter.WriteInformation($"{key}: {md[key]}");
            }
        }

		protected virtual List<BoxMetadataForCsv> ReadMetadataCsvFile(string filePath)
		{
			var allMetadataOnItem = new List<BoxMetadataForCsv>();
			using (var fs = File.OpenText(filePath))
			using (var csv = new CsvReader(fs))
			{
				System.Console.WriteLine("Processing csv...");

				csv.Configuration.RegisterClassMap(typeof(BoxMetadataRequestMap));
				allMetadataOnItem = csv.GetRecords<BoxMetadataForCsv>().ToList();
			}
			
			return allMetadataOnItem;
		}

		protected async virtual Task AddMetadataToItemFromFile(string path, string asUser = "", string type = "",
			bool save = false, string overrideSavePath = "", string overrideSaveFileFormat = "")
		{
			var boxClient = base.ConfigureBoxClient(asUser);
			if (!string.IsNullOrEmpty(path))
			{
				path = GeneralUtilities.TranslatePath(path);
			}
			try
			{
				Reporter.WriteInformation("Reading file...");
                var metadataRequests = this.ReadMetadataCsvFile(path);
				var saveCreated = new List<BoxMetadataForCsv>();

				foreach (var metadataRequest in metadataRequests)
				{
					Reporter.WriteInformation($"Processing a metadata request: {metadataRequest.TemplateKey}");
					Dictionary<string, object> createdMetadata = null;
                    if(metadataRequest.ItemType != null)
                    {
                        type = metadataRequest.ItemType;
                    }
                    else
                    {
                        throw new Exception("Must have a Box Item type of file or folder");
                    }
					try
					{
                        Reporter.WriteInformation("Attempting create metadata...");
                        foreach(var kv in metadataRequest.Metadata)
                        {
                            Reporter.WriteInformation($"Key: {kv.Key} Value: {kv.Value}");
                        }
                        if (type == "file")
                        {
                            createdMetadata = await boxClient.MetadataManager.CreateFileMetadataAsync(metadataRequest.ItemId, metadataRequest.Metadata, metadataRequest.Scope, metadataRequest.TemplateKey);
                        }
                        else if (type == "folder")
                        {
                            createdMetadata = await boxClient.MetadataManager.CreateFolderMetadataAsync(metadataRequest.ItemId, metadataRequest.Metadata, metadataRequest.Scope, metadataRequest.TemplateKey);
                        }
                        else
                        {
                            throw new Exception("Metadata currently only supported on files and folders.");
                        }
					}
					catch (Exception e)
					{
						Reporter.WriteError("Couldn't add metadata...");
						Reporter.WriteError(e.Message);
					}
					Reporter.WriteSuccess("Added metadata:");
					if (createdMetadata != null)
					{
						this.PrintMetadata(createdMetadata);
						if (save || !string.IsNullOrEmpty(overrideSavePath) || base._settings.GetAutoSaveSetting())
						{
                            saveCreated.Add(new BoxMetadataForCsv() 
                            {
                                TemplateKey = metadataRequest.TemplateKey,
                                Scope = metadataRequest.Scope,
                                ItemId = metadataRequest.ItemId,
                                ItemType = metadataRequest.ItemType,
                                Metadata = createdMetadata
                            });
						}
					}
				}
				Reporter.WriteInformation("Finished processing metadata...");
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
					var fileName = $"{base._names.CommandNames.Metadata}-{base._names.SubCommandNames.Create}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
					base.WriteMetadataCollectionResultsToReport(saveCreated, fileName, savePath, fileFormat);
				}
			}
			catch (Exception e)
			{
				System.Console.WriteLine(e.Message);
				Reporter.WriteError(e.Message);
			}
		}


        //protected virtual bool ProcessMetadataTemplates(string path, string asUser = "",
        //    bool save = false, string overrideSavePath = "", string overrideSaveFileFormat = "")
        //{
        //    var boxClient = base.ConfigureBoxClient(asUser);
        //    if (!string.IsNullOrEmpty(path))
        //    {
        //        path = GeneralUtilities.TranslatePath(path);
        //    }

        //    try
        //    {
        //        Reporter.WriteInformation("Reading file...");
        //        var metadataTemplateRequests = base.ReadFile<BoxMetadataTemplate, Dictionary<string, object>>(path);
        //        List<BoxWebhook> saveUpdated = new List<BoxWebhook>();

        //        foreach (var webhookRequest in webhookRequests)
        //        {
        //            Reporter.WriteInformation($"Processing a webhook request: {webhookRequest.Address}");
        //            BoxWebhook updatedWebhook = null;
        //            try
        //            {
        //                updatedWebhook = await boxClient.WebhooksManager.UpdateWebhookAsync(webhookRequest);
        //            }
        //            catch (Exception e)
        //            {
        //                Reporter.WriteError("Couldn't update webhook...");
        //                Reporter.WriteError(e.Message);
        //            }
        //            Reporter.WriteSuccess("Updated a webhook:");
        //            if (updatedWebhook != null)
        //            {
        //                this.PrintWebhook(updatedWebhook);
        //                if (save || !string.IsNullOrEmpty(overrideSavePath) || base._settings.GetAutoSaveSetting())
        //                {
        //                    saveUpdated.Add(updatedWebhook);
        //                }
        //            }
        //        }
        //        Reporter.WriteInformation("Finished processing webhooks...");
        //        if (save || !string.IsNullOrEmpty(overrideSavePath) || base._settings.GetAutoSaveSetting())
        //        {
        //            var fileFormat = base._settings.GetBoxReportsFileFormatSetting();
        //            if (!string.IsNullOrEmpty(overrideSaveFileFormat))
        //            {
        //                fileFormat = overrideSaveFileFormat;
        //            }
        //            var savePath = base._settings.GetBoxReportsFolderPath();
        //            if (!string.IsNullOrEmpty(overrideSavePath))
        //            {
        //                savePath = overrideSavePath;
        //            }
        //            var fileName = $"{base._names.CommandNames.Webhooks}-{base._names.SubCommandNames.Update}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
        //            base.WriteListResultsToReport<BoxWebhook, BoxWebhookMap>(saveUpdated, fileName, savePath, fileFormat);
        //        }
        //    }
        //    catch
        //    {

        //    }

        //    return true;
        //}

    }
}