using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;
using System.IO;
using System.Text.RegularExpressions;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureEnvironmentsSubCommands
{
    public class ConfigureEnvironmentsDumpConfigCommand : ConfigureEnvironmentsSubCommandBase
    {
        private CommandOption _escapeQuotes;

        public ConfigureEnvironmentsDumpConfigCommand(IBoxHome boxHome) : base(boxHome)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            command.Description = "Dump the current environment config information as one string; meant for copying value into environment variable or property setting.";

            _escapeQuotes = command.Option("--escape-quotes",
                           "Add escape character for all double quotes.  Typically used when copying value into a JSON config file.",
                           CommandOptionType.NoValue);

            command.OnExecute(() =>
            {
                return this.Execute();
            });
            base.Configure(command);
        }

        protected override int Execute()
        {
            this.RunDumpConfig();
            return base.Execute();
        }

        protected virtual void RunDumpConfig()
        {
            var defaultEnv = _environments.GetDefaultEnvironment();
            var path = defaultEnv.BoxConfigFilePath;
            if (string.IsNullOrEmpty(path))
            {
                Reporter.WriteError("No Box config file path detected.  This command requires a standard Box config file.");
                return;
            }
            var configInfo = File.ReadAllText(path);
            configInfo = Regex.Replace(configInfo, @"\r\n?|\n|  *", string.Empty);

            if (_escapeQuotes.HasValue())
            {
                configInfo = Regex.Replace(configInfo, @"""", @"\""");
            }

            Reporter.WriteInformation(configInfo);
        }

    }
}
