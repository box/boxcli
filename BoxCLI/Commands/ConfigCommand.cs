using System.IO;
using System.Threading.Tasks;
using BoxCLI.BoxPlatform.Service;
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
                this.Run(filePathOption.Value());
                return 0;
            });


            command.Command("set", config =>
            {
                config.Description = "Set your Box credentials";
                var filePathOptionSet = config.Option("-f|--file <file>",
                               "Provide path to configuration file",
                               CommandOptionType.SingleValue);
                config.HelpOption("--help|-h|-?");
                config.OnExecute(() =>
                {
                    this.Run(filePathOptionSet.Value());
                    return 0;
                });
            });


        }

        public ConfigCommand()
        {
        }

        public void SetConfigFile(string filePath)
        {
            System.Console.WriteLine("Found a filePath");
            System.Console.WriteLine(ResolvePathToConfigFile(filePath));
            var resolvedFilePath = ResolvePathToConfigFile(filePath);
            if (File.Exists(resolvedFilePath))
            {
                if(ConfigUtilities.ConfigUtilities.VerifyBoxConfigFile(filePath))
                {
                    System.Console.WriteLine("Found config file.");
                }
                else 
                {
                    System.Console.WriteLine("Not a true config file.");
                }
            }
            else
            {
                System.Console.WriteLine("Couldn't locate that specified file.");
            }
        }

        public string ResolvePathToConfigFile(string filePath)
        {
            return CommandUtilities.CommandUtilities.TranslatePath(filePath);
        }

        public void Run(string filePath = "")
        {
            if (!string.IsNullOrWhiteSpace(filePath))
            {
                SetConfigFile(filePath);
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