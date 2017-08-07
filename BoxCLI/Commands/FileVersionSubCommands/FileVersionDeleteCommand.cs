using System;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.Commands.FileSubCommand;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.FileVersionSubCommands
{
    public class FileVersionDeleteCommand : FileVersionSubCommandBase
    {
        private CommandArgument _fileId;
        private CommandArgument _fileVersionId;
        private CommandOption _etag;
        private CommandOption _dontPrompt;
        private CommandLineApplication _app;
        public FileVersionDeleteCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names) 
            : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Delete a file version.";
            _fileId = command.Argument("fileId",
                               "Id of file to manage");
            _fileVersionId = command.Argument("fileVersionId",
                               "Id of file version to delete");
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

        private async Task RunDelete()
        {
            base.CheckForFileId(this._fileId.Value, this._app);
            base.CheckForFileVersionId(this._fileVersionId.Value, this._app);

            var fileDeleted = false;
			if (this._dontPrompt.HasValue())
			{
				fileDeleted = await this.DeleteFileVersion();
			}
			else
			{
				Reporter.WriteWarningNoNewLine("Are you sure you want to delete this file version? y/N ");
				var yNKey = "n";
				yNKey = Console.ReadLine().ToLower();
				if (yNKey != "y")
				{
					Reporter.WriteInformation("Aborted file version deletion.");
					return;
				}
				else
				{
					fileDeleted = await this.DeleteFileVersion();
				}
			}
            if (fileDeleted)
            {
                Reporter.WriteSuccess($"Deleted file version {this._fileVersionId.Value} on file {this._fileId.Value}");
            }
            else
            {
                Reporter.WriteError($"Couldn't delete file version {this._fileVersionId.Value} on file {this._fileId.Value}");
            }
        }

        private async Task<bool> DeleteFileVersion()
        {
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
			if (this._etag.HasValue())
			{
				return await boxClient.FilesManager.DeleteOldVersionAsync(this._fileId.Value, this._fileVersionId.Value, this._etag.Value());
			}
			else
			{
				return await boxClient.FilesManager.DeleteOldVersionAsync(this._fileId.Value, this._fileVersionId.Value);
			}
        }
    }
}