using System;
using System.Threading.Tasks;
using Box.V2;
using Box.V2.Models;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.BoxPlatform.Utilities;
using Microsoft.Extensions.CommandLineUtils;
using Microsoft.Extensions.Logging;

namespace BoxCLI.Commands
{
    public class UserCommand
    {
        public void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Manage your Box users -- get information about a user, create new users, delete users.";
            command.HelpOption("--help|-h|-?");
            command.ExtendedHelpText = "You can use this command to create, update, delete, and get information about a Box user in your Enterprise.";

            var idArgument = command.Argument("userId",
                                   "Id of user to manage, use 'me' for the current user");

            command.OnExecute(async () =>
                {
                    await this.RunGet(idArgument.Value);
                    return 0;
                });

            command.Command("get", users =>
            {
                var userIdArgument = users.Argument("userId",
                                   "Id of user to manage, use 'me' for the current user");
                users.Description = "Get information about a Box user.";
                users.HelpOption("--help|-h|-?");
                users.OnExecute(async () =>
                {
                    await this.RunGet(userIdArgument.Value);
                    return 0;
                });
            });

            command.Command("list", users =>
            {
                users.Description = "List Box users.";
                users.HelpOption("--help|-h|-?");
                var managedOnly = users.Option("-m|--managed-users <file>",
                               "List only managed users",
                               CommandOptionType.NoValue);
                users.OnExecute(async () =>
                {
                    await this.RunList(managedOnly.HasValue());
                    return 0;
                });
            });

            command.Command("search", users =>
            {
                users.Description = "Search for Box users.";
                users.HelpOption("--help|-h|-?");
                var userName = users.Argument("userName",
                                   "Name of user to search for");
                var managedOnly = users.Option("-m|--managed-users <file>",
                               "Limit search to only managed users",
                               CommandOptionType.NoValue);
                users.OnExecute(async () =>
                {
                    await this.RunSearch(users, userName.Value, managedOnly.HasValue());
                    return 0;
                });
            });

        }

        private readonly IBoxPlatformServiceBuilder _boxPlatformBuilder;
        private readonly ILogger _logger;
        private CommandLineApplication _app;
        private IBoxPlatformService Box;
        private BoxClient BoxServiceAccountClient;
        private IBoxCollectionsIterators BoxCollectionsIterators;

        public UserCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, ILogger<UserCommand> logger)
        {
            _boxPlatformBuilder = boxPlatformBuilder;
            _logger = logger;
            Box = _boxPlatformBuilder.Build();
            BoxServiceAccountClient = Box.AdminClient();
            BoxCollectionsIterators = Box.BoxCollectionsIterators;
        }

        public async Task RunSearch(CommandLineApplication app, string userName, bool managedOnly = false)
        {
            if (string.IsNullOrEmpty(userName))
            {
                System.Console.WriteLine("A user name is required to search.");
                app.ShowHelp();
                return;
            }
            if (managedOnly)
            {
                var users = await BoxServiceAccountClient.UsersManager.GetEnterpriseUsersAsync(filterTerm: userName, autoPaginate: true);
                users.Entries.RemoveAll(user =>
                {
                    return user.Login.Contains("AppUser");
                });
                var showNext = "";
                while (users.Entries.Count > 0 && showNext != "q")
                {
                    showNext = BoxCollectionsIterators.PageInConsole<BoxUser>(PrintUserInfo, users);
                }
                System.Console.WriteLine("Finished...");
                return;
            }
            await BoxCollectionsIterators.ListOffsetCollectionToConsole<BoxUser>((offset) =>
                {
                    return BoxServiceAccountClient.UsersManager.GetEnterpriseUsersAsync(offset: offset, filterTerm: userName);
                }, PrintUserInfo);
            System.Console.WriteLine("Finished...");
        }

        public async Task RunList(bool managedOnly = false)
        {
            try
            {
                if (managedOnly)
                {
                    var users = await BoxServiceAccountClient.UsersManager.GetEnterpriseUsersAsync(autoPaginate: true);
                    users.Entries.RemoveAll(user =>
                    {
                        return user.Login.Contains("AppUser");
                    });
                    var showNext = "";
                    while (users.Entries.Count > 0 && showNext != "q")
                    {
                        showNext = BoxCollectionsIterators.PageInConsole<BoxUser>(PrintUserInfo, users);
                    }
                    System.Console.WriteLine("Finished...");
                    return;
                }
                await BoxCollectionsIterators.ListOffsetCollectionToConsole<BoxUser>((offset) =>
                {
                    return BoxServiceAccountClient.UsersManager.GetEnterpriseUsersAsync(offset: offset);
                }, PrintUserInfo);
                System.Console.WriteLine("Finished...");
            }
            catch (Exception e)
            {
                _logger.LogDebug(e.Message);
            }
        }

        public async Task RunGet(string id)
        {
            if (id == null)
            {
                _app.ShowHelp();
                return;
            }
            try
            {
                var user = await BoxServiceAccountClient.UsersManager.GetUserInformationAsync(id);
                PrintUserInfo(user);
            }
            catch (Exception e)
            {
                _logger.LogDebug(e.Message);
            }
        }

        public void PrintUserInfo(BoxUser user)
        {
            System.Console.WriteLine("----Information about this user----");
            if (user.IsPlatformAccessOnly == true)
            {
                System.Console.WriteLine("User is an App User");
            }
            if (user.Login.Contains("AutomationUser") && user.Login.Contains("@boxdevedition.com"))
            {
                System.Console.WriteLine("User is a Service Account");
            }
            System.Console.WriteLine($"User Id: {user.Id}");
            System.Console.WriteLine($"User Status: {user.Status}");
            System.Console.WriteLine($"User Type: {user.Type}");
            System.Console.WriteLine($"User Name: {user.Name}");
            System.Console.WriteLine($"User Login: {user.Login}");
            if (user.Enterprise != null)
            {
                System.Console.WriteLine($"Enterprise this User Belongs to: {user.Enterprise.Name}");
                System.Console.WriteLine($"Enterprise this User Belongs to: {user.Enterprise.Id}");
                System.Console.WriteLine($"Enterprise this User Belongs to: {user.Enterprise.Type}");
            }
            System.Console.WriteLine($"User Address: {user.Address}");
            System.Console.WriteLine($"User Phone: {user.Phone}");
            System.Console.WriteLine($"User Language: {user.Language}");
            System.Console.WriteLine($"User Role: {user.Role}");
            System.Console.WriteLine($"User Job Title: {user.JobTitle}");
            System.Console.WriteLine($"User Max Upload Size: {user.MaxUploadSize}");
            System.Console.WriteLine($"User Space Alloted: {user.SpaceAmount}");
            System.Console.WriteLine($"User Space Used: {user.SpaceUsed}");
        }
    }
}