using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandModels;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.FolderSubCommands
{
    public class FolderDownloadCommand : FolderSubCommandBase
    {
        private CommandArgument _folderId;
        private CommandOption _multiId;
        private CommandOption _bulkPath;
        private CommandLineApplication _app;
        public FolderDownloadCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Download all contents in a folder.";
            _folderId = command.Argument("folderId",
                               "Id of folder to download");
            _multiId = command.Option("-m|--multi",
                               "Download multiple folders with a comma separated list of IDs.",
                               CommandOptionType.NoValue);
            _bulkPath = BulkFilePathOption.ConfigureOption(command);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunDownload();
            return await base.Execute();
        }

        private async Task RunDownload()
        {
            var fileName = $"{base._names.CommandNames.Folders}-{base._names.SubCommandNames.Download}-{this._folderId.Value}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
            if (this._bulkPath.HasValue())
            {
                await base.ProcessFolderBulkDownload(this._bulkPath.Value(), this._asUser.Value(), fileName);
                return;
            }
            var BoxClient = base.ConfigureBoxClient(base._asUser.Value());
            if (this._multiId.HasValue())
            {
                var ids = this._folderId.Value;
                var idsList = ids.Split(',').ToList();
                var fileList = new List<BoxBulkDownload>();
                foreach (var id in idsList)
                {
                    var tempItems = await BoxClient.FoldersManager.GetFolderItemsAsync(id, 1000, autoPaginate: true);
                    var folderFiles = tempItems.Entries.Where(i => i.Type == "file");
                    foreach (var file in folderFiles)
                    {
                        fileList.Add(new BoxBulkDownload()
                        {
                            Id = file.Id
                        });

                    }
                }
                await base.BulkDownload(fileList, fileName);
                return;
            }
            base.CheckForId(this._folderId.Value, this._app);
            var items = await BoxClient.FoldersManager.GetFolderItemsAsync(this._folderId.Value, 1000, autoPaginate: true);
            var files = items.Entries.Where(i => i.Type == "file");
            var fileListFromItems = new List<BoxBulkDownload>();
            foreach (var file in files)
            {
                fileListFromItems.Add(new BoxBulkDownload()
                {
                    Id = file.Id
                });

            }
            await base.BulkDownload(fileListFromItems, fileName);
        }
    }
}