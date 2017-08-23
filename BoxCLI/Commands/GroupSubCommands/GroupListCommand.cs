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

namespace BoxCLI.Commands.GroupSubCommands
{
    public class GroupListCommand : GroupSubCommandBase
    {
        private CommandOption _save;
        private CommandOption _fileFormat;
        private CommandLineApplication _app;
        public GroupListCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            _save = SaveOption.ConfigureOption(command);
            _fileFormat = FileFormatOption.ConfigureOption(command);
            command.Description = "List all groups.";

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
            
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
			if (_save.HasValue())
			{
				var fileName = $"{base._names.CommandNames.Groups}-{base._names.SubCommandNames.List}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
				Reporter.WriteInformation("Saving file...");
                var saveGroups = await boxClient.GroupsManager.GetAllGroupsAsync(autoPaginate: true);
				var saved = base.WriteOffsetCollectionResultsToReport<BoxGroup, BoxGroupMap>(saveGroups, fileName, fileFormat: this._fileFormat.Value());
				Reporter.WriteInformation($"File saved: {saved}");
				return;
			}
            if (base._json.HasValue())
            {
                var saveGroups = await boxClient.GroupsManager.GetAllGroupsAsync(autoPaginate: true);
                base.OutputJson(saveGroups);
                return;
            }
            var BoxCollectionsIterators = base.GetIterators();
            await BoxCollectionsIterators.ListOffsetCollectionToConsole<BoxGroup>((offset) =>
            {
                return boxClient.GroupsManager.GetAllGroupsAsync(limit: 100, offset: (int)offset);
            }, base.PrintGroup);
        }
    }
}