using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.FileVersionSubCommands
{
    public class FileVersionPromoteCommand : FileVersionSubCommandBase
    {
        private CommandArgument _fileId;
        private CommandArgument _fileVersionId;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public FileVersionPromoteCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Promote a file version.";
            _fileId = command.Argument("fileId",
                               "Id of file to manage");
            _fileVersionId = command.Argument("fileVersionId",
                               "Id of file version to promote");
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunPromote();
            return await base.Execute();
        }

        private async Task RunPromote()
        {
            base.CheckForFileId(this._fileId.Value, this._app);
            base.CheckForFileVersionId(this._fileVersionId.Value, this._app);
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var promotedFile = await boxClient.FilesManager.PromoteVersionAsync(this._fileId.Value, this._fileVersionId.Value);
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(promotedFile);
                return;
            }
            base.PrintFileVersion(promotedFile);
        }
    }
}