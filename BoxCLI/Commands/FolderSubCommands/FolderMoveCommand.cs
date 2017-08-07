using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.FolderSubCommands
{
    public class FolderMoveCommand : FolderSubCommandBase
    {
        private CommandArgument _folderId;
        private CommandArgument _parentFolderId;
        private CommandOption _etag;
        private CommandOption _idOnly;
        private CommandLineApplication _app;
        public FolderMoveCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names) : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Move a folder to a different folder.";
            _folderId = command.Argument("folderId",
                               "Id of folder to move");
            _parentFolderId = command.Argument("parentFolderId",
                                                "Id of new parent folder");
            _etag = command.Option("--etag", "Only move if etag value matches", CommandOptionType.SingleValue);
            _idOnly = IdOnlyOption.ConfigureOption(command);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunMove();
            return await base.Execute();
        }

        private async Task RunMove()
        {
            base.CheckForId(this._folderId.Value, this._app);
            base.CheckForParentId(this._parentFolderId.Value, this._app);
            var move = await base.MoveFolder(this._folderId.Value, this._parentFolderId.Value, this._etag.Value());
            if(this._idOnly.HasValue())
            {
                Reporter.WriteInformation(move.Id);
                return;
            }
            Reporter.WriteSuccess($"Moved folder {this._folderId.Value} to folder {this._parentFolderId.Value}");
            base.PrintFolder(move);
        }
    }
}