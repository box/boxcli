using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Box.V2;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.BoxPlatform.Utilities;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CsvModels;
using Microsoft.Extensions.CommandLineUtils;
using Microsoft.Extensions.Logging;
using System.Linq;

namespace BoxCLI.Commands
{
    public class UserCommand : BaseCommand
    {
        const string USERS_COMMAND = "users";
        const string LIST_SUB_COMMAND = "list";

        public void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Manage your Box users -- get information about a user, create new users, delete users.";
            command.HelpOption("--help|-h|-?");
            command.ExtendedHelpText = "You can use this command to create, update, delete, and get information about a Box user in your Enterprise.";

            command.OnExecute(() =>
                {
                    command.ShowHelp();
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
                    if (string.IsNullOrEmpty(userIdArgument.Value))
                    {
                        users.ShowHelp();
                        return 0;
                    }
                    else
                    {
                        await this.RunGet(userIdArgument.Value);
                        return 0;
                    }
                });
            });

            command.Command(LIST_SUB_COMMAND, users =>
            {
                users.Description = "List Box users.";
                users.HelpOption("--help|-h|-?");
                var managedOnly = users.Option("-m|--managed-users <managed-users>",
                               "List only managed users",
                               CommandOptionType.NoValue);
                var save = users.Option("-s|--save <save>",
                               "Save report to disk",
                               CommandOptionType.NoValue);
                var path = users.Option("--file-path <file-path>",
                               "File path to save report",
                               CommandOptionType.SingleValue);
                var fileFormat = users.Option("--file-format <file-format>",
                               "File format for report, JSON or CSV",
                               CommandOptionType.SingleValue);
                var rawFields = users.Option("--fields <fields>",
                               "The fields to include in the Box response, separate each field with a comma",
                               CommandOptionType.SingleValue);
                users.OnExecute(async () =>
                {
                    await this.RunList(managedOnly.HasValue(), save.HasValue(),
                        path.Value(), fileFormat.Value(), rawFields.Value());
                    return 0;
                });
            });

            command.Command("search", users =>
            {
                users.Description = "Search for Box users.";
                users.HelpOption("--help|-h|-?");
                var userName = users.Argument("userName",
                                   "Name of user to search for");
                var managedOnly = users.Option("-m|--managed-users <managed-users>",
                               "Limit search to only managed users",
                               CommandOptionType.NoValue);
                users.OnExecute(async () =>
                {
                    await this.RunSearch(users, userName.Value, managedOnly.HasValue());
                    return 0;
                });
            });

            command.Command("create", users =>
            {
                users.Description = "Create a new Box User";
                users.HelpOption("--help|-h|-?");
                var path = users.Option("--file-path <file-path>",
                               "File path to save report",
                               CommandOptionType.SingleValue);
                users.OnExecute(async () =>
                {
                    await RunCreate(path.Value());
                    return 0;
                });
            });

        }

        private readonly IBoxPlatformServiceBuilder _boxPlatformBuilder;
        private readonly ILogger _logger;
        private CommandLineApplication _app;
        private List<string> _fields;

        public UserCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, ILogger<UserCommand> logger)
            : base(boxPlatformBuilder, boxHome)
        {
            _boxPlatformBuilder = boxPlatformBuilder;
            _logger = logger;
            _fields = new List<string>()
            {
                "name",
                "login",
                "enterprise",
                "status",
                "role",
                "address",
                "phone",
                "job_title",
                "language",
                "avatar_url",
                "created_at",
                "modified_at",
                "max_upload_size",
                "space_amount",
                "space_used",
                "tracking_codes",
                "is_platform_access_only",
                "is_sync_enabled",
                "is_exempt_from_login_verification",
                "is_exempt_from_device_limits",
                "can_see_managed_users"
            };
        }

        public async Task RunSearch(CommandLineApplication app, string userName, bool managedOnly = false)
        {
            var Box = _boxPlatformBuilder.Build();
            var BoxServiceAccountClient = Box.AdminClient();
            var BoxCollectionsIterators = Box.BoxCollectionsIterators;
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

        public async Task RunList(bool managedOnly = false, bool save = false, string path = "", string fileFormat = "", string rawFields = "")
        {
            var Box = _boxPlatformBuilder.Build();
            var BoxServiceAccountClient = Box.AdminClient();
            var BoxCollectionsIterators = Box.BoxCollectionsIterators;
            var fileName = $"{USERS_COMMAND}-{LIST_SUB_COMMAND}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
            var fields = ProcessFields(rawFields);
            try
            {
                if (managedOnly)
                {
                    var users = await BoxServiceAccountClient.UsersManager.GetEnterpriseUsersAsync(fields: fields, autoPaginate: true);
                    users.Entries.RemoveAll(user =>
                    {
                        return user.Login.Contains("AppUser");
                    });
                    if (save == true)
                    {
                        base.WriteCollectionResultsToReport<BoxUser, BoxUserMap>(users, fileName, path, fileFormat.ToLower());
                    }
                    else
                    {
                        var showNext = "";
                        while (users.Entries.Count > 0 && showNext != "q")
                        {
                            showNext = BoxCollectionsIterators.PageInConsole<BoxUser>(PrintUserInfo, users);
                        }
                    }
                    System.Console.WriteLine("Finished...");
                    return;
                }
                if (save == true)
                {
                    System.Console.WriteLine("Saving file...");
                    System.Console.WriteLine(fileFormat);
                    var users = await BoxServiceAccountClient.UsersManager.GetEnterpriseUsersAsync(fields: fields, autoPaginate: true);
                    System.Console.WriteLine(users.TotalCount);
                    var saved = base.WriteCollectionResultsToReport<BoxUser, BoxUserMap>(users, fileName, path, fileFormat);
                    System.Console.WriteLine($"File saved: {saved}");
                }
                else
                {
                    await BoxCollectionsIterators.ListOffsetCollectionToConsole<BoxUser>((offset) =>
                    {
                        return BoxServiceAccountClient.UsersManager.GetEnterpriseUsersAsync(offset: offset);
                    }, PrintUserInfo);
                }
                System.Console.WriteLine("Finished...");
            }
            catch (Exception e)
            {
                _logger.LogDebug(e.Message);
            }
        }

        public async Task RunGet(string id)
        {
            var Box = _boxPlatformBuilder.Build();
            var BoxServiceAccountClient = Box.AdminClient();
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

        public async Task RunCreate(string path = "")
        {
            System.Console.WriteLine("Starting to create users...");
            var Box = _boxPlatformBuilder.Build();
            var BoxServiceAccountClient = Box.AdminClient();
            if (!string.IsNullOrEmpty(path))
            {
                path = GeneralUtilities.TranslatePath(path);
            }
            System.Console.WriteLine($"Path: {path}");
            try
            {
                System.Console.WriteLine("Reading file...");
                var userRequests = base.ReadFile<BoxUserRequest, BoxUserRequestMap>(path);
                System.Console.WriteLine($"User Requests: {userRequests}");
                System.Console.WriteLine($"User Requests: {userRequests.Count}");
                System.Console.WriteLine($"User Requests: {userRequests.FirstOrDefault().Name}");
                foreach (var userRequest in userRequests)
                {
                    System.Console.WriteLine($"Processing a user request: {userRequest.Name}");
                    System.Console.WriteLine($"Processing a user request: {userRequest.Type}");
                    var createdUser = await BoxServiceAccountClient.UsersManager.CreateEnterpriseUserAsync(userRequest);
                    PrintUserInfo(createdUser);
                }
                System.Console.WriteLine("Created all users...");
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e.Message);
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

        private List<string> ProcessFields(string rawFields)
        {
            var fields = new List<string>();
            if (string.IsNullOrEmpty(rawFields))
            {
                fields = _fields;
            }
            else
            {
                fields = new List<string>(rawFields.Split(','));
            }
            return fields;
        }

    }
}