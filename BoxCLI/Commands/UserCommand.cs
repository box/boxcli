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
            command.Description = "Manage your Box user -- get information about a user, create new users, delete users.";
            command.HelpOption("--help|-h|-?");
            command.ExtendedHelpText = "You can use this command to create, update, delete, and get information about a Box user in your Enterprise.";

            var idArgument = command.Argument("userId",
                                   "Id of user to manage, use 'me' for the current user");

            command.OnExecute(async () =>
                {
                    await this.Run(idArgument.Value);
                    return 0;
                });

        }

        private readonly IBoxPlatformServiceBuilder _boxPlatformBuilder;
        private CommandLineApplication _app;

        public UserCommand(IBoxPlatformServiceBuilder boxPlatformBuilder)
        {
            _boxPlatformBuilder = boxPlatformBuilder;
        }

        public async Task Run(string id)
        {
            if (id == null)
            {
                _app.ShowHelp();
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