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
    public class FileSubCommandBase : BoxBaseCommand
    {
        protected CommandOption _asUser;
        private CommandLineApplication _app;
        protected const long MINIUMUM_CHUNKED_UPLOAD_FILE_SIZE = 50000000;
        public FileSubCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            _asUser = AsUserOption.ConfigureOption(command);
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

        protected void PrintFile(BoxFile file)
        {
            Reporter.WriteInformation($"File ID: {file.Id}");
            Reporter.WriteInformation($"File Name: {file.Name}");
            Reporter.WriteInformation($"File Size: {file.Size}");
        }
        protected void PrintEntity(BoxEntity entity)
        {
            Reporter.WriteInformation($"File ID: {entity.Id}");
        }

        protected BoxFileRequest ConfigureFileRequest(string fileId = "", string parentId = "",
            string fileName = "", string description = "")
        {
            var fileRequest = new BoxFileRequest();
            if (!string.IsNullOrEmpty(fileId))
            {
                fileRequest.Id = fileId;
            }
            if (!string.IsNullOrEmpty(fileName))
            {
                fileRequest.Name = fileName;
            }
            if (!string.IsNullOrEmpty(description))
            {
                fileRequest.Description = description;
            }
            if (!string.IsNullOrEmpty(parentId))
            {
                fileRequest.Parent = new BoxItemRequest();
                fileRequest.Parent.Id = parentId;
            }
            return fileRequest;
        }

        protected async Task<BoxFile> UploadFile(string path, string parentId = "", string fileName = "", string fileId = "", bool isNewVersion = false)
        {
            var boxClient = base.ConfigureBoxClient(this._asUser.Value());
            path = GeneralUtilities.TranslatePath(path);
            var file = new FileInfo(path);
            Reporter.WriteData($"File Size: {file.Length}");
            if (string.IsNullOrEmpty(fileName))
            {
                fileName = file.Name;
            }
            if (file.Length >= MINIUMUM_CHUNKED_UPLOAD_FILE_SIZE)
            {
                return await this.ChunkedUpload(path, fileName, parentId, file.Length, fileId);
            }
            else
            {
                using (var fileStream = File.Open(path, FileMode.Open))
                {
                    Reporter.WriteData("creating file request...");
                    var fileRequest = this.ConfigureFileRequest(parentId: parentId, fileName: fileName);
                    Reporter.WriteData("File request created...");
                    if (isNewVersion)
                    {
                        this.CheckForFileId(fileId, _app);
                        Reporter.WriteInformation("Uploading new version...");
                        Reporter.WriteInformation(fileName);
                        return await boxClient.FilesManager.UploadNewVersionAsync(fileName, fileId, fileStream);
                    }
                    else
                    {
                        return await boxClient.FilesManager.UploadAsync(fileRequest, fileStream);
                    }
                }
            }
        }

        protected async Task ProcessFileUploadsFromFile(string path, string asUser = "", bool isNewVersion = false)
        {
            try
            {
                path = GeneralUtilities.TranslatePath(path);
                System.Console.WriteLine($"Path: {path}");
                System.Console.WriteLine("Reading file...");
                var fileRequests = this.ReadFile<BoxFileUpload, BoxFileUploadMap>(path);
                System.Console.WriteLine(fileRequests.Count);
                if (!isNewVersion)
                {
                    foreach (var fileRequest in fileRequests)
                    {
                        System.Console.WriteLine($"Processing a file request");
                        System.Console.WriteLine($"File Path: {fileRequest.Path}");
                        try
                        {
                            var uploadedFile = await this.UploadFile(path: fileRequest.Path, parentId: fileRequest.Parent.Id, fileName: fileRequest.Name);
                            this.PrintFile(uploadedFile);
                        }
                        catch (Exception e)
                        {
                            Reporter.WriteError(e.Message);
                        }
                    }
                }
                else
                {
                    foreach (var fileRequest in fileRequests)
                    {
                        System.Console.WriteLine($"Processing a new file version request");
                        System.Console.WriteLine($"File Path: {fileRequest.Path}");
                        try
                        {
                            var uploadedFile = await this.UploadFile(path: fileRequest.Path, fileId: fileRequest.Id, fileName: fileRequest.Name, isNewVersion: true);
                            this.PrintFile(uploadedFile);
                        }
                        catch (Exception e)
                        {
                            Reporter.WriteError(e.Message);
                        }
                    }
                }
                System.Console.WriteLine("Uploaded all files...");
            }
            catch (Exception e)
            {
                Reporter.WriteError(e.Message);
            }
        }

        protected async Task<BoxFile> MoveFile(string fileId, string parentId, string etag = "")
        {
            var boxClient = base.ConfigureBoxClient(this._asUser.Value());
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
            var boxClient = base.ConfigureBoxClient(this._asUser.Value());
            var fileRequest = this.ConfigureFileRequest(fileId, parentId);
            return await boxClient.FilesManager.CopyAsync(fileRequest);
        }

        protected async Task DownloadFile(string fileId, string fileVersionId = "")
        {
            var boxClient = base.ConfigureBoxClient(this._asUser.Value());
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
            var downloadPath = base.ConstructDownloadsPath(fileInfo.Name);
            Reporter.WriteInformation($"Saving to ${downloadPath}");
            using (var fileStream = File.Open($"{downloadPath}", FileMode.Create))
            {
                boxFileStream.CopyTo(fileStream);
                Reporter.WriteSuccess("Copied file...");
            }
        }

        private int GetUploadPartsCount(long totalSize, long partSize)
        {
            if (partSize == 0)
                throw new Exception("Part Size cannot be 0");
            int numberOfParts = 1;
            if (partSize != totalSize)
            {
                numberOfParts = Convert.ToInt32(totalSize / partSize);
                numberOfParts += 1;
            }
            return numberOfParts;
        }

        private Stream GetFilePart(Stream stream, long partSize, long partOffset)
        {
            // Default the buffer size to 4K.
            const int bufferSize = 4096;

            byte[] buffer = new byte[bufferSize];
            int bytesRead = 0;
            stream.Position = partOffset;
            var partStream = new MemoryStream();
            do
            {
                bytesRead = stream.Read(buffer, 0, 4096);
                if (bytesRead > 0)
                {
                    long bytesToWrite = bytesRead;
                    bool shouldBreak = false;
                    if (partStream.Length + bytesRead >= partSize)
                    {
                        bytesToWrite = partSize - partStream.Length;
                        shouldBreak = true;
                    }

                    partStream.Write(buffer, 0, Convert.ToInt32(bytesToWrite));

                    if (shouldBreak)
                    {
                        break;
                    }
                }
            } while (bytesRead > 0);

            return partStream;
        }

        private async Task<BoxFile> ChunkedUpload(string path, string fileName, string parentFolderId, long fileSize, string fileId = "")
        {
            var boxClient = base.ConfigureBoxClient(this._asUser.Value());
            using (var fileInMemoryStream = File.Open(path, FileMode.Open))
            {
                System.Console.WriteLine($"File name: {fileName}");
                BoxFileUploadSession boxFileUploadSession;
                if (!string.IsNullOrEmpty(fileId))
                {
                    System.Console.WriteLine(fileId);
                    System.Console.WriteLine(fileSize.ToString());
                    // TODO: Correct after SDK is fixed.
                    boxClient.AddResourcePlugin<BoxFileManagerCommand>();
                    var command = boxClient.ResourcePlugins.Get<BoxFileManagerCommand>();
                    boxFileUploadSession = await command.CreateNewVersionUploadSessionAsync(fileId, fileSize);
                    System.Console.WriteLine(boxFileUploadSession.TotalParts);
                }
                else
                {
                    var boxFileUploadSessionRequest = new BoxFileUploadSessionRequest()
                    {
                        FolderId = parentFolderId,
                        FileName = fileName,
                        FileSize = fileSize
                    };
                    boxFileUploadSession = await boxClient.FilesManager.CreateUploadSessionAsync(boxFileUploadSessionRequest);
                }
                System.Console.WriteLine("Requested for an Upload Session...");
                System.Console.WriteLine($"ID: {boxFileUploadSession.Id}");
                System.Console.WriteLine($"Parts Processed: {boxFileUploadSession.NumPartsProcessed}");
                System.Console.WriteLine($"Part Size: {boxFileUploadSession.PartSize}");
                System.Console.WriteLine($"Abort: {boxFileUploadSession.SessionEndpoints.Abort}");
                System.Console.WriteLine($"Commit: {boxFileUploadSession.SessionEndpoints.Commit}");
                System.Console.WriteLine($"List Parts: {boxFileUploadSession.SessionEndpoints.ListParts}");
                System.Console.WriteLine($"Log Event: {boxFileUploadSession.SessionEndpoints.LogEvent}");
                System.Console.WriteLine($"Status: {boxFileUploadSession.SessionEndpoints.Status}");
                System.Console.WriteLine($"Upload Part: {boxFileUploadSession.SessionEndpoints.UploadPart}");
                System.Console.WriteLine($"Type: {boxFileUploadSession.Type}");
                System.Console.WriteLine($"Total Parts: {boxFileUploadSession.TotalParts}");
                System.Console.WriteLine($"Expires: {boxFileUploadSession.SessionExpiresAt}");
                var boxSessionEndpoint = boxFileUploadSession.SessionEndpoints;
                var uploadPartUri = new Uri(boxSessionEndpoint.UploadPart);
                var commitUri = new Uri(boxSessionEndpoint.Commit);
                var partSize = boxFileUploadSession.PartSize;
                long partSizeLong;
                long.TryParse(partSize, out partSizeLong);
                var numberOfParts = this.GetUploadPartsCount(fileSize, partSizeLong);

                var boxSessionParts = await UploadPartsInSessionAsync(uploadPartUri, numberOfParts, partSizeLong, fileInMemoryStream, fileSize, boxClient);
                var allSessionParts = new List<BoxSessionPartInfo>();

                foreach (var sessionPart in boxSessionParts)
                {
                    System.Console.WriteLine($"Retrieved Session Part: {sessionPart.Part.PartId}");
                    allSessionParts.Add(sessionPart.Part);
                }

                BoxSessionParts sessionPartsForCommit = new BoxSessionParts() { Parts = allSessionParts };
                Reporter.WriteInformation("Attempting to commit...");
                // Commit
                if (!string.IsNullOrEmpty(fileId))
                {
                    //TODO: Fix after SDK update
                    var command = boxClient.ResourcePlugins.Get<BoxFileManagerCommand>();
                    return await command.CommitSessionAsync(commitUri, Box.V2.Utility.Helper.GetSha1Hash(fileInMemoryStream), sessionPartsForCommit);
                }
                else
                {
                    return await boxClient.FilesManager.CommitSessionAsync(commitUri, Box.V2.Utility.Helper.GetSha1Hash(fileInMemoryStream), sessionPartsForCommit);
                }
            }
        }

        private async Task<List<BoxUploadPartResponse>> UploadPartsInSessionAsync(Uri uploadPartsUri, int numberOfParts, long partSize, Stream stream,
            long fileSize, BoxClient client)
        {
            var tasks = Enumerable.Range(0, numberOfParts)
                .Select(i =>
                {
                    System.Console.WriteLine($"Current index: {i}");
                    // Split file as per part size
                    long partOffset = partSize * i;
                    Stream partFileStream = this.GetFilePart(stream, partSize, partOffset);
                    string sha = Box.V2.Utility.Helper.GetSha1Hash(partFileStream);
                    partFileStream.Position = 0;
                    System.Console.WriteLine($"Running Task for {partOffset}...");
                    return client.FilesManager.UploadPartAsync(uploadPartsUri, sha, partOffset, fileSize, partFileStream);
                });

            List<BoxUploadPartResponse> allParts = (await Task.WhenAll(tasks)).ToList();
            foreach (var resp in allParts)
            {
                System.Console.WriteLine($"Offset: {resp.Part.Offset}");
                System.Console.WriteLine($"Part ID: {resp.Part.PartId}");
                System.Console.WriteLine($"SHA: {resp.Part.Sha1}");
                System.Console.WriteLine($"Size: {resp.Part.Size}");
            }
            return allParts;
        }

        protected override List<T> ReadFile<T, M>(string path)
        {
            var fileFormat = base.ProcessFileFormatFromPath(path);
            System.Console.WriteLine($"File is {fileFormat}");
            if (fileFormat == base._settings.FILE_FORMAT_JSON)
            {
                using (var fs = File.OpenText(path))
                {
                    var serializer = new JsonSerializer();
                    return (List<T>)serializer.Deserialize(fs, typeof(List<T>));
                }
            }
            else if (fileFormat == base._settings.FILE_FORMAT_CSV)
            {
                System.Console.WriteLine("Found csv file...");
                using (var fs = File.OpenText(path))
                using (var csv = new CsvReader(fs))
                {
                    System.Console.WriteLine("Processing csv...");
                    csv.Configuration.RegisterClassMap(typeof(M));
                    return csv.GetRecords<T>().ToList();
                }
            }
            else
            {
                throw new Exception("File format {fileFormat} is not currently supported.");
            }
        }
    }
}