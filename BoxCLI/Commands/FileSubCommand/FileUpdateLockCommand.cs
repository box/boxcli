using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.FileSubCommand
{
    public class FileUpdateLockCommand : FileSubCommandBase
    {
        private CommandArgument _fileId;
        private CommandOption _expires;
        private CommandOption _preventDownload;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public FileUpdateLockCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }


        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Change the lock on a file";
            _fileId = command.Argument("fileId",
                               "Id of file to manage lock");
            _expires = command.Option("--expires",
                               "Make the lock expire from a timespan set from now. Use s for seconds, m for minutes, h for hours, d for days, w for weeks, M for months. For example, 30 seconds is 30s.",
                               CommandOptionType.SingleValue);
            _preventDownload = command.Option("--prevent-download",
                               "Prevent download of locked file", CommandOptionType.NoValue);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunLock();
            return await base.Execute();
        }

        private async Task RunLock()
        {
            base.CheckForFileId(this._fileId.Value, this._app);
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            var lockRequest = new BoxFileLockRequest();
            var boxLock = new BoxFileLock();
            if (this._preventDownload.HasValue())
            {
                boxLock.IsDownloadPrevented = true;
            }
            if (this._expires.HasValue())
            {
                boxLock.ExpiresAt = GeneralUtilities.GetDateTimeFromString(this._expires.Value());
            }
            lockRequest.Lock = boxLock;
            var boxUnlocked = await boxClient.FilesManager.UpdateLockAsync(lockRequest, this._fileId.Value);
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(boxUnlocked);
                return;
            }
            base.PrintFileLock(boxUnlocked);
        }
    }
}