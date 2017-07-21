using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.GroupSubCommands
{
    public class GroupGetCommand : GroupSubCommandBase
    {
        private CommandArgument _groupId;
        private CommandLineApplication _app;
        public GroupGetCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get information about a group.";
            _groupId = command.Argument("groupId",
                                   "Id of group");

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
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            base.PrintGroup(await boxClient.GroupsManager.GetGroupAsync(_groupId.Value));
        }
    }
}