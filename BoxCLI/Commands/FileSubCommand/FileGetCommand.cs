using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.FileSubCommand
{
    public class FileGetCommand : FileSubCommandBase
    {
        private CommandArgument _fileId;
        private CommandOption _asUser;
        private CommandLineApplication _app;
        public FileGetCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names) 
            : base(boxPlatformBuilder, boxHome, names)
        {
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get a file's information.";
            _fileId = command.Argument("fileId",
                               "Id of file to manage");
            _asUser = AsUserOption.ConfigureOption(command);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunGet(_fileId.Value, _asUser.Value());
            return await base.Execute();
        }

        private async Task RunGet(string id, string asUserId)
        {
            if (id == null)
            {
                _app.ShowHelp();
                return;
            }
            var BoxClient = base.ConfigureBoxClient(asUserId);
            var fileInfo = await BoxClient.FilesManager.GetInformationAsync(id);
            System.Console.WriteLine($"File ID: {fileInfo.Id}");
            System.Console.WriteLine($"File Name: {fileInfo.Name}");
            System.Console.WriteLine($"File Size: {fileInfo.Size}");
        }
    }
}