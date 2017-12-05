using System;
using System.Net;
using System.Threading.Tasks;
using Box.V2.Exceptions;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.FolderSubCommands
{
    public class FolderDeleteCommand : FolderSubCommandBase
    {
        private CommandArgument _folderId;
        private CommandOption _recursive;
        private CommandOption _force;
        private CommandOption _etag;
        private CommandOption _dontPrompt;
        private CommandLineApplication _app;
        public FolderDeleteCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Delete a folder";
            _folderId = command.Argument("folderId",
                               "Id of folder to delete");
            _recursive = command.Option("-r|--recursive", "Whether to delete this folder if it has items inside of it.", CommandOptionType.NoValue);
            _force = command.Option("-f|--force", "Permanently delete a folder", CommandOptionType.NoValue);
            _etag = command.Option("--etag", "Only delete if etag value matches", CommandOptionType.SingleValue);
            _dontPrompt = SuppressDeletePromptOption.ConfigureOption(command);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunDelete();
            return await base.Execute();
        }

        protected async Task RunDelete()
        {
            base.CheckForId(this._folderId.Value, this._app);

            var folderDeleted = false;
            if (this._dontPrompt.HasValue())
            {
                folderDeleted = await this.DeleteFolder();
            }
            else
            {
                Reporter.WriteWarningNoNewLine("Are you sure you want to delete this folder? y/N ");
                var yNKey = "n";
                yNKey = Console.ReadLine().ToLower();
                if (yNKey != "y")
                {
                    Reporter.WriteInformation("Aborted folder deletion.");
                    return;
                }
                else 
                {
                    folderDeleted = await this.DeleteFolder();
                }
            }
            if (folderDeleted)
            {
                Reporter.WriteSuccess($"Deleted folder {this._folderId.Value}");
            }
            else
            {
                Reporter.WriteError($"Couldn't delete folder {this._folderId.Value}");
            }
        }

        private async Task<bool> DeleteFolder()
        {
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var folderDeleted = await boxClient.FoldersManager.DeleteAsync(this._folderId.Value, this._recursive.HasValue(), this._etag.Value());
            if (this._force.HasValue())
            {

                try
                {
                    folderDeleted = await boxClient.FoldersManager.PurgeTrashedFolderAsync(this._folderId.Value);
                }
                catch (BoxException e)
                {
                    if (e.StatusCode == HttpStatusCode.NotFound)
                    {
                        folderDeleted = true;
                    }
                    else
                    {
                        throw e;
                    }
                }
            }
            else
            {
                folderDeleted = await boxClient.FoldersManager.PurgeTrashedFolderAsync(this._folderId.Value);
            }
            return folderDeleted;
        }
    }
}