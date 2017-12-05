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
        private CommandLineApplication _app;
        private IBoxHome _home;

        public UserGetCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get information about a Box user.";
            _userId = command.Argument("userId",
                                   "Id of user to manage, use 'me' for the current user");
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
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var user = await boxClient.UsersManager.GetUserInformationAsync(id);
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(user);
                return;
            }
            base.PrintUserInfo(user);
        }
    }
}