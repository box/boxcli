using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.GroupSubCommands
{
    public class GroupListCommand : GroupSubCommandBase
    {
        private CommandLineApplication _app;
        public GroupListCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
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
            var BoxCollectionsIterators = base.GetIterators();
            await BoxCollectionsIterators.ListOffsetCollectionToConsole<BoxGroup>((offset) =>
            {
                return boxClient.GroupsManager.GetAllGroupsAsync(limit: 100, offset: (int)offset);
            }, base.PrintGroup);
        }
    }
}