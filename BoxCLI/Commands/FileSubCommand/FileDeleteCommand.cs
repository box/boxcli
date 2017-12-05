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

namespace BoxCLI.Commands.FileSubCommand
{
    public class FileDeleteCommand : FileSubCommandBase
    {
        private CommandArgument _fileId;
        private CommandOption _etag;
        private CommandOption _force;
        private CommandOption _dontPrompt;
        private CommandLineApplication _app;
        public FileDeleteCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Delete a file.";
            _fileId = command.Argument("fileId",
                               "Id of file to delete");
            _etag = command.Option("--etag", "Only delete if etag value matches", CommandOptionType.SingleValue);
            _force = command.Option("-f|--force", "Permanently delete a file", CommandOptionType.NoValue);
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

        private async Task RunDelete()
        {
            base.CheckForFileId(this._fileId.Value, this._app);
            var fileDeleted = false;
            if (this._dontPrompt.HasValue())
            {
                fileDeleted = await DeleteFile();
            }
            else
            {
                Reporter.WriteWarningNoNewLine("Are you sure you want to delete this file? y/N ");
                var yNKey = "n";
                yNKey = Console.ReadLine().ToLower();
                if (yNKey != "y")
                {
                    Reporter.WriteInformation("Aborted file deletion.");
                    return;
                }
                else 
                {
                    fileDeleted = await DeleteFile();
                }
            }
            if (fileDeleted)
            {
                Reporter.WriteSuccess($"Deleted file {this._fileId.Value}");
            }
            else
            {
                Reporter.WriteError($"Couldn't delete file {this._fileId.Value}");
            }
        }

        private async Task<bool> DeleteFile()
        {
            var fileDeleted = false;
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            if (this._force.HasValue())
            {
                fileDeleted = await boxClient.FilesManager.DeleteAsync(this._fileId.Value, this._etag.Value());
                try
                {
                    fileDeleted = await boxClient.FilesManager.PurgeTrashedAsync(this._fileId.Value);
                }
                catch (BoxException e)
                {
                    if (e.StatusCode == HttpStatusCode.NotFound)
                    {
                        fileDeleted = true;
                    }
                    else
                    {
                        throw e;
                    }
                }
            }
            else
            {
                fileDeleted = await boxClient.FilesManager.DeleteAsync(this._fileId.Value, this._etag.Value());
            }
            return fileDeleted;
        }
    }
}