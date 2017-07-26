using System;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.FolderSubCommands
{
    public class FolderSubCommandBase : BoxItemCommandBase
    {
        private CommandLineApplication _app;

        public FolderSubCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            base.Configure(command);
        }

        protected async virtual Task<BoxFolder> MoveFolder(string folderId, string parentFolderId, string etag = "")
        {
            var boxClient = base.ConfigureBoxClient(this._asUser.Value());
            var folderRequest = new BoxFolderRequest()
            {
                Id = folderId,
                Parent = new BoxItemRequest()
                {
                    Id = parentFolderId
                }
            };
            return await boxClient.FoldersManager.UpdateInformationAsync(folderRequest, etag: etag);
        }
        protected async virtual Task<BoxFolder> CopyFolder(string folderId, string parentFolderId, string name = "")
        {
            var boxClient = base.ConfigureBoxClient(this._asUser.Value());
            var folderRequest = new BoxFolderRequest()
            {
                Id = folderId,
                Parent = new BoxItemRequest()
                {
                    Id = parentFolderId
                }
            };
            if (!string.IsNullOrEmpty(name))
            {
                folderRequest.Name = name;
            }
            return await boxClient.FoldersManager.CopyAsync(folderRequest);
        }
    }
}