using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.UserSubCommands
{
    public class UserInviteCommand : UserSubCommandBase
    {
        private CommandArgument _userEmail;
        private CommandArgument _enterpriseId;
        private CommandLineApplication _app;
        public UserInviteCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Invite an Existing Box User to Your Enterprise";
            _userEmail = command.Argument("userEmail",
                                   "User Email To Invite");
            _enterpriseId = command.Argument("enterpriseId",
                                   "Enterprise ID to Invite User To");
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunInvite();
            return await base.Execute();
        }

        private async Task RunInvite()
        {
            base.CheckForValue(this._userEmail.Value, this._app, "A user email is required for this command");
            base.CheckForValue(this._enterpriseId.Value, this._app, "An enterprise id is required for this command");
            var boxClient = base.ConfigureBoxClient(returnServiceAccount: true);
            BoxUserInviteRequest userInviteRequest = new BoxUserInviteRequest()
            {
                Enterprise = new BoxRequestEntity()
                {
                    Id = this._enterpriseId.Value
                },
                ActionableBy = new BoxActionableByRequest()
                {
                    Login = this._userEmail.Value
                }
            };

            var userInvite = await boxClient.UsersManager.InviteUserToEnterpriseAsync(userInviteRequest);
            if (base._json.HasValue())
            {
                base.OutputJson(userInvite);
                return;
            }
            if (userInvite.InvitedTo.Id == this._enterpriseId.Value)
            {
                Reporter.WriteSuccess($"Invited user {this._userEmail.Value}");
            }
            else
            {
                Reporter.WriteError($"Couldn't invite user {this._userEmail.Value}");
            }
        }
    }
}