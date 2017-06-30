using System.IO;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;


namespace BoxCLI.Commands
{
    public class ConfigCommand
    {
        public void Configure(CommandLineApplication command)
        {
            command.Description = "Interact with your Box credentials.";
            command.HelpOption("--help|-h|-?");
            var filePathOption = command.Option("-f|--file <file>",
                               "Provide path to configuration file",
                               CommandOptionType.SingleValue);
            command.OnExecute(() =>
            {
                this.RunSet(filePathOption.Value());
                return 0;
            });


            command.Command("set", config =>
            {
                config.Description = "Set your Box credentials";
                var filePathOptionSet = config.Option("-f|--file <file>",
                               "Provide path to configuration file",
                               CommandOptionType.SingleValue);
                var environmentName = config.Option("-n|--name <name>",
                               "Give this configuration a name for easy retrieval later",
                               CommandOptionType.SingleValue);
                config.HelpOption("--help|-h|-?");
                config.OnExecute(() =>
                {
                    this.RunSet(filePathOptionSet.Value(), environmentName.Value());
                    return 0;
                });
            });


        }

        private readonly IBoxHome BoxHome;
        public ConfigCommand(IBoxHome boxHome)
        {
            BoxHome = boxHome;
        }

        public void SetConfigFile(string filePath, string environmentName)
        {
            System.Console.WriteLine("Found a filePath");
            var environments = BoxHome.GetBoxEnvironments();
            if (environments.VerifyBoxConfigFile(filePath))
            {
                System.Console.WriteLine("Found config file.");
                var env = environments.TranslateConfigFileToEnvironment(filePath);
                env.Name = environmentName;
                System.Console.WriteLine(env.Name);
                environments.AddNewEnvironment(env);
                System.Console.WriteLine(env.Name);
                System.Console.WriteLine("Successfully configured new Box environment.");
            }
            else
            {
                System.Console.WriteLine("Not a true config file.");
            }
        }

        public void RunSet(string filePath = "", string environmentName = "")
        {
            if(string.IsNullOrEmpty(environmentName))
            {
                environmentName = "default";
            }
            System.Console.WriteLine(environmentName);
            if (!string.IsNullOrWhiteSpace(filePath))
            {
                SetConfigFile(filePath, environmentName);
            }
            else
            {
                System.Console.WriteLine("Set is running...");
                // var arg = config.Argument("filePath", "Path to your configuration file.", false);
                System.Console.Write("Box Client ID: ");
                var clientId = System.Console.ReadLine();
            }
        }
    }
}