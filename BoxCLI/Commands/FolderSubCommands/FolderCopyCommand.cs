using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.FolderSubCommands
{
    public class FolderCopyCommand : FolderSubCommandBase
    {
        public FolderCopyCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }

        private CommandArgument _folderId;
        private CommandArgument _parentFolderId;
        private CommandOption _name;
        private CommandOption _idOnly;
        private CommandLineApplication _app;

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Copy a folder to a different folder.";
            _folderId = command.Argument("folderId",
                               "Id of folder to copy");
            _parentFolderId = command.Argument("parentFolderId",
                                                "Id of new parent folder");
            _name = command.Option("-n|--name", "An optional new name for the folder", CommandOptionType.SingleValue);
            _idOnly = IdOnlyOption.ConfigureOption(command);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunCopy();
            return await base.Execute();
        }

        private async Task RunCopy()
        {
            base.CheckForId(this._folderId.Value, this._app);
            base.CheckForParentId(this._parentFolderId.Value, this._app);
            var copy = await base.CopyFolder(this._folderId.Value, this._parentFolderId.Value, this._name.Value());
            if(this._idOnly.HasValue())
            {
                Reporter.WriteInformation(copy.Id);
                return;
            }
            Reporter.WriteSuccess($"Copied folder {this._folderId.Value} to folder {this._parentFolderId.Value}");
            base.PrintFolder(copy);
        }
    }
}