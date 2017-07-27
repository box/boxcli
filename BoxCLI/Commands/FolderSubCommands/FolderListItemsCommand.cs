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
    public class FolderListItemsCommand : FolderSubCommandBase
    {
        private CommandArgument _folderId;
        private CommandLineApplication _app;
        public FolderListItemsCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get information about a folder.";
            _folderId = command.Argument("folderId",
                               "Id of folder to manage, use '0' for the root folder");
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunGetItems();
            return await base.Execute();
        }

        protected async Task RunGetItems()
        {
            base.CheckForId(this._folderId.Value, this._app);
            try
            {
                var boxClient = base.ConfigureBoxClient(base._asUser.Value());
                var BoxCollectionsIterators = base.GetIterators();
                await BoxCollectionsIterators.ListOffsetCollectionToConsole<BoxItem>((offset) =>
                {
                    return boxClient.FoldersManager.GetFolderItemsAsync(this._folderId.Value, 100, offset: (int)offset);
                }, base.PrintItem);
            }
            catch (Exception e)
            {
                Reporter.WriteError(e.Message);
            }
        }
    }
}