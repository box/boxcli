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

namespace BoxCLI.Commands.CollaborationSubCommands
{
    public class CollaborationAddCommand : CollaborationSubCommandBase
    {
        private CommandArgument _id;
        private CommandOption _path;
        private CommandOption _role;
        private CommandOption _editor;
        private CommandOption _viewer;
        private CommandOption _previewer;
        private CommandOption _uploader;
        private CommandOption _previewerUploader;
        private CommandOption _viewerUploader;
        private CommandOption _coowner;
        private CommandOption _owner;
        private CommandOption _userId;
        private CommandOption _groupId;
        private CommandOption _login;
        private CommandOption _canViewPath;
        private CommandOption _idOnly;
        private CommandArgument _type;
        private CommandLineApplication _app;
        private IBoxHome _home;
        public CollaborationAddCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names, BoxType t)
            : base(boxPlatformBuilder, home, names, t)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Create a collaboration for a Box item.";
            _path = FilePathOption.ConfigureOption(command);
            _editor = command.Option("--editor", "Set the role to editor.", CommandOptionType.NoValue);
            _viewer = command.Option("--viewer", "Set the role to viewer.", CommandOptionType.NoValue);
            _previewer = command.Option("--previewer", "Set the role to previewer.", CommandOptionType.NoValue);
            _uploader = command.Option("--uploader", "Set the role to uploader.", CommandOptionType.NoValue);
            _previewerUploader = command.Option("--previewer-uploader", "Set the role to previewer uploader.", CommandOptionType.NoValue);
            _viewerUploader = command.Option("--viewer-uploader", "Set the role to viewer uploader.", CommandOptionType.NoValue);
            _coowner = command.Option("--co-owner", "Set the role to co-owner.", CommandOptionType.NoValue);
            _owner = command.Option("--owner", "Set the role to owner.", CommandOptionType.NoValue);
            _role = command.Option("-r|--role", "An option to manually enter the role", CommandOptionType.SingleValue);
            _userId = command.Option("--user-id", "Id for user to collaborate", CommandOptionType.SingleValue);
            _groupId = command.Option("--group-id", "Id for group to collaborate", CommandOptionType.SingleValue);
            _login = command.Option("--login", "Login for user to collaborate", CommandOptionType.SingleValue);
            _canViewPath = command.Option("--can-view-path", "Whether view path collaboration feature is enabled or not.", CommandOptionType.NoValue);
            _idOnly = IdOnlyOption.ConfigureOption(command);
            _id = command.Argument("boxItemId",
                                   "Id of the Box item");
            if (base._t == BoxType.enterprise)
            {
                _type = command.Argument("boxItemType", "Type of Box item");
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
                await base.ProcessCollaborationsFromFile(_id.Value, _path.Value(), base._t, _asUser.Value());
            }
            base.CheckForValue(this._id.Value, this._app, "An ID is required for this command.");
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            BoxType type;
            if (base._t == BoxType.enterprise)
            {
                type = base.ProcessType(this._type.Value);
            }
            else
            {
                type = base._t;
            }
            string role;
            if (this._role.HasValue())
            {
                role = this._role.Value();
            }
            else
            {
                var roles = new Dictionary<string, bool>()
                {
                    {"editor", this._editor.HasValue()},
                    {"viewer", this._viewer.HasValue()},
                    {"uploader", this._uploader.HasValue()},
                    {"previewer uploader", this._previewerUploader.HasValue()},
                    {"viewer uploader", this._viewerUploader.HasValue()},
                    {"co-owner", this._coowner.HasValue()},
                    {"owner", this._owner.HasValue()},
                };
                role = base.ProcessRoleOptions(roles);
            }
            var collabRequest = new BoxCollaborationRequest();
            if (this._canViewPath.HasValue())
            {
                collabRequest.CanViewPath = true;
            }

            if (this._userId.HasValue())
            {
                collabRequest.AccessibleBy = new BoxCollaborationUserRequest()
                {
                    Id = this._userId.Value(),
                    Type = BoxType.user
                };
            }
            else if (this._groupId.HasValue())
            {
                collabRequest.AccessibleBy = new BoxCollaborationUserRequest()
                {
                    Id = this._groupId.Value(),
                    Type = BoxType.group
                };
            }
            else if (this._login.HasValue())
            {
                collabRequest.AccessibleBy = new BoxCollaborationUserRequest()
                {
                    Login = this._login.Value(),
                    Type = BoxType.user
                };
            }
            collabRequest.Item = new BoxRequestEntity();
            collabRequest.Item.Type = type;
            collabRequest.Item.Id = this._id.Value;
            collabRequest.Role = role;
            var result = await boxClient.CollaborationsManager.AddCollaborationAsync(collabRequest);
            if (this._idOnly.HasValue())
            {
                Reporter.WriteInformation(result.Id);
                return;
            }
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(result);
                return;
            }
            base.PrintCollaboration(result);
        }
    }
}