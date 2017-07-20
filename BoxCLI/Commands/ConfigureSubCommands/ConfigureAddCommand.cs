using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands
{
    public class ConfigureAddCommand : ConfigureSubCommandBase
    {
        private CommandArgument _path;
        private CommandOption _environmentName;
        public ConfigureAddCommand(IBoxHome boxHome) : base(boxHome)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            command.Description = "Add a new Box environment.";
            _path = command.Argument("path",
                           "Provide a file path to configuration file");
            _environmentName = command.Option("-n|--name <name>",
                           "Give this configuration a name for easy retrieval later",
                           CommandOptionType.SingleValue);
            command.OnExecute(() =>
            {
                return this.Execute();
            });
            base.Configure(command);
        }

        protected override int Execute()
        {
            this.RunAdd(_path.Value, _environmentName.Value());
            return base.Execute();
        }

        public void SetConfigFile(string filePath, string environmentName)
        {
            if (base._environments.VerifyBoxConfigFile(filePath))
            {
                var env = base._environments.TranslateConfigFileToEnvironment(filePath);
                env.Name = environmentName;
                var set = base._environments.AddNewEnvironment(env);
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

        public void RunAdd(string filePath = "", string environmentName = "")
        {
            if (string.IsNullOrEmpty(environmentName))
            {
                environmentName = "default";
            }
            if (!string.IsNullOrWhiteSpace(filePath))
            {
                this.SetConfigFile(filePath, environmentName);
            }
        }
    }
}