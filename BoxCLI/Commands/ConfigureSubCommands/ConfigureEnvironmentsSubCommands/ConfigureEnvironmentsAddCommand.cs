using System;
using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureEnvironmentsSubCommands
{
    public class ConfigureEnvironmentsAddCommand : ConfigureEnvironmentsSubCommandBase
    {
        private CommandArgument _path;
        private CommandOption _environmentName;
        private CommandOption _pemPath;
        private CommandOption _setAsCurrent;
        private CommandLineApplication _app;
        public ConfigureEnvironmentsAddCommand(IBoxHome boxHome) : base(boxHome)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Add a new Box environment.";
            _path = command.Argument("path",
                           "Provide a file path to configuration file");
            _environmentName = command.Option("-n|--name <NAME>",
                           "Give this configuration a name for retrieval later",
                           CommandOptionType.SingleValue);
            _pemPath = command.Option("--private-key-path <PATH>",
                           "Provide a path to your application private key.",
                           CommandOptionType.SingleValue);
            _setAsCurrent = command.Option("--set-as-current",
                           "Set this new environment as your current environment.",
                           CommandOptionType.NoValue);
            command.OnExecute(() =>
            {
                return this.Execute();
            });
            base.Configure(command);
        }

        protected override int Execute()
        {
            this.RunAdd();
            return base.Execute();
        }

        private void SetConfigFile(string filePath, string environmentName)
        {
            if (base._environments.VerifyBoxConfigFile(filePath))
            {
                var env = base._environments.TranslateConfigFileToEnvironment(filePath, this._pemPath.Value());
                env.Name = environmentName;
                var set = base._environments.AddNewEnvironment(env);
                if (set == true)
                {
                    Reporter.WriteSuccess("Successfully configured new Box environment.");
                }
                else
                {
                    throw new Exception("Couldn't add this environment.");
                }
            }
            else
            {
                Reporter.WriteWarning("Not a true config file.");
                throw new Exception("Couldn't add this environment.");
            }
        }

        private void RunAdd()
        {
            base.CheckForValue(this._path.Value, this._app, "A file path is required for this command");
            var environmentName = this._environmentName.Value();
            if (string.IsNullOrEmpty(this._environmentName.Value()))
            {
                environmentName = "default";
            }
            Reporter.WriteInformation($"Adding new environment");
            this.SetConfigFile(this._path.Value, environmentName);
            if (this._setAsCurrent.HasValue())
            {
                base._environments.SetDefaultEnvironment(environmentName);
                base._boxHome.BustCache();
            }
        }
    }
}