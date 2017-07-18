using System;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands
{
    public class FolderCommand : BaseCommand
    {
        private CommandLineApplication _app;
        public void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Work with folders in Box.";
            command.HelpOption("--help|-h|-?");
            command.ExtendedHelpText = "You can use this command to create, update, delete, and get information about a Box folders in your Enterprise.";
            command.Command("get", folders =>
            {
                var folderIdArgument = folders.Argument("folderId",
                                   "Id of folder to manage, use '0' for the root folder");
                var asUserOption = folders.Option("--as-user <as-user>",
            "Provide an ID for a user",
            CommandOptionType.SingleValue);
                folders.Description = "Get information about a Box folder.";
                folders.HelpOption("--help|-h|-?");
                folders.OnExecute(async () =>
                {
                    await this.RunGet(folderIdArgument.Value, asUserOption.Value());
                    return 0;
                });
            });
        }


        public FolderCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome) : base(boxPlatformBuilder, boxHome)
        {
        }
        private async Task RunGet(string id, string asUserId)
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
                foreach(var item in folder.ItemCollection.Entries)
                {
                    System.Console.WriteLine($"{item.Name} - {item.Id}");
                }                
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e.Message);
            }
        }


    }
}