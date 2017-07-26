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
        public UserSearchCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
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
            var boxClient = base.ConfigureBoxClient(returnServiceAccount: true);
            var BoxCollectionsIterators = base.GetIterators();
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
                var showNext = "";
                while (users.Entries.Count > 0 && showNext != "q")
                {
                    showNext = BoxCollectionsIterators.PageInConsole<BoxUser>(base.PrintUserInfo, users);
                }
                System.Console.WriteLine("Finished...");
                return;
            }
            await BoxCollectionsIterators.ListOffsetCollectionToConsole<BoxUser>((offset) =>
                {
                    return boxClient.UsersManager.GetEnterpriseUsersAsync(offset: offset, filterTerm: userName);
                }, base.PrintUserInfo);
            System.Console.WriteLine("Finished...");
        }
    }
}