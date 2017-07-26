using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureEnvironmentsSubCommands
{
    public class ConfigureEnvironmentsAddCommand : ConfigureEnvironmentsSubCommandBase
    {
        private CommandArgument _path;
        private CommandOption _environmentName;
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
            _environmentName = command.Option("-n|--name <name>",
                           "Give this configuration a name for retrieval later",
                           CommandOptionType.SingleValue);
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
                Reporter.WriteInformation("Verified config file...");
                var env = base._environments.TranslateConfigFileToEnvironment(filePath);
                Reporter.WriteInformation("deserialized config file...");
                env.Name = environmentName;
                Reporter.WriteInformation("adding config file...");
                var set = base._environments.AddNewEnvironment(env);
                Reporter.WriteInformation("config file added...");
                if (set == true)
                {
                    Reporter.WriteSuccess("Successfully configured new Box environment.");
                }
            }
            else
            {
                Reporter.WriteWarning("Not a true config file.");
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
        }
    }
}