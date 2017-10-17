using System;
using System.Collections.Generic;
using System.Text;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;
using System.Threading.Tasks;
using Box.V2.Models;

namespace BoxCLI.Commands.FolderSubCommands
{
    class FolderRenameCommand : FolderSubCommandBase
    {
        private CommandLineApplication _app;
        private IBoxHome _home;
        private CommandArgument _folderId;
        private CommandArgument _folderName;
        private CommandOption _description;
        private CommandOption _etag;

        public FolderRenameCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names) : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }


        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Rename a folder.";
            _folderId = command.Argument("folderId",
                               "Id of folder to rename");
            _folderName = command.Argument("folderName",
                               "New name of folder");
            _description = command.Option("--description", "Change the folder description", CommandOptionType.SingleValue);
            _etag = command.Option("--etag", "Only rename if etag value matches", CommandOptionType.SingleValue);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunRename();
            return await base.Execute();
        }

        protected async Task RunRename()
        {
            base.CheckForId(this._folderId.Value, this._app);
            base.CheckForValue(this._folderName.Value, _app, "A name value is required to rename a folder.");
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            var folderRenameRequest = new BoxFolderRequest()
            {
                Name = this._folderName.Value,
                Id = this._folderId.Value
            };

            if(this._description.HasValue())
            {
                folderRenameRequest.Description = this._description.Value();
            }
            BoxFolder folder;
            if(this._etag.HasValue())
            {
                folder = await boxClient.FoldersManager.UpdateInformationAsync(folderRenameRequest, etag: this._etag.Value());
            }
            else
            {
                folder = await boxClient.FoldersManager.UpdateInformationAsync(folderRenameRequest);
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
