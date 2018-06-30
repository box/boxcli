using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Box.V2;
using Box.V2.Config;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandModels;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.CsvModels;
using BoxCLI.CommandUtilities.Globalization;
using CsvHelper;
using Microsoft.Extensions.CommandLineUtils;
using Newtonsoft.Json;

namespace BoxCLI.Commands.FileSubCommand
{
    public class FileSubCommandBase : BoxItemCommandBase
    {
        private CommandLineApplication _app;
        public FileSubCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            base.Configure(command);
        }

        protected void CheckForFilePath(string path, CommandLineApplication app)
        {
            if (string.IsNullOrEmpty(path))
            {
                app.ShowHelp();
                throw new Exception("A local file path is required for this command.");
            }
        }
        protected void CheckForFileId(string id, CommandLineApplication app)
        {
            if (string.IsNullOrEmpty(id))
            {
                app.ShowHelp();
                throw new Exception("A file ID is required for this command.");
            }
        }
        protected void CheckForParentFolderId(string id, CommandLineApplication app)
        {
            if (string.IsNullOrEmpty(id))
            {
                app.ShowHelp();
                throw new Exception("A parent folder ID is required for this command.");
            }
        }

        protected async Task<BoxFile> MoveFile(string fileId, string parentId, string etag = "")
        {
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var fileRequest = this.ConfigureFileRequest(fileId, parentId);
            if (!string.IsNullOrEmpty(etag))
            {
                return await boxClient.FilesManager.UpdateInformationAsync(fileRequest, etag);
            }
            else
            {
                return await boxClient.FilesManager.UpdateInformationAsync(fileRequest);
            }
        }

        protected async Task<BoxFile> CopyFile(string fileId, string parentId, string fileVersionId = "")
        {
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var fileRequest = this.ConfigureFileRequest(fileId, parentId);
            return await boxClient.FilesManager.CopyAsync(fileRequest);
        }

        protected async Task DownloadFile(string fileId, string filePath, string fileVersionId = "")
        {
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var fileInfo = await boxClient.FilesManager.GetInformationAsync(fileId);
            Stream boxFileStream;
            if (!string.IsNullOrEmpty(fileVersionId))
            {
                boxFileStream = await boxClient.FilesManager.DownloadStreamAsync(fileId, fileVersionId);
                Reporter.WriteInformation($"Downloading {fileInfo.Name} Version {fileVersionId}...");
            }
            else
            {
                Reporter.WriteInformation($"Downloading {fileInfo.Name}...");
                boxFileStream = await boxClient.FilesManager.DownloadStreamAsync(fileId);
            }
            var downloadPath = base.ConstructDownloadsPath(fileInfo.Name, filePath);
            Reporter.WriteInformation($"Saving to {downloadPath}");
            using (var fileStream = File.Open($"{downloadPath}", FileMode.Create))
            {
                boxFileStream.CopyTo(fileStream);
                Reporter.WriteSuccess("File Sucessfully downloaded");
            }
        }
    }
}