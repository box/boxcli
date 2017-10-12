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

namespace BoxCLI.Commands.SharedLinkSubCommands
{
    public class SharedLinkSubCommandBase : BoxBaseCommand
    {
        protected CommandOption _asUser;
        protected readonly BoxType _t;
        public SharedLinkSubCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names, BoxType t)
            : base(boxPlatformBuilder, home, names)
        {
            _t = t;
        }

        public override void Configure(CommandLineApplication command)
        {
            _asUser = AsUserOption.ConfigureOption(command);
            base.Configure(command);
        }

        protected async Task ProcessSharedLinksFromFile(string id, string path, BoxType t, string asUser = "", bool json = false)
        {
            var boxClient = base.ConfigureBoxClient(asUser);
            if (!string.IsNullOrEmpty(path))
            {
                path = GeneralUtilities.TranslatePath(path);
            }
            try
            {
                var sharedLinkRequests = base.ReadFile<BoxSharedLinkRequest, BoxSharedLinkRequestMap>(path);
                foreach (var sharedLinkRequest in sharedLinkRequests)
                {
                    if (t == BoxType.file)
                    {
                        var createdSharedLink = await boxClient.FilesManager.CreateSharedLinkAsync(id, sharedLinkRequest);
                        this.PrintSharedLink(createdSharedLink.SharedLink, json);
                    }
                    else if (t == BoxType.folder)
                    {
                        var createdSharedLink = await boxClient.FoldersManager.CreateSharedLinkAsync(id, sharedLinkRequest);
                        this.PrintSharedLink(createdSharedLink.SharedLink, json);
                    }
                }
            }
            catch (Exception e)
            {
                Reporter.WriteError(e.Message);
            }
        }

        protected virtual void PrintSharedLink(BoxSharedLink link, bool json)
        {
            if (json)
            {
                base.OutputJson(link);
                return;
            }
            else
            {
                this.PrintSharedLink(link);
            }
        }
        protected virtual void PrintSharedLink(BoxSharedLink link)
        {
            if (link == null)
            {
                Reporter.WriteInformation("This item has no shared links.");
            }
            Reporter.WriteInformation($"Access level: {link.Access.Value}");
            Reporter.WriteInformation($"Download URL: {link.DownloadUrl}");
            Reporter.WriteInformation($"Download count: {link.DownloadCount}");
            Reporter.WriteInformation($"Preview count: {link.PreviewCount}");
        }
    }
}