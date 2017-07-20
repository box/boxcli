using System;
using System.Linq;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.CsvModels;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.UserSubCommands
{
    public class UserCreateCommand : UserSubCommandBase
    {
        private CommandOption _path;
        private CommandLineApplication _app;
        public UserCreateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names) : base(boxPlatformBuilder, home, names)
        {
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Create a new Box User";
            _path = FilePathOption.ConfigureOption(command);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await RunCreate(_path.Value());
            return await base.Execute();
        }

        private async Task RunCreate(string path = "")
        {
            System.Console.WriteLine("Starting to create users...");
            var BoxServiceAccountClient = base.ConfigureBoxClient(returnAdmin: true);
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
                Reporter.WriteError(e.Message);
            }
        }
    }
}