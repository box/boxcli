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

namespace BoxCLI.Commands.FolderSubCommands
{
    public class FolderListItemsCommand : FolderSubCommandBase
    {
        private CommandArgument _folderId;
        private CommandOption _save;
        private CommandOption _fileFormat;
        private CommandLineApplication _app;
        public FolderListItemsCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get information about a folder.";
            _folderId = command.Argument("folderId",
                               "Id of folder to manage, use '0' for the root folder");
            _save = SaveOption.ConfigureOption(command);
            _fileFormat = FileFormatOption.ConfigureOption(command);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunGetItems();
            return await base.Execute();
        }

        protected async Task RunGetItems()
        {
            base.CheckForId(this._folderId.Value, this._app);
            try
            {
                var boxClient = base.ConfigureBoxClient(base._asUser.Value());
                if(this._save.HasValue())
                {
                    Reporter.WriteInformation("Saving file...");
                    var foldersFileName = $"{base._names.CommandNames.Folders}-{base._names.SubCommandNames.List}-folder-id-{this._folderId.Value}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
                    var filesFileName = $"{base._names.CommandNames.Files}-{base._names.SubCommandNames.List}-folder-id-{this._folderId.Value}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
                    var collection = await boxClient.FoldersManager.GetFolderItemsAsync(this._folderId.Value, 1000, autoPaginate: true);
					var folders = collection.Entries.FindAll(x => x.Type == "folder").Cast<BoxFolder>().ToList();
                    var files = collection.Entries.FindAll(x => x.Type == "file").Cast<BoxFile>().ToList();
                    var savedFolders = base.WriteListResultsToReport<BoxFolder, BoxFolderMap>(folders, foldersFileName, fileFormat: this._fileFormat.Value());
                    var savedFiles = base.WriteListResultsToReport<BoxFile, BoxFileMap>(files, filesFileName, fileFormat: this._fileFormat.Value());
                    if(savedFiles && savedFolders)
                    {
                        Reporter.WriteSuccess("Saved file.");
                    }
                    else
                    {
                        Reporter.WriteError("Couldn't save file.");
                    }
                    return;
                }
                var BoxCollectionsIterators = base.GetIterators();
                await BoxCollectionsIterators.ListOffsetCollectionToConsole<BoxItem>((offset) =>
                {
                    return boxClient.FoldersManager.GetFolderItemsAsync(this._folderId.Value, 1000, offset: (int)offset);
                }, base.PrintItem);
            }
            catch (Exception e)
            {
                Reporter.WriteError(e.Message);
            }
        }
    }
}