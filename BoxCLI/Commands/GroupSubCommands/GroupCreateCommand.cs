using System;
using System.Threading.Tasks;
using Box.V2.Models;
using Box.V2.Models.Request;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.GroupSubCommands
{
    public class GroupCreateCommand : GroupSubCommandBase
    {
        private CommandArgument _name;
        private CommandOption _inviteLevel;
        private CommandOption _viewMembershipLevel;
        private CommandLineApplication _app;
        public GroupCreateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Create a group.";
            _name = command.Argument("name", "Group name");
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
            await this.RunCreate();
            return await base.Execute();
        }

        private async Task RunCreate()
        {
            base.CheckForValue(this._name.Value, this._app, "A group name is required for this command");
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            var groupRequest = new BoxGroupRequest();
            groupRequest.Name = this._name.Value;
            if (this._inviteLevel.HasValue())
            {
                groupRequest.InvitabilityLevel = base.CheckInvitabilityLevel(this._inviteLevel.Value());
            }
            if (this._viewMembershipLevel.HasValue())
            {
                groupRequest.MemberViewabilityLevel = base.CheckViewMembersLevel(this._viewMembershipLevel.Value());
            }

            base.PrintGroup(await boxClient.GroupsManager.CreateAsync(groupRequest));
        }
    }
}