using System;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.TrashSubCommands
{
    public class TrashDeleteCommand : TrashSubCommandBase
    {
        private CommandLineApplication _app;
        private CommandArgument _itemId;
        private CommandArgument _type;
        private CommandOption _dontPrompt;
        public TrashDeleteCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Permanently delete an item.";
            _type = command.Argument("type",
                               "Type of item to permanently delete");
            _itemId = command.Argument("itemId",
                               "Id of item to permanently delete");
            _dontPrompt = SuppressDeletePromptOption.ConfigureOption(command);
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
            base.CheckForId(this._itemId.Value, this._app);
            base.CheckForType(this._type.Value, this._app);

            var itemDeleted = false;
			if (this._dontPrompt.HasValue())
			{
				itemDeleted = await this.DeleteItem();
			}
			else
			{
				Reporter.WriteWarningNoNewLine("Are you sure you want to permanently delete this item? y/N ");
				var yNKey = "n";
				yNKey = Console.ReadLine().ToLower();
				if (yNKey != "y")
				{
					Reporter.WriteInformation("Aborted item deletion.");
					return;
				}
				else
				{
					itemDeleted = await this.DeleteItem();
				}
			}

            if (itemDeleted)
            {
                Reporter.WriteSuccess($"Deleted item {this._itemId.Value}");
            }
            else
            {
                Reporter.WriteError($"Couldn't delete item {this._itemId.Value}");
            }
        }

        private async Task<bool> DeleteItem()
        {
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
			if (this._type.Value == base._names.CommandNames.Files)
			{
				return await boxClient.FilesManager.PurgeTrashedAsync(this._itemId.Value);
			}
			else if (this._type.Value == base._names.CommandNames.Folders)
			{
				return await boxClient.FoldersManager.PurgeTrashedFolderAsync(this._itemId.Value);
			}
			else
			{
				throw new Exception("Unsupported type for deletion.");
			}
        }
    }
}