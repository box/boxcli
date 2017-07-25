using System;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.CsvModels;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;
namespace BoxCLI.Commands.TrashSubCommands
{
    public class TrashListCommand : TrashSubCommandBase
    {
        private CommandOption _save;
        private CommandOption _path;
        private CommandOption _fileFormat;
        private CommandOption _json;
        private CommandLineApplication _app;
        public TrashListCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }


        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "List all webhooks.";
            _save = SaveOption.ConfigureOption(command);
            _path = FilePathOption.ConfigureOption(command);
            _fileFormat = FileFormatOption.ConfigureOption(command);
            _json = OutputJsonOption.ConfigureOption(command);
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

        public async Task RunList()
        {
            try
            {
                var boxClient = base.ConfigureBoxClient(base._asUser.Value());
                var BoxCollectionsIterators = base.GetIterators();

                await BoxCollectionsIterators.ListOffsetCollectionToConsole<BoxItem>((offset) =>
                {
                    return boxClient.FoldersManager.GetTrashItemsAsync(limit: 1000, offset: (int)offset);
                }, PrintItem);
                System.Console.WriteLine("Finished...");
            }
            catch (Exception e)
            {
                Reporter.WriteError(e.Message);
            }
        }
    }
}