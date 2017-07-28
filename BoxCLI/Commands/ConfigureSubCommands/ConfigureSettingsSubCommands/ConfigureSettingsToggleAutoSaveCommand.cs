using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureSettingsSubCommands
{
    public class ConfigureSettingsToggleAutoSaveCommand : ConfigureSubCommandBase
    {
        private CommandLineApplication _app;
        public ConfigureSettingsToggleAutoSaveCommand(IBoxHome boxHome) : base(boxHome)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Toggle auto save setting.";
            command.OnExecute(() =>
            {
                return this.Execute();
            });
            base.Configure(command);
        }

        protected override int Execute()
        {
            this.RunSettingsToggleAutoSave();
            return base.Execute();
        }

        private void RunSettingsToggleAutoSave()
        {
            var autoSave = base._settings.ToggleAutoSaveSetting();
            if (autoSave)
            {
                Reporter.WriteInformation($"Auto Save now turned on.");
            }
            else
            {
                Reporter.WriteInformation($"Auto Save now turned off.");
            }
        }
    }
}