using System.Threading.Tasks;
using Box.V2.Models.Request;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.GroupSubCommands
{
    public class GroupUpdateCommand : GroupSubCommandBase
    {
        private CommandArgument _id;
        private CommandOption _name;
        private CommandOption _inviteLevel;
        private CommandOption _viewMembershipLevel;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public GroupUpdateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names) : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Update a group.";
            _id = command.Argument("groupId", "Group ID");
            _name = command.Option("-n|--name", "Group name", CommandOptionType.SingleValue);
            _inviteLevel = command.Option("-i|--invite",
                                   "Specifies who can invite the group to collaborate. Enter admins_only, admins_and_members, or all_managed_users",
                                   CommandOptionType.SingleValue);
            _viewMembershipLevel = command.Option("-m|--view-members",
                                   "Specifies who can view the members of the group. Enter admins_only, admins_and_members, or all_managed_users",
                                   CommandOptionType.SingleValue);

            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunUpdate();
            return await base.Execute();
        }

        private async Task RunUpdate()
        {
            base.CheckForValue(this._id.Value, this._app, "A group ID is required for this command");
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            var groupRequest = new BoxGroupRequest();
            if (this._name.HasValue())
            {
                groupRequest.Name = this._name.Value();
            }
            if (this._inviteLevel.HasValue())
            {
                groupRequest.InvitabilityLevel = base.CheckInvitabilityLevel(this._inviteLevel.Value());
            }
            if (this._viewMembershipLevel.HasValue())
            {
                groupRequest.MemberViewabilityLevel = base.CheckViewMembersLevel(this._viewMembershipLevel.Value());
            }
            var updatedGroup = await boxClient.GroupsManager.UpdateAsync(this._id.Value, groupRequest);
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(updatedGroup);
                return;
            }
            base.PrintGroup(updatedGroup);
        }
    }
}