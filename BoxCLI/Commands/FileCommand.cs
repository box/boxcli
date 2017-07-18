using System;
using System.IO;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxHome.BoxHomeFiles;
using BoxCLI.BoxPlatform.Service;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands
{
    public class FileCommand : BaseCommand
    {
        private CommandLineApplication _app;
        private readonly IBoxHome _boxHome;
        private readonly BoxDefaultSettings _settings;
        public void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Work with files in Box.";
            command.HelpOption("--help|-h|-?");
            command.ExtendedHelpText = "You can use this command to create, update, delete, and get information about a file in your Enterprise.";
            command.Command("get", folders =>
            {
                var folderIdArgument = folders.Argument("folderId",
                                   "Id of folder to manage, use '0' for the root folder");
                var asUserOption = folders.Option("--as-user <as-user>",
            "Provide an ID for a user",
            CommandOptionType.SingleValue);
                folders.Description = "Get information about a Box folder.";
                folders.HelpOption("--help|-h|-?");
                folders.OnExecute(async () =>
                {
                    await this.RunGet(folderIdArgument.Value, asUserOption.Value());
                    return 0;
                });
            });

            command.Command("download", files =>
            {
                var fileIdArgument = files.Argument("fileId",
                                   "Id of file to download");
                var asUserOption = files.Option("--as-user <as-user>",
            "Provide an ID for a user",
            CommandOptionType.SingleValue);
                files.Description = "Download a file";
                files.HelpOption("--help|-h|-?");
                files.OnExecute(async () =>
                {
                    await this.RunDownload(fileIdArgument.Value, asUserOption.Value());
                    return 0;
                });
            });
        }

        public FileCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome) : base(boxPlatformBuilder, boxHome)
        {
            _boxHome = boxHome;
            _settings = boxHome.GetBoxHomeSettings();
        }

        private async Task RunDownload(string fileId, string asUserId)
        {
            var BoxClient = base.ConfigureBoxClient(asUserId);
            var fileInfo = await BoxClient.FilesManager.GetInformationAsync(fileId);
            var boxFileStream = await BoxClient.FilesManager.DownloadStreamAsync(fileId);
            System.Console.WriteLine(fileInfo.Name);
            System.Console.WriteLine(base.ConstructDownloadsPath(fileInfo.Name));
            using (var fileStream = File.Open($"{base.ConstructDownloadsPath(fileInfo.Name)}", FileMode.Create))
            {
                boxFileStream.CopyTo(fileStream);
                System.Console.WriteLine("Copied file...");
            }
        }

        private async Task RunGet(string fileId, string asUserId)
        {
            var BoxClient = base.ConfigureBoxClient(asUserId);
            var fileInfo = await BoxClient.FilesManager.GetInformationAsync(fileId);
            System.Console.WriteLine($"File ID: {fileInfo.Id}");
            System.Console.WriteLine($"File Name: {fileInfo.Name}");
            System.Console.WriteLine($"File Size: {fileInfo.Size}");
        }
    }
}