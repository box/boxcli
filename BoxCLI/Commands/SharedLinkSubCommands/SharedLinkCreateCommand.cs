using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.SharedLinkSubCommands
{
    public class SharedLinkCreateCommand : SharedLinkSubCommandBase
    {
        private CommandArgument _id;
        private CommandArgument _type;
        private CommandOption _path;
        private CommandOption _access;
        private CommandOption _password;
        private CommandOption _unsharedAt;
        private CommandOption _canDownload;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public SharedLinkCreateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names, BoxType t)
            : base(boxPlatformBuilder, home, names, t)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Create a shared link for a Box item.";
            _path = BulkFilePathOption.ConfigureOption(command);
            _id = command.Argument("boxItemId",
                                   "Id of the Box item");
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
            await this.RunCreate();
            return await base.Execute();
        }

        private async Task RunCreate()
        {
            if (!string.IsNullOrEmpty(_path.Value()))
            {
                var json = false;
                if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
                {
                    json = true;
                }
                await base.ProcessSharedLinksFromFile(_id.Value, _path.Value(), base._t, json: json);
                return;
            }
            base.CheckForId(this._id.Value, this._app);
            if (base._t == BoxType.enterprise)
            {
                if (this._type.Value == String.Empty || (this._type.Value != SharedLinkSubCommandBase.BOX_FILE && this._type.Value != SharedLinkSubCommandBase.BOX_FOLDER))
                {
                    _app.ShowHelp();
                    throw new Exception("You must provide an item type for this command: choose file or folder");
                }
            }
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var sharedLinkRequest = new BoxSharedLinkRequest();
            if (this._access.HasValue())
            {
                sharedLinkRequest.Access = base.ResolveSharedLinkAccessType(this._access.Value());
            }
            if (this._password.HasValue())
            {
                sharedLinkRequest.Password = this._password.Value();
            }
            if (this._unsharedAt.HasValue())
            {
                sharedLinkRequest.UnsharedAt = GeneralUtilities.GetDateTimeFromString(this._unsharedAt.Value());
            }
            if (this._canDownload.HasValue())
            {
                sharedLinkRequest.Permissions = new BoxPermissionsRequest();
                sharedLinkRequest.Permissions.Download = true;
            }
            if (base._t == BoxType.file || (this._type != null && this._type.Value == SharedLinkSubCommandBase.BOX_FILE))
            {
                var result = await boxClient.FilesManager.CreateSharedLinkAsync(this._id.Value, sharedLinkRequest);
                if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
                {
                    base.OutputJson(result);
                    return;
                }
                Reporter.WriteSuccess("Created shared link:");
                base.PrintSharedLink(result.SharedLink);
            }
            else if (base._t == BoxType.folder || (this._type != null && this._type.Value == SharedLinkSubCommandBase.BOX_FOLDER))
            {
                var result = await boxClient.FoldersManager.CreateSharedLinkAsync(this._id.Value, sharedLinkRequest);
                if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
                {
                    base.OutputJson(result);
                    return;
                }
                Reporter.WriteSuccess("Created shared link:");
                base.PrintSharedLink(result.SharedLink);
            }
            else
            {
                throw new Exception("Box type not supported for this command.");
            }
        }
    }
}