using System.Threading.Tasks;
using Box.V2.Models;
using Box.V2.Models.Request;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.GroupSubCommands.GroupMembershipSubCommands
{
    public class GroupMembershipCreateCommand : GroupMembershipSubCommandBase
    {
        private CommandArgument _userId;
        private CommandArgument _groupId;
        private CommandOption _admin;
        private CommandOption _member;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public GroupMembershipCreateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Add a user to a group.";
            _userId = command.Argument("userId",
                                   "Id of user");
            _groupId = command.Argument("groupId",
                                   "Id of group");
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
            base.CheckForValue(this._userId.Value, this._app, "A user ID is required for this command.");
            base.CheckForValue(this._groupId.Value, this._app, "A group ID is required for this command.");
            var role = "";
            if (this._admin.HasValue())
            {
                role = "admin";
            }
            else
            {
                role = "member";
            }
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var memberRequest = new BoxGroupMembershipRequest();
            memberRequest.Group = new BoxGroupRequest();
            memberRequest.Group.Id = this._groupId.Value;
            memberRequest.User = new BoxRequestEntity();
            memberRequest.User.Id = this._userId.Value;
            memberRequest.Role = role;
            var membership = await boxClient.GroupsManager.AddMemberToGroupAsync(memberRequest);
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(membership);
                return;
            }
            base.PrintGroupMember(membership);
        }
    }
}