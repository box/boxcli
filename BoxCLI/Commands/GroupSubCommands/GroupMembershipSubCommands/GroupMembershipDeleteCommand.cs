using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.GroupSubCommands.GroupMembershipSubCommands
{
    public class GroupMembershipDeleteCommand : GroupMembershipSubCommandBase
    {
        private CommandArgument _membershipId;
        private CommandLineApplication _app;
        public GroupMembershipDeleteCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names) 
            : base(boxPlatformBuilder, boxHome, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Remove a user from a group.";
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
            await this.RunDelete();
            return await base.Execute();
        }

        private async Task RunDelete()
        {
            base.CheckForValue(this._membershipId.Value, this._app, "A group memebership ID is required for this command.");
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var result = await boxClient.GroupsManager.DeleteGroupMembershipAsync(this._membershipId.Value);
            if(result)
            {
                Reporter.WriteSuccess($"Removed user from group with this ID: {this._membershipId.Value}");
            }
            else
            {
                Reporter.WriteError($"Couldn't remove user from group with this ID {this._membershipId.Value}");
            }
        }
    }
}