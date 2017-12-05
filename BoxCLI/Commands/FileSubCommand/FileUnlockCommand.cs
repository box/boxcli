using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.FileSubCommand
{
    public class FileUnlockCommand : FileSubCommandBase
    {
        private CommandArgument _fileId;
        private CommandLineApplication _app;
        public FileUnlockCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Unlock a file.";
            _fileId = command.Argument("fileId",
                               "Id of file to unlock");
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunUnlock();
            return await base.Execute();
        }

        private async Task RunUnlock()
        {
            base.CheckForFileId(this._fileId.Value, this._app);
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var unlocked = await boxClient.FilesManager.UnLock(this._fileId.Value);
            if(unlocked)
            {
                Reporter.WriteSuccess($"Unlocked file {this._fileId.Value}");
            }
            else
            {
                Reporter.WriteError($"Couldn't unlock file {this._fileId.Value}");
            }
        }
    }
}