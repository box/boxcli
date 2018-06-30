using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.Commands.FileSubCommand;
using BoxCLI.CommandUtilities.Globalization;
using BoxCLI.CommandUtilities.CommandOptions;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.FileVersionSubCommands
{
    public class FileVersionDownloadCommand : FileVersionSubCommandBase
    {
        private CommandArgument _fileId;
        private CommandArgument _fileVersionId;
        private CommandOption _filePath;
        private CommandLineApplication _app;
        public FileVersionDownloadCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Download a file.";
            _fileId = command.Argument("fileId",
                               "Id of file to download");
            _fileVersionId = command.Argument("fileVersionId",
                               "Id of file version to download");
            _filePath = FilePathOption.ConfigureOption(command);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunDownload();
            return await base.Execute();
        }

        private async Task RunDownload()
        {
            base.CheckForFileId(this._fileId.Value, this._app);
            base.CheckForFileVersionId(this._fileVersionId.Value, this._app);
            await base.DownloadFile(this._fileId.Value, this._filePath.Value(), this._fileVersionId.Value);
        }
    }
}