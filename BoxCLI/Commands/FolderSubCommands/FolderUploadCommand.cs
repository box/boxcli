using System;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.FolderSubCommands
{
    public class FolderUploadCommand : FolderSubCommandBase
    {
        private CommandArgument _folderPath;
        // private CommandOption _bulkPath;
        // private CommandOption _filePath;
        // private CommandOption _fileFormat;
        // private CommandOption _save;
        private CommandOption _parentFolderId;
        private CommandOption _idOnly;
        private CommandOption _alternativeFolderName;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public FolderUploadCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Upload a local folder to create a new folder in Box";
            // _bulkPath = BulkFilePathOption.ConfigureOption(command);
            // _filePath = FilePathOption.ConfigureOption(command);
            // _fileFormat = FileFormatOption.ConfigureOption(command);
            // _save = SaveOption.ConfigureOption(command);
            _idOnly = IdOnlyOption.ConfigureOption(command);
            _alternativeFolderName = command.Option("--folder-name", "Name to use for folder if not using local folder name.", CommandOptionType.SingleValue);
            _parentFolderId = command.Option("-p|--parent-folder",
                                                "Id of folder to upload to, defaults to the root folder",
                                                CommandOptionType.SingleValue);
            _folderPath = command.Argument("localFolderPath", "Path to local folder");
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunUpload();
            return await base.Execute();
        }

        protected async Task RunUpload()
        {
            // if (this._bulkPath.HasValue())
            // {
            //     return;
            // }
            base.CheckForValue(this._folderPath.Value, _app, "A path to a local folder is required");
            try
            {
                var BoxClient = base.ConfigureBoxClient(base._asUser.Value());
                string name;
                if (this._alternativeFolderName.HasValue())
                {
                    name = this._alternativeFolderName.Value();
                }
                else
                {
                    name = GeneralUtilities.ResolveItemName(this._folderPath.Value);
                }
                var parentFolder = (this._parentFolderId.HasValue()) ? this._parentFolderId.Value() : "0";
                var createdFolder = await base.CreateFolderWithIncreasingCount(BoxClient, name, parentFolder, this._idOnly.HasValue());
                if (!string.IsNullOrEmpty(createdFolder.Id))
                {

                    await base.UploadFolder(this._folderPath.Value, createdFolder.Id);
                    var finishedFolder = await BoxClient.FoldersManager.GetInformationAsync(createdFolder.Id);
                    if (this._idOnly.HasValue())
                    {
                        Reporter.WriteInformation(finishedFolder.Id);
                        return;
                    }
                    if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
                    {
                        base.OutputJson(finishedFolder);
                        return;
                    }
                    base.PrintFolder(finishedFolder);
                }
                else
                {
                    throw new Exception("There was a problem creating the folder.");
                }
            }
            catch (Exception e)
            {
                Reporter.WriteError(e.Message);
            }
        }
    }
}