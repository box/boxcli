using System;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.TrashSubCommands
{
    public class TrashGetCommand : TrashSubCommandBase
    {
        private CommandLineApplication _app;
        private CommandArgument _itemId;
        private CommandArgument _type;
        public TrashGetCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get information about an item in the trash folder.";
            _type = command.Argument("type",
                               "Type of item to get");
            _itemId = command.Argument("itemId",
                               "Id of item to get");
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

        private async Task RunGet()
        {
            base.CheckForId(this._itemId.Value, this._app);
            base.CheckForType(this._type.Value, this._app);
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            if (this._type.Value == base._names.CommandNames.Files)
            {
                var item = await boxClient.FilesManager.GetTrashedAsync(this._itemId.Value);
                if (base._json.HasValue())
                {
                    base.OutputJson(item);
                    return;
                }
                base.PrintItem(item);
            }
            else if (this._type.Value == base._names.CommandNames.Folders)
            {
                var item = await boxClient.FoldersManager.GetTrashedFolderAsync(this._itemId.Value);
                if (base._json.HasValue())
                {
                    base.OutputJson(item);
                    return;
                }
                base.PrintItem(item);
            }
            else
            {
                throw new Exception("Unsupported type for getting information.");
            }
        }
    }
}
