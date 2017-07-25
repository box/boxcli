using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.FileSubCommand
{
    public class FileDeleteCommand : FileSubCommandBase
    {
        private CommandArgument _fileId;
        private CommandOption _etag;
        private CommandLineApplication _app;
        public FileDeleteCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get a file's information.";
            _fileId = command.Argument("fileId",
                               "Id of file to manage");
            _etag = command.Option("--etag", "Only delete if etag value matches", CommandOptionType.SingleValue);
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
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            var fileDeleted = false;
            if (this._etag.HasValue())
            {
                fileDeleted = await boxClient.FilesManager.DeleteAsync(this._fileId.Value, this._etag.Value());
            }
            else
            {
                fileDeleted = await boxClient.FilesManager.DeleteAsync(this._fileId.Value);
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
    }
}