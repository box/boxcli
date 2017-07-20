using System;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.FolderSubCommands
{
    public class FolderGetCommand : FolderSubCommandBase
    {
        private CommandArgument _folderId;
        private CommandOption _asUser;
        private CommandLineApplication _app;
        public FolderGetCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names) 
            : base(boxPlatformBuilder, boxHome, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get information about a folder.";
            _folderId = command.Argument("folderId",
                               "Id of folder to manage, use '0' for the root folder");
            _asUser = AsUserOption.ConfigureOption(command);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunGet(_folderId.Value, _asUser.Value());
            return await base.Execute();
        }

        protected async Task RunGet(string id, string asUserId)
        {
            var BoxClient = base.ConfigureBoxClient(asUserId);
            if (id == null)
            {
                _app.ShowHelp();
                return;
            }
            try
            {
                var folder = await BoxClient.FoldersManager.GetInformationAsync(id);
                System.Console.WriteLine(folder.Name);
                foreach (var item in folder.ItemCollection.Entries)
                {
                    System.Console.WriteLine($"{item.Name} - {item.Id}");
                }
            }
            catch (Exception e)
            {
                Reporter.WriteError(e.Message);
            }
        }

    }
}