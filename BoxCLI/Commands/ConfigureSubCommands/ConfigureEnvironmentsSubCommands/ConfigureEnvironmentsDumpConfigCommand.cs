using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;
using System.IO;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureEnvironmentsSubCommands
{
    public class ConfigureEnvironmentsDumpConfigCommand : ConfigureEnvironmentsSubCommandBase
    {
        public ConfigureEnvironmentsDumpConfigCommand(IBoxHome boxHome) : base(boxHome)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            command.Description = "Dump the current environment config information as one string; meant for copying value into environment variable or property setting.";
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
            var configInfo = File.ReadAllText(path);



            Reporter.WriteInformation($"Dumping config file '{configInfo}'");
        }

    }
}
