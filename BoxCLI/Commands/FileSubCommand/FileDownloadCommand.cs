using System.IO;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.FileSubCommand
{
    public class FileDownloadCommand : FileSubCommandBase
    {
        private CommandArgument _fileId;
        private CommandOption _asUser;
        private CommandLineApplication _app;
        public FileDownloadCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names) 
            : base(boxPlatformBuilder, boxHome, names)
        {
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Download a file.";
            _fileId = command.Argument("fileId",
                               "Id of file to download");
            _asUser = AsUserOption.ConfigureOption(command);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunDownload(_fileId.Value, _asUser.Value());
            return await base.Execute();
        }

        private async Task RunDownload(string id, string asUserId)
        {
            if (id == null)
            {
                _app.ShowHelp();
                return;
            }
            var BoxClient = base.ConfigureBoxClient(asUserId);
            var fileInfo = await BoxClient.FilesManager.GetInformationAsync(id);
            var boxFileStream = await BoxClient.FilesManager.DownloadStreamAsync(id);
            var downloadPath = base.ConstructDownloadsPath(fileInfo.Name);
            Reporter.WriteInformation($"Downloading {fileInfo.Name}...");
            Reporter.WriteInformation($"Saving to ${downloadPath}");
            using (var fileStream = File.Open($"{downloadPath}", FileMode.Create))
            {
                boxFileStream.CopyTo(fileStream);
                Reporter.WriteSuccess("Copied file...");
            }
        }
    }
}