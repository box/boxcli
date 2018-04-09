using System;
using System.Threading.Tasks;
using Box.V2.Models;
using Box.V2.Models.Request;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.GroupSubCommands.GroupMembershipSubCommands
{
    public class GroupMembershipUpdateCommand : GroupMembershipSubCommandBase
    {
        private CommandArgument _membershipId;
        private CommandOption _save;
        private CommandOption _bulkPath;
        private CommandOption _fileFormat;
        private CommandOption _admin;
        private CommandOption _member;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public GroupMembershipUpdateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Update a user's membership to a group.";
            _bulkPath = BulkFilePathOption.ConfigureOption(command);
            _save = SaveOption.ConfigureOption(command);
            _fileFormat = FileFormatOption.ConfigureOption(command);
            _membershipId = command.Argument("membershipId",
                                   "Id of group membership");
            _admin = command.Option("--set-admin",
                                   "Set the user's role to Group Admin", CommandOptionType.NoValue);
            _member = command.Option("--set-member",
                                   "Set the user's role to Group Member", CommandOptionType.NoValue);

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
                await base.CreateGroupMembershipsFromFile(this._bulkPath.Value(), this._save.HasValue(),
                json: json, overrideSaveFileFormat: this._fileFormat.Value());
                return;
            }
            base.CheckForValue(this._membershipId.Value, this._app, "A group memebership ID is required for this command.");
            var role = "";
            if (this._admin.HasValue())
            {
                role = "admin";
            }
            else if (this._member.HasValue())
            {
                role = "member";
            }
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var memberRequest = new BoxGroupMembershipRequest();
            if (!string.IsNullOrEmpty(role))
            {
                memberRequest.Role = role;
            }
            else
            {
                throw new Exception("Couldn't update the user's membership role.");
            }
            var updatedMembership = await boxClient.GroupsManager.UpdateGroupMembershipAsync(this._membershipId.Value, memberRequest);
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(updatedMembership);
                return;
            }
            Reporter.WriteSuccess("Updated the user's role.");
            base.PrintGroupMember(updatedMembership);
        }
    }
}