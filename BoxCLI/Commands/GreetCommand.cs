using System;
using System.Threading.Tasks;
using BoxCLI.BoxPlatform.Service;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands
{
    public class GreetCommand
    {
        public void Configure(CommandLineApplication command)
        {

            command.Description = "An example command from the neat .NET Core Starter";
            command.HelpOption("--help|-h|-?");

            var nameArgument = command.Argument("name",
                                   "Name I should say hello to");

            command.OnExecute(async () =>
                {
                    await this.Run(nameArgument.Value);
                    return 0;
                });

        }

        private readonly IBoxPlatformService _boxPlatform;

        public GreetCommand(IBoxPlatformService boxPlatform)
        {
            _boxPlatform = boxPlatform;
        }

        public async Task Run(string _name)
        {
            var boxClient = _boxPlatform.AdminClient();
            var user = await boxClient.UsersManager.GetCurrentUserInformationAsync();
            Console.WriteLine("Hello "
                + (_name != null ? _name : "World"));
            System.Console.WriteLine("Hello to your account...");
            System.Console.WriteLine(user.Name);
        }

    }
}