using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.GroupSubCommands.GroupMembershipSubCommands
{
    public class GroupMemberGetCommand : GroupMembershipSubCommandBase
    {
        private CommandArgument _membershipId;
        private CommandLineApplication _app;
        public GroupMemberGetCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get information about a group membership.";
            _membershipId = command.Argument("membershipId",
                                   "Id of group membership");

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
            base.CheckForValue(this._membershipId.Value, this._app, "A group memebership ID is required for this command.");
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            var membership = await boxClient.GroupsManager.GetGroupMembershipAsync(_membershipId.Value);
            if (base._json.HasValue())
            {
                base.OutputJson(membership);
                return;
            }
            base.PrintGroupMember(membership);
        }
    }
}