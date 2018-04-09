using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Box.V2.Models;
using Box.V2.Models.Request;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.CsvModels;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.GroupSubCommands
{
    public class GroupCreateCommand : GroupSubCommandBase
    {
        private CommandArgument _name;
        private CommandOption _inviteLevel;
        private CommandOption _viewMembershipLevel;
        private CommandOption _save;
        private CommandOption _bulkPath;
        private CommandOption _idOnly;
        private CommandOption _fileFormat;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public GroupCreateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Create a group.";
            _name = command.Argument("name", "Group name");
            _bulkPath = BulkFilePathOption.ConfigureOption(command);
            _save = SaveOption.ConfigureOption(command);
            _fileFormat = FileFormatOption.ConfigureOption(command);
            _inviteLevel = command.Option("-i|--invite",
                                   "Specifies who can invite the group to collaborate. Enter admins_only, admins_and_members, or all_managed_users",
                                   CommandOptionType.SingleValue);
            _viewMembershipLevel = command.Option("-m|--view-members",
                                   "Specifies who can view the members of the group. Enter admins_only, admins_and_members, or all_managed_users",
                                   CommandOptionType.SingleValue);
            _idOnly = IdOnlyOption.ConfigureOption(command);

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
            if (this._bulkPath.HasValue())
            {
                var json = false;
                if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
                {
                    json = true;
                }
                await base.CreateGroupsFromFile(this._bulkPath.Value(), this._save.HasValue(), 
                json: json, overrideSaveFileFormat: this._fileFormat.Value());
                return;
            }
            base.CheckForValue(this._name.Value, this._app, "A group name is required for this command");
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
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
            var createdGroup = await boxClient.GroupsManager.CreateAsync(groupRequest);
            if (_save.HasValue())
            {
                var fileName = $"{base._names.CommandNames.Groups}-{base._names.SubCommandNames.Create}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
                Reporter.WriteInformation("Saving file...");
                var listWrapper = new List<BoxGroup>();
                listWrapper.Add(createdGroup);
                var saved = base.WriteListResultsToReport<BoxGroup, BoxGroupMap>(listWrapper, fileName, fileFormat: this._fileFormat.Value());
                Reporter.WriteInformation($"File saved: {saved}");
                return;
            }
            if (this._idOnly.HasValue())
            {
                Reporter.WriteInformation(createdGroup.Id);
                return;
            }
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(createdGroup);
                return;
            }
            base.PrintGroup(createdGroup);
        }
    }
}