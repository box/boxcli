using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.GroupSubCommands.GroupMembershipSubCommands
{
    public class GroupMembershipListCommand : GroupMembershipSubCommandBase
    {
        private CommandArgument _id;
        private CommandOption _listMembers;
        private CommandOption _listGroups;
        private CommandOption _listCollab;
        private CommandLineApplication _app;
        public GroupMembershipListCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "List members in a group, groups a user belongs to, or collaborations for a group. Lists members in a group by default.";
            _id = command.Argument("id",
                                   "Id of group or user");
            _listMembers = command.Option("--list-members",
                                   "List members of a group with a group ID", CommandOptionType.NoValue);
            _listGroups = command.Option("--list-groups",
                                   "List groups a user belongs to with a user ID", CommandOptionType.NoValue);
            _listCollab = command.Option("--list-collaborations",
                                   "List collaborations for a group with a group ID", CommandOptionType.NoValue);

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
            base.CheckForValue(this._id.Value, this._app, "A group ID or user ID is required for this command");
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());

            var BoxCollectionsIterators = base.GetIterators();
            if (this._listGroups.HasValue())
            {
                if (base._json.HasValue())
                {
                    var memberships = boxClient.GroupsManager.GetAllGroupMembershipsForUserAsync(this._id.Value, autoPaginate: true);
                    base.OutputJson(memberships);
                    return;
                }
                await BoxCollectionsIterators.ListOffsetCollectionToConsole<BoxGroupMembership>((offset) =>
                {
                    return boxClient.GroupsManager.GetAllGroupMembershipsForUserAsync(this._id.Value, offset: (int)offset);
                }, base.PrintGroupMember);
            }
            else if (this._listCollab.HasValue())
            {
                if (base._json.HasValue())
                {
                    var memberships = boxClient.GroupsManager.GetCollaborationsForGroupAsync(this._id.Value, autoPaginate: true);
                    base.OutputJson(memberships);
                    return;
                }
                await BoxCollectionsIterators.ListOffsetCollectionToConsole<BoxCollaboration>((offset) =>
                {
                    return boxClient.GroupsManager.GetCollaborationsForGroupAsync(this._id.Value, offset: (int)offset);
                }, base.PrintCollaboration);
            }
            else
            {
                if (base._json.HasValue())
                {
                    var memberships = boxClient.GroupsManager.GetAllGroupMembershipsForGroupAsync(this._id.Value, autoPaginate: true);
                    base.OutputJson(memberships);
                    return;
                }
                await BoxCollectionsIterators.ListOffsetCollectionToConsole<BoxGroupMembership>((offset) =>
                {
                    return boxClient.GroupsManager.GetAllGroupMembershipsForGroupAsync(this._id.Value, offset: (int)offset);
                }, base.PrintGroupMember);
            }
        }
    }
}