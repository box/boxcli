using System;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.SharedLinkSubCommands
{
    public class SharedLinkUpdateCommand : SharedLinkSubCommandBase
    {
        private CommandArgument _id;
        private CommandArgument _type;
        private CommandOption _access;
        private CommandOption _password;
        private CommandOption _unsharedAt;
        private CommandOption _canDownload;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public SharedLinkUpdateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names, BoxType t)
            : base(boxPlatformBuilder, home, names, t)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Update a shared link.";

            _id = command.Argument("itemId", "Id of Box item to update");
            _access = command.Option("--access <ACCESS>", "Shared link access level", CommandOptionType.SingleValue);
            _password = command.Option("--password <PASSWORD>", "Shared link password", CommandOptionType.SingleValue);
            _unsharedAt = command.Option("--unshared-at <TIME>", "Time that this link will become disabled, use formatting like 03w for 3 weeks.", CommandOptionType.SingleValue);
            _canDownload = command.Option("--can-download", "Whether the shared link allows downloads", CommandOptionType.NoValue);
            if (base._t == BoxType.enterprise)
            {
                _type = command.Argument("itemType", "Type of item for shared link: either file or folder.");
            }
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
            base.CheckForId(this._id.Value, this._app);
            if (base._t == BoxType.enterprise)
            {
                if (this._type.Value == String.Empty && this._type.Value != SharedLinkSubCommandBase.BOX_FILE && this._type.Value != SharedLinkSubCommandBase.BOX_FOLDER)
                {
                    _app.ShowHelp();
                    throw new Exception("You must provide an item type for this command: choose file or folder");
                }
            }
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            if (base._t == BoxType.file || (this._type != null && this._type.Value == SharedLinkSubCommandBase.BOX_FILE))
            {
                var fileRequest = new BoxFileRequest();
                fileRequest.Id = this._id.Value;
                fileRequest.SharedLink = new BoxSharedLinkRequest();
                if (this._access.HasValue())
                {
                    fileRequest.SharedLink.Access = base.ResolveSharedLinkAccessType(this._access.Value());
                }
                if (this._password.HasValue())
                {
                    fileRequest.SharedLink.Password = this._password.Value();
                }
                if (this._unsharedAt.HasValue())
                {
                    fileRequest.SharedLink.UnsharedAt = GeneralUtilities.GetDateTimeFromString(this._unsharedAt.Value());
                }
                if (this._canDownload.HasValue())
                {
                    fileRequest.SharedLink.Permissions = new BoxPermissionsRequest();
                    fileRequest.SharedLink.Permissions.Download = true;
                }
                var result = await boxClient.FilesManager.UpdateInformationAsync(fileRequest);
                if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
                {
                    base.OutputJson(result);
                    return;
                }
                Reporter.WriteSuccess("Updated shared link:");
                base.PrintSharedLink(result.SharedLink);
            }
            else if (base._t == BoxType.folder || (this._type != null && this._type.Value == SharedLinkSubCommandBase.BOX_FOLDER))
            {
                var folderUpdateRequest = new BoxFolderRequest();
                folderUpdateRequest.Id = this._id.Value;
                folderUpdateRequest.SharedLink = new BoxSharedLinkRequest();
                if (this._access.HasValue())
                {
                    folderUpdateRequest.SharedLink.Access = base.ResolveSharedLinkAccessType(this._access.Value());
                }
                if (this._password.HasValue())
                {
                    folderUpdateRequest.SharedLink.Password = this._password.Value();
                }
                if (this._unsharedAt.HasValue())
                {
                    folderUpdateRequest.SharedLink.UnsharedAt = GeneralUtilities.GetDateTimeFromString(this._unsharedAt.Value());
                }
                if (this._canDownload.HasValue())
                {
                    folderUpdateRequest.SharedLink.Permissions = new BoxPermissionsRequest();
                    folderUpdateRequest.SharedLink.Permissions.Download = true;
                }
                var updated = await boxClient.FoldersManager.UpdateInformationAsync(folderUpdateRequest);
                if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
                {
                    base.OutputJson(updated);
                    return;
                }
                Reporter.WriteSuccess("Updated shared link:");
                base.PrintSharedLink(updated.SharedLink);
            }
            else
            {
                throw new Exception("Box type not supported for this command.");
            }
        }
    }
}
