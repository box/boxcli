using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.FileVersionSubCommands
{
    public class FileVersionListCommand : FileVersionSubCommandBase
    {
        private CommandLineApplication _app;
        private CommandArgument _fileId;
        public FileVersionListCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get a list of file versions.";
            _fileId = command.Argument("fileId",
                               "Id of file to get versions for");
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunList();
            return await base.Execute();
        }

        private async Task RunList()
        {
            base.CheckForFileId(this._fileId.Value, this._app);
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            var fileVersions = await boxClient.FilesManager.ViewVersionsAsync(this._fileId.Value);
            foreach(var version in fileVersions.Entries)
            {
                base.PrintFileVersion(version);
            }
        }
    }
}