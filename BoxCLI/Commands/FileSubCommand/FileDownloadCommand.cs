using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandModels;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.FileSubCommand
{
    public class FileDownloadCommand : FileSubCommandBase
    {
        private CommandArgument _fileId;
        private CommandOption _multiId;
        private CommandOption _bulkPath;
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
            _multiId = command.Option("-m|--multi",
                               "Download multiple files with a comma separated list of IDs.",
                               CommandOptionType.NoValue);
            _bulkPath = BulkFilePathOption.ConfigureOption(command);
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
            if(this._bulkPath.HasValue())
            {
                await base.ProcessBulkDownload(this._bulkPath.Value());
                return;
            }
            if (this._multiId.HasValue())
            {
                var ids = this._fileId.Value;
                var idsList = ids.Split(',').ToList();
                var fileList = new List<BoxBulkDownload>();
                foreach (var id in idsList)
                {
                    fileList.Add(new BoxBulkDownload()
                    {
                        Id = id.Trim()
                    });

                }
                await base.BulkDownload(fileList);
                return;
            }
            base.CheckForFileId(this._fileId.Value, this._app);
            await base.DownloadFile(this._fileId.Value);
        }
    }
}