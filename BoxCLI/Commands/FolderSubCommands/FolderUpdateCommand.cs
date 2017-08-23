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
    public class FolderUpdateCommand : FolderSubCommandBase
    {
        private CommandArgument _folderId;
        private CommandOption _bulkFilePath;
        private CommandOption _filePath;
        private CommandOption _fileFormat;
        private CommandOption _save;
        private CommandOption _parentFolderId;
        private CommandOption _name;
        private CommandOption _description;
        private CommandOption _notSynced;
        private CommandOption _partiallySynced;
        private CommandOption _synced;
        private CommandOption _access;
        private CommandOption _sharedLinkAccess;
        private CommandOption _sharedLinkPassword;
        private CommandOption _sharedLinkUnsharedAt;
        private CommandOption _sharedLinkCanDownload;
        private CommandOption _tags;
        private CommandOption _etag;
        private CommandLineApplication _app;
        public FolderUpdateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Update a folder.";
            _folderId = command.Argument("folderId",
                               "Id of folder to update");
            _bulkFilePath = BulkFilePathOption.ConfigureOption(command);
            _filePath = FilePathOption.ConfigureOption(command);
            _fileFormat = FileFormatOption.ConfigureOption(command);
            _save = SaveOption.ConfigureOption(command);
            _parentFolderId = command.Option("--parent-folder-id",
                                        "Id of new parent folder <ID>", CommandOptionType.SingleValue);
            _name = command.Option("--name",
                                        "New name for folder <NAME>", CommandOptionType.SingleValue);
            _description = command.Option("--description",
                                        "New description for folder <DESCRIPTION>", CommandOptionType.SingleValue);
            _notSynced = command.Option("--not-synced",
                                        "Set sync state to not synced", CommandOptionType.NoValue);
            _partiallySynced = command.Option("--partially-synced",
                                        "Set sync state to partially synced", CommandOptionType.NoValue);
            _synced = command.Option("--synced",
                                        "Set sync state to synced", CommandOptionType.NoValue);
            _access = command.Option("--folder-upload-email-access <ACCESS>", "Upload email access level", CommandOptionType.SingleValue);
            _sharedLinkAccess = command.Option("--shared-link-access <ACCESS>", "Shared link access level", CommandOptionType.SingleValue);
            _sharedLinkPassword = command.Option("--shared-link-password <PASSWORD>", "Shared link password", CommandOptionType.SingleValue);
            _sharedLinkUnsharedAt = command.Option("--shared-link-unshared-at <TIME>", "Time that this link will become disabled, use formatting like 03w for 3 weeks.", CommandOptionType.SingleValue);
            _sharedLinkCanDownload = command.Option("--shared-link-can-download", "Whether the shared link allows downloads", CommandOptionType.NoValue);
            _tags = command.Option("--tags <TAGS>", "Comma seperated tags", CommandOptionType.SingleValue);
            _etag = command.Option("--etag <ETAG>", "Only move if etag value matches", CommandOptionType.SingleValue);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunUpdate();
            return await base.Execute();
        }

        private async Task RunUpdate()
        {
            if(this._bulkFilePath.HasValue())
            {
                await this.UpdateFoldersFromFile(this._bulkFilePath.Value(), base._asUser.Value(), this._save.HasValue(), 
                                                 this._filePath.Value(), this._fileFormat.Value());
                return;
            }
            base.CheckForId(this._folderId.Value, this._app);
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            var folderUpdateRequest = new BoxFolderRequest();
            folderUpdateRequest.Id = this._folderId.Value;
            if (this._parentFolderId.HasValue())
            {
                folderUpdateRequest.Parent = new BoxRequestEntity()
                {
                    Id = this._parentFolderId.Value()
                };
            }

            if (this._access.HasValue())
            {
                folderUpdateRequest.FolderUploadEmail = new BoxEmailRequest()
                {
                    Access = this._access.Value()
                };
            }

            if (this._sharedLinkAccess.HasValue() || this._sharedLinkPassword.HasValue() || this._sharedLinkUnsharedAt.HasValue() || this._sharedLinkCanDownload.HasValue())
            {
                folderUpdateRequest.SharedLink = new BoxSharedLinkRequest();
                if (this._sharedLinkAccess.HasValue())
                {
                    folderUpdateRequest.SharedLink.Access = base.ResolveSharedLinkAccessType(this._sharedLinkAccess.Value());
                }
                if (this._sharedLinkPassword.HasValue())
                {
                    folderUpdateRequest.SharedLink.Password = this._sharedLinkPassword.Value();
                }
                if (this._sharedLinkUnsharedAt.HasValue())
                {
                    folderUpdateRequest.SharedLink.UnsharedAt = GeneralUtilities.GetDateTimeFromString(this._sharedLinkUnsharedAt.Value());
                }
                if (this._sharedLinkCanDownload.HasValue())
                {
                    folderUpdateRequest.SharedLink.Permissions = new BoxPermissionsRequest();
                    folderUpdateRequest.SharedLink.Permissions.Download = true;
                }
            }

            if (this._notSynced.HasValue())
            {
                folderUpdateRequest.SyncState = BoxSyncStateType.not_synced;
            }
            else if (this._partiallySynced.HasValue())
            {
                folderUpdateRequest.SyncState = BoxSyncStateType.partially_synced;
            }
            else if (this._synced.HasValue())
            {
                folderUpdateRequest.SyncState = BoxSyncStateType.synced;
            }

            if (this._tags.HasValue())
            {
                folderUpdateRequest.Tags = this._tags.Value().Split(',');
            }
            var updated = await boxClient.FoldersManager.UpdateInformationAsync(folderUpdateRequest);
            if (base._json.HasValue())
            {
                base.OutputJson(updated);
                return;
            }
            Reporter.WriteSuccess($"Updated folder {this._folderId.Value}");
            base.PrintFolder(updated);
        }
    }
}
