using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.TrashSubCommands
{
    public class TrashDeleteCommand : TrashSubCommandBase
    {
        private CommandLineApplication _app;
        private CommandArgument _itemId;
        public TrashDeleteCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get a file's information.";
            _itemId = command.Argument("itemId",
                               "Id of file to manage");
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunDelete();
            return await base.Execute();
        }

        private async Task RunDelete()
        {
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            var fileDeleted = false;
            fileDeleted = await boxClient.FilesManager.PurgeTrashedAsync(this._itemId.Value);
            if (fileDeleted)
            {
                Reporter.WriteSuccess($"Deleted file {this._itemId.Value}");
            }
            else
            {
                Reporter.WriteError($"Couldn't delete file {this._itemId.Value}");
            }
        }
    }
}