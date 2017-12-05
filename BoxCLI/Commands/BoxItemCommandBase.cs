using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.IO;
using SharpCompress.Archives;
using SharpCompress.Archives.Zip;
using System.Linq;
using System.Security.Cryptography;
using System.Threading;
using System.Threading.Tasks;
using Box.V2;
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
using SharpCompress.Common;
using System.Dynamic;

namespace BoxCLI.Commands
{
    public class BoxItemCommandBase : BoxBaseCommand
    {
        protected CommandOption _asUser;
        private CommandLineApplication _app;
        protected const long MINIUMUM_CHUNKED_UPLOAD_FILE_SIZE = 50000000;
        public BoxItemCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            _asUser = AsUserOption.ConfigureOption(command);
            base.Configure(command);
        }

        protected virtual void CheckForParentId(string parentId, CommandLineApplication app)
        {
            if (string.IsNullOrEmpty(parentId))
            {
                app.ShowHelp();
                throw new Exception("A Parent ID is required for this command.");
            }
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

        protected void PrintFile(BoxFile file, bool json = false)
        {
            if (json)
            {
                base.OutputJson(file);
                return;
            }
            else
            {
                this.PrintFile(file);
            }
        }

        protected void PrintFile(BoxFile file)
        {
            Reporter.WriteInformation($"File ID: {file.Id}");
            Reporter.WriteInformation($"File Name: {file.Name}");
            Reporter.WriteInformation($"File Size: {file.Size}");
        }
        protected void PrintFolder(BoxFolder folder, bool json)
        {
            if (json)
            {
                base.OutputJson(folder);
                return;
            }
            else
            {
                this.PrintFolder(folder);
            }
        }

        protected void PrintFolder(BoxFolder folder)
        {
            Reporter.WriteInformation($"Folder ID: {folder.Id}");
            Reporter.WriteInformation($"Folder Name: {folder.Name}");
            if (folder.FolderUploadEmail != null)
            {
                Reporter.WriteInformation($"Folder Upload Email Access: {folder.FolderUploadEmail.Acesss}");
                Reporter.WriteInformation($"Folder Upload Email Address: {folder.FolderUploadEmail.Address}");
            }
            if (folder.Parent != null)
            {
                Reporter.WriteInformation($"Folder Parent:");
                this.PrintFolder(folder.Parent);
            }
        }

        protected void PrintFileLock(BoxFileLock fileLock)
        {
            Reporter.WriteInformation($"File Lock ID: {fileLock.Id}");
            Reporter.WriteInformation($"Is download prevented: {fileLock.IsDownloadPrevented}");
            Reporter.WriteInformation($"Expires at: {fileLock.ExpiresAt}");
            Reporter.WriteInformation($"Created at: {fileLock.CreatedAt}");
            base.PrintMiniUser(fileLock.CreatedBy);
        }

        protected virtual void PrintTaskAssignment(BoxTaskAssignment taskAssignment)
        {
            Reporter.WriteInformation($"Task Assignment ID: {taskAssignment.Id}");
            Reporter.WriteInformation($"Task Assignment Message: {taskAssignment.Message}");
            Reporter.WriteInformation($"Task Assignment Resolution State: {taskAssignment.ResolutionState.Value}");
        }

        protected virtual void PrintTask(BoxTask task)
        {
            Reporter.WriteInformation($"Task ID: {task.Id}");
            Reporter.WriteInformation($"Task Action: {task.Action}");
            Reporter.WriteInformation($"Task Message: {task.Message}");
        }

        protected List<T> ReadCustomFile<T, M>(string path)
        {
            var fileFormat = base.ProcessFileFormatFromPath(path);
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
                using (var fs = File.OpenText(path))
                using (var csv = new CsvReader(fs))
                {
                    csv.Configuration.RegisterClassMap(typeof(M));
                    return csv.GetRecords<T>().ToList();
                }
            }
            else
            {
                throw new Exception($"File format {fileFormat} is not currently supported.");
            }
        }

        protected async Task<BoxFile> UploadFile(string path, string parentId = "", string fileName = "",
            string fileId = "", bool isNewVersion = false, bool idOnly = false)
        {
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: this._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            path = GeneralUtilities.TranslatePath(path);

            var file = new FileInfo(path);
            if (string.IsNullOrEmpty(fileName))
            {
                fileName = file.Name;
            }
            if (string.IsNullOrEmpty(parentId))
            {
                parentId = "0";
            }

            if (file.Length >= MINIUMUM_CHUNKED_UPLOAD_FILE_SIZE && isNewVersion)
            {
                return await this.ChunkedUpload(path, fileName, parentId, file.Length, boxClient, fileId, true, idOnly: idOnly);
            }
            else if (file.Length >= MINIUMUM_CHUNKED_UPLOAD_FILE_SIZE)
            {
                return await this.ChunkedUpload(path, fileName, parentId, file.Length, boxClient, idOnly: idOnly);
            }
            else
            {
                using (var fileStream = File.Open(path, FileMode.Open))
                {
                    var fileRequest = this.ConfigureFileRequest(parentId: parentId, fileName: fileName);
                    if (isNewVersion)
                    {
                        if (string.IsNullOrEmpty(fileId))
                        {
                            throw new Exception("A file ID is required for this command.");
                        }
                        var preflightCheckRequest = new BoxPreflightCheckRequest()
                        {
                            Name = fileName,
                            Size = file.Length,
                            Parent = new BoxItemRequest()
                            {
                                Id = parentId
                            }
                        };
                        var preflight = await boxClient.FilesManager.PreflightCheckNewVersion(fileId, preflightCheckRequest);
                        if (preflight.Success)
                        {
                            using (var sha1 = SHA1.Create())
                            {
                                var checksum = sha1.ComputeHash(fileStream);
                                return await boxClient.FilesManager.UploadNewVersionAsync(fileName, fileId, fileStream, uploadUri: preflight.UploadUri, contentMD5: checksum);
                            }
                        }
                        else
                        {
                            throw new Exception("Preflight check failed.");
                        }
                    }
                    else
                    {
                        var preflightCheckRequest = new BoxPreflightCheckRequest()
                        {
                            Name = fileName,
                            Size = file.Length,
                            Parent = new BoxItemRequest()
                            {
                                Id = parentId
                            }
                        };
                        var preflight = await boxClient.FilesManager.PreflightCheck(preflightCheckRequest);
                        if (preflight.Success)
                        {
                            using (var sha1 = SHA1.Create())
                            {
                                var checksum = sha1.ComputeHash(fileStream);
                                return await boxClient.FilesManager.UploadAsync(fileRequest, fileStream, uploadUri: preflight.UploadUri, contentMD5: checksum);
                            }
                        }
                        else
                        {
                            throw new Exception("Preflight check failed.");
                        }
                    }
                }
            }
        }

        protected async Task ProcessFileUploadsFromFile(string path, string asUser = "", bool isNewVersion = false, bool json = false)
        {
            try
            {
                path = GeneralUtilities.TranslatePath(path);
                var fileRequests = this.ReadCustomFile<BoxFileUpload, BoxFileUploadMap>(path);
                if (!isNewVersion)
                {
                    foreach (var fileRequest in fileRequests)
                    {
                        try
                        {
                            var uploadedFile = await this.UploadFile(path: fileRequest.Path, parentId: fileRequest.Parent.Id, fileName: fileRequest.Name);
                            this.PrintFile(uploadedFile, json);
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
                        try
                        {
                            var uploadedFile = await this.UploadFile(path: fileRequest.Path, fileId: fileRequest.Id, fileName: fileRequest.Name, isNewVersion: true);
                            this.PrintFile(uploadedFile, json);
                        }
                        catch (Exception e)
                        {
                            Reporter.WriteError(e.Message);
                        }
                    }
                }
            }
            catch (Exception e)
            {
                Reporter.WriteError(e.Message);
            }
        }

        private async Task<BoxFile> ChunkedUpload(string path, string fileName, string parentFolderId,
            long fileSize, BoxClient boxClient, string fileId = "", bool isNewVersion = false, bool idOnly = false)
        {
            using (var fileInMemoryStream = File.Open(path, FileMode.Open))
            {
                if (!idOnly)
                {
                    Reporter.WriteInformation($"File name: {fileName}");
                }
                BoxFileUploadSession boxFileUploadSession;
                if (isNewVersion)
                {
                    // TODO: Correct after SDK is fixed.
                    boxClient.AddResourcePlugin<BoxFileManagerCommand>();
                    var command = boxClient.ResourcePlugins.Get<BoxFileManagerCommand>();
                    boxFileUploadSession = await command.CreateNewVersionUploadSessionAsync(fileId, fileSize);
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
                var completeFileSha = await Task.Run(() =>
                {
                    return Box.V2.Utility.Helper.GetSha1Hash(fileInMemoryStream);
                });
                var boxSessionEndpoint = boxFileUploadSession.SessionEndpoints;
                var uploadPartUri = new Uri(boxSessionEndpoint.UploadPart);
                var commitUri = new Uri(boxSessionEndpoint.Commit);
                var partSize = boxFileUploadSession.PartSize;
                long partSizeLong;
                long.TryParse(partSize, out partSizeLong);
                var numberOfParts = this.GetUploadPartsCount(fileSize, partSizeLong);
                if (!idOnly)
                {
                    Reporter.WriteInformation($"Processing {fileName}");
                    ProgressBar.UpdateProgress($"Processing ", 0, numberOfParts);
                }
                var boxSessionParts = await UploadPartsInSessionAsync(uploadPartUri, numberOfParts, partSizeLong,
                                                      fileInMemoryStream, client: boxClient, fileSize: fileSize, idOnly: idOnly);

                BoxSessionParts sessionPartsForCommit = new BoxSessionParts() { Parts = boxSessionParts };
                if (!idOnly)
                {
                    Reporter.WriteInformation("");
                    Reporter.WriteInformation("Attempting to commit...");
                }
                // const int retryCount = 5;
                // var retryInterval = boxSessionParts.Count() * 100;

                // Commit
                if (!string.IsNullOrEmpty(fileId))
                {
                    return await boxClient.FilesManager.CommitFileVersionSessionAsync(commitUri, completeFileSha, sessionPartsForCommit);
                }
                else
                {
                    return await boxClient.FilesManager.CommitSessionAsync(commitUri, completeFileSha, sessionPartsForCommit);
                }
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

        private async Task<IEnumerable<BoxSessionPartInfo>> UploadPartsInSessionAsync(
            Uri uploadPartsUri, int numberOfParts, long partSize, Stream stream, BoxClient client,
            long fileSize, TimeSpan? timeout = null, bool idOnly = false)
        {
            var maxTaskNum = Environment.ProcessorCount + 1;

            // Retry 5 times for 10 seconds
            const int retryMaxCount = 5;
            const int retryMaxInterval = 10;

            var ret = new List<BoxSessionPartInfo>();

            using (SemaphoreSlim concurrencySemaphore = new SemaphoreSlim(maxTaskNum))
            {
                var postTaskTasks = new List<Task>();
                int taskCompleted = 0;

                var tasks = new List<Task<BoxUploadPartResponse>>();
                for (var i = 0; i < numberOfParts; i++)
                {
                    await concurrencySemaphore.WaitAsync();

                    // Split file as per part size
                    var partOffset = partSize * i;

                    // Retry
                    var uploadPartWithRetryTask = Box.V2.Utility.Retry.ExecuteAsync(async () =>
                    {
                        // Release the memory when done
                        using (var partFileStream = this.GetFilePart(stream, partSize,
                                    partOffset))
                        {
                            var sha = Box.V2.Utility.Helper.GetSha1Hash(partFileStream);
                            partFileStream.Position = 0;
                            var uploadPartResponse = await client.FilesManager.UploadPartAsync(
                                uploadPartsUri, sha, partOffset, fileSize, partFileStream,
                                timeout);

                            return uploadPartResponse;
                        }
                    }, TimeSpan.FromSeconds(retryMaxInterval), retryMaxCount);

                    // Have each task notify the Semaphore when it completes so that it decrements the number of tasks currently running.
                    postTaskTasks.Add(uploadPartWithRetryTask.ContinueWith(tsk =>
                        {
                            concurrencySemaphore.Release();
                            ++taskCompleted;
                            if (!idOnly)
                            {
                                ProgressBar.UpdateProgress($"Processing...", taskCompleted, numberOfParts);
                            }
                        }
                    ));

                    tasks.Add(uploadPartWithRetryTask);
                }

                var results = await Task.WhenAll(tasks);
                ret.AddRange(results.Select(elem => elem.Part));
            }

            return ret;
        }

        protected async Task ProcessBulkDownload(string path, bool isNewVersion = false)
        {
            try
            {
                path = GeneralUtilities.TranslatePath(path);
                var downloads = this.ReadFileForIdsAndVersionIds(path);
                await BulkDownload(downloads);
            }
            catch (Exception e)
            {
                Reporter.WriteError(e.Message);
            }
        }
        protected async Task ProcessFolderBulkDownload(string path, string asUser = "", string fileName = "")
        {
            try
            {
                var boxClient = base.ConfigureBoxClient(oneCallAsUserId: this._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
                path = GeneralUtilities.TranslatePath(path);
                var idsList = this.ReadFileForIds(path);
                var fileList = new List<BoxBulkDownload>();
                foreach (var id in idsList)
                {
                    var tempItems = await boxClient.FoldersManager.GetFolderItemsAsync(id, 1000, autoPaginate: true);
                    var folderFiles = tempItems.Entries.Where(i => i.Type == "file");
                    foreach (var file in folderFiles)
                    {
                        fileList.Add(new BoxBulkDownload()
                        {
                            Id = file.Id
                        });

                    }
                }
                await BulkDownload(fileList, fileName);
            }
            catch (Exception e)
            {
                Reporter.WriteError(e.Message);
            }
        }
        protected async Task BulkDownload(List<BoxBulkDownload> files, string fileName = "")
        {
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: this._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            using (var archive = ZipArchive.Create())
            {
                Reporter.WriteInformation("Created zip archive...");
                foreach (var file in files)
                {
                    var fileInfo = await boxClient.FilesManager.GetInformationAsync(file.Id);
                    Reporter.WriteInformation($"Downloading {fileInfo.Name}...");
                    using (Stream stream = (!string.IsNullOrEmpty(file.VersionId)) ? await boxClient.FilesManager.DownloadStreamAsync(file.Id, file.VersionId) : await boxClient.FilesManager.DownloadStreamAsync(file.Id))
                    {
                        Reporter.WriteInformation("About to add entry...");
                        try
                        {
                            var ms = new MemoryStream();
                            await stream.CopyToAsync(ms);
                            Reporter.WriteInformation("Adding entry...");
                            archive.AddEntry(fileInfo.Name, ms, true, ms.Length);
                        }
                        catch (Exception e)
                        {
                            Reporter.WriteInformation("Failed.");
                            Reporter.WriteError(e.Message);
                            Reporter.WriteError(e.InnerException.Message);
                            Reporter.WriteError(e.StackTrace);
                        }
                    }

                }
                if (string.IsNullOrEmpty(fileName))
                {
                    fileName = $"{base._names.CommandNames.Files}-{base._names.SubCommandNames.Download}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
                }
                Reporter.WriteInformation("Processed files..");
                var downloadPath = base.ConstructDownloadsPath(fileName);
                Reporter.WriteInformation($"Saving to ${downloadPath}");
                archive.SaveTo($"{downloadPath}.zip", CompressionType.Deflate);
                Reporter.WriteSuccess("Downloaded files.");
            }
        }
    }
}