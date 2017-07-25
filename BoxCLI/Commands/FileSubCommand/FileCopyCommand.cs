using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.FileSubCommand
{
    public class FileCopyCommand : FileSubCommandBase
    {
        private CommandArgument _fileId;
        private CommandArgument _parentFolderId;
        private CommandLineApplication _app;
        public FileCopyCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Copy a file to a different folder.";
            _fileId = command.Argument("fileId",
                               "Id of file to manage");
            _parentFolderId = command.Argument("parentFolderId",
                                                "Id of new parent folder");
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunCopy();
            return await base.Execute();
        }

        private async Task RunCopy()
        {
            base.CheckForFileId(this._fileId.Value, this._app);
            var copy = await base.CopyFile(this._fileId.Value, this._parentFolderId.Value);
            Reporter.WriteSuccess($"Copied file {this._fileId.Value} to folder {this._parentFolderId.Value}");
            base.PrintFile(copy);
        }
    }
}