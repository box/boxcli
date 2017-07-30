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
    public class CollaborationUpdateCommand : CollaborationSubCommandBase
    {
        private CommandArgument _id;
        private CommandOption _path;
        private CommandOption _role;
        private CommandOption _status;
        private CommandOption _editor;
        private CommandOption _viewer;
        private CommandOption _previewer;
        private CommandOption _uploader;
        private CommandOption _previewerUploader;
        private CommandOption _viewerUploader;
        private CommandOption _coowner;
        private CommandOption _canViewPath;
        private CommandLineApplication _app;
        public CollaborationUpdateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names, BoxType t)
            : base(boxPlatformBuilder, home, names, t)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Update a collaboration";
            _id = command.Argument("collaborationId",
                                   "ID of the collaboration");
            _path = FilePathOption.ConfigureOption(command);
            _editor = command.Option("--editor", "Set the role to editor.", CommandOptionType.NoValue);
            _viewer = command.Option("--viewer", "Set the role to viewer.", CommandOptionType.NoValue);
            _previewer = command.Option("--previewer", "Set the role to previewer.", CommandOptionType.NoValue);
            _uploader = command.Option("--uploader", "Set the role to uploader.", CommandOptionType.NoValue);
            _previewerUploader = command.Option("--previewer-uploader", "Set the role to previewer uploader.", CommandOptionType.NoValue);
            _viewerUploader = command.Option("--viewer-uploader", "Set the role to viewer uploader.", CommandOptionType.NoValue);
            _coowner = command.Option("--co-owner", "Set the role to co-owner.", CommandOptionType.NoValue);
            _role = command.Option("-r|--role", "An option to manually enter the role", CommandOptionType.SingleValue);
            _status = command.Option("--status", "Update the collaboration status", CommandOptionType.SingleValue);
            _canViewPath = command.Option("--can-view-path", "Whether view path collaboration feature is enabled or not.", CommandOptionType.NoValue);
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
            if (!string.IsNullOrEmpty(_path.Value()))
            {
                await base.ProcessCollaborationsFromFile(_id.Value, _path.Value(), base._t, _asUser.Value());
            }
            base.CheckForValue(this._id.Value, this._app, "A collaboration ID is required for this command.");
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
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
                };
                role = base.ProcessRoleOptions(roles);
            }

            var collabRequest = new BoxCollaborationRequest();
            collabRequest.Id = this._id.Value;
            if (this._canViewPath.HasValue())
            {
                collabRequest.CanViewPath = true;
            }
            if (this._status.HasValue())
            {
                collabRequest.Status = _status.Value();
            }
            collabRequest.Role = role;
            
            var result = await boxClient.CollaborationsManager.EditCollaborationAsync(collabRequest);
            base.PrintCollaboration(result);
        }
    }
}