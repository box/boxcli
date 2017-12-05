using System;
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
    public class UserSearchCommand : UserSubCommandBase
    {
        private CommandOption _managedUsers;
        private CommandArgument _userName;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public UserSearchCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Search for Box users.";
            _userName = command.Argument("userName",
                                   "Name of user to search for");
            _managedUsers = ManagedUsersOnlyOption.ConfigureOption(command);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunSearch(_userName.Value, _managedUsers.HasValue());
            return await base.Execute();
        }

        private async Task RunSearch(string userName, bool managedOnly = false)
        {
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var BoxCollectionsIterators = base.GetIterators(!String.IsNullOrEmpty(base._oneUseToken.Value()));
            if (string.IsNullOrEmpty(userName))
            {
                Reporter.WriteWarning("A user name is required to search.");
                _app.ShowHelp();
                return;
            }
            if (managedOnly)
            {
                var users = await boxClient.UsersManager.GetEnterpriseUsersAsync(filterTerm: userName, autoPaginate: true);
                users.Entries.RemoveAll(user =>
                {
                    return user.Login.Contains("AppUser");
                });
                if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
                {
                    base.OutputJson(users);
                    return;
                }
                var showNext = "";
                while (users.Entries.Count > 0 && showNext != "q")
                {
                    showNext = BoxCollectionsIterators.PageInConsole<BoxUser>(base.PrintUserInfo, users);
                }
                Reporter.WriteInformation("Finished...");
                return;
            }
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                var users = await boxClient.UsersManager.GetEnterpriseUsersAsync(filterTerm: userName, autoPaginate: true);
                base.OutputJson(users);
                return;
            }
            await BoxCollectionsIterators.ListOffsetCollectionToConsole<BoxUser>((offset) =>
                {
                    return boxClient.UsersManager.GetEnterpriseUsersAsync(offset: offset, filterTerm: userName);
                }, base.PrintUserInfo);
            Reporter.WriteInformation("Finished...");
        }
    }
}