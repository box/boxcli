using System;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using BoxCLI.CommandUtilities.CsvModels;
using Microsoft.Extensions.CommandLineUtils;
using BoxCLI.CommandUtilities.CommandOptions;

namespace BoxCLI.Commands.GroupSubCommands.GroupMembershipSubCommands
{
    public class GroupMembershipListCommand : GroupMembershipSubCommandBase
    {
        private CommandArgument _id;
        private CommandOption _listMembers;
        private CommandOption _listGroups;
        private CommandOption _listCollab;
        private CommandOption _save;
        private CommandOption _fileFormat;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public GroupMembershipListCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
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
            _save = SaveOption.ConfigureOption(command);
            _fileFormat = FileFormatOption.ConfigureOption(command);
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
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());

            var BoxCollectionsIterators = base.GetIterators(!String.IsNullOrEmpty(base._oneUseToken.Value()));
            if (this._listGroups.HasValue())
            {
                if (_save.HasValue())
                {
                    var userMemberships = await boxClient.GroupsManager.GetAllGroupMembershipsForUserAsync(this._id.Value, autoPaginate: true);
                    var fileName = $"{base._names.CommandNames.GroupMembership}-{base._names.SubCommandNames.List}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
                    Reporter.WriteInformation("Saving file...");
                    var saved = base.WriteOffsetCollectionResultsToReport<BoxGroupMembership, BoxGroupMembershipMap>(userMemberships, fileName, fileFormat: this._fileFormat.Value());
                    Reporter.WriteInformation($"File saved: {saved}");
                    return;
                }
                if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
                {
                    var memberships = await boxClient.GroupsManager.GetAllGroupMembershipsForUserAsync(this._id.Value, autoPaginate: true);
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
                if (_save.HasValue())
                {
                    var membershipCollaborations = await boxClient.GroupsManager.GetCollaborationsForGroupAsync(this._id.Value, autoPaginate: true);
                    var fileName = $"{base._names.CommandNames.GroupMembership}-{base._names.SubCommandNames.List}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
                    Reporter.WriteInformation("Saving file...");
                    var saved = base.WriteOffsetCollectionResultsToReport<BoxCollaboration, BoxCollaborationMap>(membershipCollaborations, fileName, fileFormat: this._fileFormat.Value());
                    Reporter.WriteInformation($"File saved: {saved}");
                    return;
                }
                if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
                {
                    var memberships = await boxClient.GroupsManager.GetCollaborationsForGroupAsync(this._id.Value, autoPaginate: true);
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
                if (_save.HasValue())
                {
                    var memberships = await boxClient.GroupsManager.GetAllGroupMembershipsForGroupAsync(this._id.Value, autoPaginate: true);
                    var fileName = $"{base._names.CommandNames.GroupMembership}-{base._names.SubCommandNames.List}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
                    Reporter.WriteInformation("Saving file...");
                    var saved = base.WriteOffsetCollectionResultsToReport<BoxGroupMembership, BoxGroupMembershipMap>(memberships, fileName, fileFormat: this._fileFormat.Value());
                    Reporter.WriteInformation($"File saved: {saved}");
                    return;
                }
                if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
                {
                    var memberships = await boxClient.GroupsManager.GetAllGroupMembershipsForGroupAsync(this._id.Value, autoPaginate: true);
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