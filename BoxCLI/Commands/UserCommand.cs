using System;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxPlatform.Service;
using Microsoft.Extensions.CommandLineUtils;

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

        }

        private readonly IBoxPlatformServiceBuilder _boxPlatformBuilder;
        private CommandLineApplication _app;

        public UserCommand(IBoxPlatformServiceBuilder boxPlatformBuilder)
        {
            _boxPlatformBuilder = boxPlatformBuilder;
        }

        public async Task RunList(bool managedOnly = false)
        {
            try
            {
                var box = _boxPlatformBuilder.Build();
                System.Console.WriteLine("Finishined building...");

                var boxClient = box.AdminClient();
                var users = await boxClient.UsersManager.GetEnterpriseUsersAsync();
                var showNext = "";
                var start = 0;
                int offset = 0;
                var all = users.TotalCount;
                var currentCallCount = users.Entries.Count;
                if (managedOnly)
                {
                    users.Entries.RemoveAll(user =>
                    {
                        return user.Login.Contains("AppUser");
                    });
                    all -= (currentCallCount - users.Entries.Count);
                }
                System.Console.WriteLine(users.Offset);
                System.Console.WriteLine(users.TotalCount);
                System.Console.WriteLine(users.Limit);
                System.Console.WriteLine(users.Entries.Count);
                while (showNext != "q" && all > 0)
                {
                    if (users.Entries.Count > 0)
                    {

                        try
                        {
                            PrintUserInfo(users.Entries[0]);
                            users.Entries.RemoveAt(0);
                            all--;
                        }
                        catch (Exception e)
                        {
                            System.Console.WriteLine(e.Message);
                            break;
                        }
                    }
                    if (users.Entries.Count == 0 && all > 0)
                    {
                        offset += users.Limit;
                        System.Console.WriteLine("Scanning for more users...");
                        System.Console.WriteLine($"Offset: {(uint)offset}");
                        users = await boxClient.UsersManager.GetEnterpriseUsersAsync(offset: (uint)offset);
                        currentCallCount = users.Entries.Count;
                        if (managedOnly)
                        {
                            users.Entries.RemoveAll(user =>
                            {
                                return user.Login.Contains("AppUser");
                            });
                            all -= (currentCallCount - users.Entries.Count);
                            if (users.Entries.Count == 0)
                            {
                                continue;
                            }
                            else
                            {
                                PrintUserInfo(users.Entries[0]);
                                users.Entries.RemoveAt(0);
                                all--;
                            }
                        }
                        System.Console.WriteLine($"Offset: {users.Offset}");
                        System.Console.WriteLine($"Total Count: {users.TotalCount}");
                        System.Console.WriteLine($"Limit: {users.Limit}");
                        System.Console.WriteLine($"Entries Count: {users.Entries.Count}");
                    }
                    if (all != 0)
                    {
                        System.Console.WriteLine($"Total: {all}");
                        System.Console.WriteLine($"Index: {start}");
                        System.Console.WriteLine("Show next? Type q to quit.");
                        showNext = System.Console.ReadLine();
                        showNext.ToLower();
                    }
                }
                System.Console.WriteLine("Finished...");
                System.Console.WriteLine(all);
            }
            catch (Exception e)
            {
                System.Console.WriteLine("User command error...");
                System.Console.WriteLine(e.Message);
            }
        }

        public async Task RunGet(string id)
        {
            if (id == null)
            {
                _app.ShowHelp();
                return;
            }
            System.Console.WriteLine("Running user command...");
            System.Console.WriteLine("Building BoxClient");
            try
            {

                var box = _boxPlatformBuilder.Build();
                System.Console.WriteLine("Finishined building...");

                var boxClient = box.AdminClient();
                var user = await boxClient.UsersManager.GetUserInformationAsync(id);
                PrintUserInfo(user);
            }
            catch (Exception e)
            {
                System.Console.WriteLine("User command error...");
                System.Console.WriteLine(e.Message);
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