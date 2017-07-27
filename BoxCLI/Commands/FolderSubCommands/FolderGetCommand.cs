using System;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.FolderSubCommands
{
    public class FolderGetCommand : FolderSubCommandBase
    {
        private CommandArgument _folderId;
        private CommandLineApplication _app;
        public FolderGetCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
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
            await this.RunGet();
            return await base.Execute();
        }

        protected async Task RunGet()
        {
            base.CheckForId(this._folderId.Value, this._app);
            var BoxClient = base.ConfigureBoxClient(base._asUser.Value());
            var folder = await BoxClient.FoldersManager.GetInformationAsync(this._folderId.Value);
            base.PrintFolder(folder);
        }

    }
}