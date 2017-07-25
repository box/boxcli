using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.FileSubCommand
{
    public class FileUploadCommand : FileSubCommandBase
    {
        private CommandArgument _parentFolderId;
        private CommandArgument _path;
        private CommandOption _name;
        private CommandOption _bulkPath;
        private CommandLineApplication _app;
        public FileUploadCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names) 
            : base(boxPlatformBuilder, home, names)
        {
        }
        
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get a file's information.";
            _parentFolderId = command.Argument("parentFolderId",
                                                "Id of new parent folder");
            _path = command.Argument("filePath", 
                                        "Local path to file");
            _name = command.Option("-n|--name", 
                                        "Provide different name for local file", CommandOptionType.SingleValue);
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
            if(this._bulkPath.HasValue())
            {
                await base.ProcessFileUploadsFromFile(this._bulkPath.Value(), this._asUser.Value());
                return;
            }
            base.CheckForParentFolderId(this._parentFolderId.Value, this._app);
            base.CheckForFilePath(this._path.Value, this._app);
            base.PrintEntity(await base.UploadFile(path: this._path.Value, parentId: this._parentFolderId.Value, fileName: this._name.Value()));
        }
    }
}