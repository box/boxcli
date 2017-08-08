using System;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.FileSubCommand
{
    public class FileLockCommand : FileSubCommandBase
    {
        private CommandArgument _fileId;
        private CommandOption _expires;
        private CommandOption _preventDownload;
        private CommandLineApplication _app;
        public FileLockCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names) 
            : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Lock a file.";
            _fileId = command.Argument("fileId",
                               "Id of file to lock");
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
            if(this._preventDownload.HasValue())
            {
                boxLock.IsDownloadPrevented = true;
            } 
            if(this._expires.HasValue())
            {
                boxLock.ExpiresAt = GeneralUtilities.GetDateTimeFromString(this._expires.Value());
            }  
            lockRequest.Lock = boxLock;
            base.PrintFileLock(await boxClient.FilesManager.LockAsync(lockRequest, this._fileId.Value));
        }
    }
}