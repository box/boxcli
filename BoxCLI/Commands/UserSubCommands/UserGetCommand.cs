using System;
using System.Threading.Tasks;
using Box.V2;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.UserSubCommands
{
    public class UserGetCommand : UserSubCommandBase
    {
        private CommandArgument _userId;
        private CommandOption _asUser;
        private CommandLineApplication _app;
        public UserGetCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get information about a Box user.";
            _userId = command.Argument("userId",
                                   "Id of user to manage, use 'me' for the current user");
            _asUser = AsUserOption.ConfigureOption(command);
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

        public async Task RunGet()
        {
            var id = this._userId.Value;
            BoxClient boxClient;
            if (id == "me")
            {
                boxClient = base.ConfigureBoxClient(this._asUser.Value());
            }
            else
            {
                boxClient = base.ConfigureBoxClient(returnServiceAccount: true);
            }
            try
            {
                var user = await boxClient.UsersManager.GetUserInformationAsync(id);
                if (base._json.HasValue())
                {
                    base.OutputJson(user);
                    return;
                }
                base.PrintUserInfo(user);
            }
            catch (Exception e)
            {
                Reporter.WriteError(e.Message);
            }
        }
    }
}