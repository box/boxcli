using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureSettingsSubCommands
{
    public class ConfigureSettingsGetOutputJsonCommand : ConfigureSubCommandBase
    {
        private CommandLineApplication _app;
        public ConfigureSettingsGetOutputJsonCommand(IBoxHome boxHome) : base(boxHome)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get output JSON setting.";
            command.OnExecute(() =>
            {
                return this.Execute();
            });
            base.Configure(command);
        }

        protected override int Execute()
        {
            this.RunSettingsGetOutput();
            return base.Execute();
        }

        private void RunSettingsGetOutput()
        {
            var outputJson = base._settings.GetOutputJsonSetting();
            if (outputJson)
            {
                Reporter.WriteInformation($"Output JSON currently turned on.");
            }
            else
            {
                Reporter.WriteInformation($"Output JSON currently turned off.");
            }
        }
    }
}