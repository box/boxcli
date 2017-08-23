using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.FileSubCommand
{
    public class FileUpdateCommand : FileSubCommandBase
    {
        private CommandArgument _fileId;
        private CommandOption _fileName;
        private CommandOption _description;
        private CommandOption _etag;
        private CommandLineApplication _app;
        public FileUpdateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names) 
            : base(boxPlatformBuilder, home, names)
        {
        }


        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Update a file.";
            _fileId = command.Argument("fileId",
                               "Id of file to update");
            _fileName = command.Option("-n|--name",
                               "New name of file", CommandOptionType.SingleValue);
            _description = command.Option("--description", "Change the file description", CommandOptionType.SingleValue);
            _etag = command.Option("--etag", "Only update if etag value matches", CommandOptionType.SingleValue);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunUpdate();
            return await base.Execute();
        }

        private async Task RunUpdate()
        {
            base.CheckForFileId(this._fileId.Value, this._app);
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            var fileRequest = base.ConfigureFileRequest(this._fileId.Value, fileName: this._fileName.Value(), description: this._description.Value());
            BoxFile updatedFile;
            if (this._etag.HasValue())
            {
                updatedFile = await boxClient.FilesManager.UpdateInformationAsync(fileRequest, this._etag.Value());
            }
            else
            {
                updatedFile = await boxClient.FilesManager.UpdateInformationAsync(fileRequest);
            }
            if (base._json.HasValue())
            {
                base.OutputJson(updatedFile);
                return;
            }
            Reporter.WriteSuccess($"Updated file {this._fileId.Value}");
            base.PrintFile(updatedFile);
        }
    }
}