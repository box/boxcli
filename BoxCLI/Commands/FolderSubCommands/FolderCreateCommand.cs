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
    public class FolderCreateCommand : FolderSubCommandBase
    {
        private CommandArgument _parentFolderId;
        private CommandArgument _name;
        private CommandOption _bulkPath;
        private CommandOption _filePath;
        private CommandOption _fileFormat;
        private CommandOption _save;
        private CommandOption _idOnly;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public FolderCreateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Create a new folder";
            _bulkPath = BulkFilePathOption.ConfigureOption(command);
            _filePath = FilePathOption.ConfigureOption(command);
            _fileFormat = FileFormatOption.ConfigureOption(command);
            _save = SaveOption.ConfigureOption(command);
            _idOnly = IdOnlyOption.ConfigureOption(command);
            _parentFolderId = command.Argument("parentFolderId",
                               "Id of parent folder to add new folder to, use '0' for the root folder");
            _name = command.Argument("name", "Name of new folder");
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunCreate();
            return await base.Execute();
        }

        protected async Task RunCreate()
        {
            if (this._bulkPath.HasValue())
            {
                var json = false;
                if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
                {
                    json = true;
                }
                await this.CreateFoldersFromFile(this._bulkPath.Value(), this._save.HasValue(),
                                                 this._filePath.Value(), this._fileFormat.Value(), json: json);
                return;
            }
            base.CheckForParentId(this._parentFolderId.Value, this._app);
            var BoxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var folderRequest = new BoxFolderRequest();
            folderRequest.Parent = new BoxItemRequest();
            folderRequest.Parent.Id = this._parentFolderId.Value;
            folderRequest.Name = this._name.Value;
            var folder = await BoxClient.FoldersManager.CreateAsync(folderRequest);
            if (this._idOnly.HasValue())
            {
                Reporter.WriteInformation(folder.Id);
                return;
            }
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(folder);
                return;
            }
            base.PrintFolder(folder);
        }
    }
}