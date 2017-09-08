using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureSettingsSubCommands
{
    public class ConfigureSettingsToggleOutputJsonCommand : ConfigureSubCommandBase
    {
        private CommandLineApplication _app;
        public ConfigureSettingsToggleOutputJsonCommand(IBoxHome boxHome) : base(boxHome)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Toggle output JSON setting.";
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
            var outputJson = base._settings.ToggleOutputJsonSetting();
            if (outputJson)
            {
                var setting = base._settings.GetOutputJsonSetting();
                if (setting)
                {
                    Reporter.WriteInformation($"Output JSON now turned on.");
                }
                else
                {
                    Reporter.WriteInformation($"Output JSON now turned off.");
                }
            }
            else
            {
                Reporter.WriteError($"Couldn't update the output JSON setting.");
            }
        }
    }
}