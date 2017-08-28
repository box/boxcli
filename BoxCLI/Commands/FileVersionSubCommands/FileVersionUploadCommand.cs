using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.FileVersionSubCommands
{
    public class FileVersionUploadCommand : FileVersionSubCommandBase
    {
        private CommandArgument _fileId;
        private CommandArgument _path;
        private CommandOption _parentFolderId;
        private CommandOption _name;
        private CommandOption _bulkPath;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public FileVersionUploadCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Upload a new version of a file.";
            _fileId = command.Argument("fileId",
                                        "Id of file");
            _path = command.Argument("filePath",
                                        "Local path to file");
            _name = command.Option("-n|--name",
                                        "Provide different name for local file", CommandOptionType.SingleValue);
            _parentFolderId = command.Option("-p|--parent-folder",
                                        "Id of folder to upload file to, defaults to the root folder",
                                        CommandOptionType.SingleValue);
            _bulkPath = BulkFilePathOption.ConfigureOption(command);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunUpload();
            return await base.Execute();
        }

        private async Task RunUpload()
        {
            if (this._bulkPath.HasValue())
            {
                Reporter.WriteInformation("Using bulk for new file versions...");
                await base.ProcessFileUploadsFromFile(this._bulkPath.Value(), this._asUser.Value(), true);
                return;
            }
            base.CheckForFileId(this._fileId.Value, this._app);
            base.CheckForFilePath(this._path.Value, this._app);
            var newVersion = await base.UploadFile(this._path.Value, fileId: this._fileId.Value, fileName: this._name.Value(), isNewVersion: true);
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(newVersion);
                return;
            }
            base.PrintFile(newVersion);
        }
    }
}