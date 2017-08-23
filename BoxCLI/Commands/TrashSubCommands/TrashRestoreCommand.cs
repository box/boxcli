using System;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.TrashSubCommands
{
    public class TrashRestoreCommand : TrashSubCommandBase
    {
        private CommandLineApplication _app;
        private CommandArgument _itemId;
        private CommandArgument _type;
        public TrashRestoreCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Restore an item from trash.";
            _type = command.Argument("type",
                               "Type of item to restore");
            _itemId = command.Argument("itemId",
                               "Id of item to restore");
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunRestore();
            return await base.Execute();
        }

        private async Task RunRestore()
        {
            base.CheckForId(this._itemId.Value, this._app);
            base.CheckForType(this._type.Value, this._app);
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            if (this._type.Value == base._names.CommandNames.Files)
            {
                var item = await boxClient.FilesManager.RestoreTrashedAsync(new BoxFileRequest() { Id = this._itemId.Value });
                if (base._json.HasValue())
                {
                    base.OutputJson(item);
                    return;
                }
                base.PrintItem(item);
            }
            else if (this._type.Value == base._names.CommandNames.Folders)
            {
                var item = await boxClient.FoldersManager.RestoreTrashedFolderAsync(new BoxFolderRequest() { Id = this._itemId.Value });
                if (base._json.HasValue())
                {
                    base.OutputJson(item);
                    return;
                }
                base.PrintItem(item);
            }
            else
            {
                throw new Exception("Unsupported type for restoration.");
            }
        }
    }
}
