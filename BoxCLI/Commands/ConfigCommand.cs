using System;
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
            command.Description = "Configure your Box environments.";
            command.HelpOption("--help|-h|-?");
            var filePathOption = command.Option("-f|--file <file>",
                               "Provide path to configuration file",
                               CommandOptionType.SingleValue);
            command.OnExecute(() =>
            {
                this.RunAdd(filePathOption.Value());
                return 0;
            });

            command.Command("list", config =>
            {
                config.Description = "List all Box environments.";
                config.HelpOption("--help|-h|-?");
                config.OnExecute(() =>
                {
                    this.RunList();
                    return 0;
                });
            });

            command.Command("get-default", config =>
            {
                config.Description = "List current default Box environment.";
                config.HelpOption("--help|-h|-?");
                config.OnExecute(() =>
                {
                    this.RunGetDefault();
                    return 0;
                });
            });

            command.Command("add", config =>
            {
                config.Description = "Add a new Box environment.";
                var filePathOptionSet = config.Option("-f|--file <file>",
                               "Provide path to configuration file",
                               CommandOptionType.SingleValue);
                var environmentName = config.Option("-n|--name <name>",
                               "Give this configuration a name for easy retrieval later",
                               CommandOptionType.SingleValue);
                config.HelpOption("--help|-h|-?");
                config.OnExecute(() =>
                {
                    this.RunAdd(filePathOptionSet.Value(), environmentName.Value());
                    return 0;
                });
            });

            command.Command("set-default", config =>
            {
                config.Description = "Set the default Box environment to use.";
                config.HelpOption("--help|-h|-?");
                var nameArgument = config.Argument("name",
                                   "Name of the environment");
                config.OnExecute(() =>
                {
                    this.RunSetDefault(nameArgument.Value);
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
            var environments = BoxHome.GetBoxEnvironments();
            if (environments.VerifyBoxConfigFile(filePath))
            {
                var env = environments.TranslateConfigFileToEnvironment(filePath);
                env.Name = environmentName;
                environments.AddNewEnvironment(env);
                System.Console.WriteLine("Successfully configured new Box environment.");
            }
            else
            {
                System.Console.WriteLine("Not a true config file.");
            }
        }

        public void RunAdd(string filePath = "", string environmentName = "")
        {
            if (string.IsNullOrEmpty(environmentName))
            {
                environmentName = "default";
            }
            if (!string.IsNullOrWhiteSpace(filePath))
            {
                SetConfigFile(filePath, environmentName);
            }
            else
            {
                System.Console.Write("Box Client ID: ");
                var clientId = System.Console.ReadLine();
            }
        }

        public void RunList()
        {
            var environmentFile = BoxHome.GetBoxEnvironments();
            var environments = environmentFile.GetAllEnvironments();
            foreach (var environment in environments)
            {
                System.Console.WriteLine("*******************************");
                System.Console.WriteLine($"Name: {environment.Value.Name}");
                System.Console.WriteLine($"Client ID: {environment.Value.ClientId}");
                System.Console.WriteLine($"Enterprise ID: {environment.Value.EnterpriseId}");
                System.Console.WriteLine("*******************************");
            }
        }

        public void RunGetDefault()
        {
            var environmentFile = BoxHome.GetBoxEnvironments();
            var defaultEnv = environmentFile.GetDefaultEnvironment();
            System.Console.WriteLine("Current default environment:");
            System.Console.WriteLine($"Name: {defaultEnv.Name}");
            System.Console.WriteLine($"Client ID: {defaultEnv.ClientId}");
            System.Console.WriteLine($"Enterprise ID: {defaultEnv.EnterpriseId}");
        }

        public void RunSetDefault(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                System.Console.WriteLine("You must enter a name for the Box environment.");
                return;
            }
            var environmentFile = BoxHome.GetBoxEnvironments();
            environmentFile.SetDefaultEnvironment(name);
            System.Console.WriteLine("Successfully set new default environment:");
            this.RunGetDefault();
        }
    }
}