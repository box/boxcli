using System;
using System.IO;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxHome.BoxHomeFiles;
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
                               "Required -- Provide a file path to configuration file",
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

            command.Command("settings", config =>
            {
                config.Description = "Work with your Box CLI settings.";
                config.HelpOption("--help|-h|-?");
                config.OnExecute(() =>
                {
                    command.ShowHelp();
                    return 0;
                });

                config.Command("list", settings =>
                {
                    settings.Description = "List all current settings";
                    settings.HelpOption("--help|-h|-?");
                    settings.OnExecute(() =>
                    {
                        this.RunSettingsList();
                        return 0;
                    });
                });
            });


        }

        private readonly IBoxHome _boxHome;
        private readonly BoxEnvironments _environments;
        private readonly BoxDefaultSettings _settings;
        public ConfigCommand(IBoxHome boxHome)
        {
            _boxHome = boxHome;
            _environments = boxHome.GetBoxEnvironments();
            _settings = boxHome.GetBoxHomeSettings();
        }

        public void SetConfigFile(string filePath, string environmentName)
        {
            if (_environments.VerifyBoxConfigFile(filePath))
            {
                var env = _environments.TranslateConfigFileToEnvironment(filePath);
                env.Name = environmentName;
                _environments.AddNewEnvironment(env);
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
        }

        public void RunList()
        {
            var environments = _environments.GetAllEnvironments();
            foreach (var environment in environments)
            {
                System.Console.WriteLine("*******************************");
                System.Console.WriteLine($"Name: {environment.Value.Name}");
                System.Console.WriteLine($"Client ID: {environment.Value.ClientId}");
                System.Console.WriteLine($"Enterprise ID: {environment.Value.EnterpriseId}");
                System.Console.WriteLine($"Path to Config File: {environment.Value.BoxConfigFilePath}");
                System.Console.WriteLine("*******************************");
            }
        }

        public void RunGetDefault()
        {
            var defaultEnv = _environments.GetDefaultEnvironment();
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
            _environments.SetDefaultEnvironment(name);
            System.Console.WriteLine("Successfully set new default environment:");
            this.RunGetDefault();
        }

        public void RunSettingsList()
        {
            var settings = _settings.GetAllSettings();
            System.Console.WriteLine("Current settings:");
            System.Console.WriteLine($"Path to store Box Reports: {settings.BoxReportsFolderPath}");
            System.Console.WriteLine($"Box Reports folder name: {settings.BoxReportsFolderName}");
            System.Console.WriteLine($"Default file format for Box Reports: {settings.BoxReportsFileFormat}");
            System.Console.WriteLine($"Is default As User profile active?: {(settings.UseDefaultAsUser ? "Yes" : "No")}");
            System.Console.WriteLine($"Current default As User profile ID: {settings.DefaultAsUserId}");
            System.Console.WriteLine($"Is temporary As User profile active?: {(settings.UseTempAsUser ? "Yes" : "No")}");
            System.Console.WriteLine($"Current temporary As User profile ID: {settings.TempAsUserId}");
        }
    }
}