using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureSettingsSubCommands
{
    public class ConfigureSettingsGetAutoSaveCommand : ConfigureSubCommandBase
    {
        private CommandLineApplication _app;
        public ConfigureSettingsGetAutoSaveCommand(IBoxHome boxHome) : base(boxHome)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get auto save setting.";
            command.OnExecute(() =>
            {
                return this.Execute();
            });
            base.Configure(command);
        }

        protected override int Execute()
        {
            this.RunSettingsGetAutoSave();
            return base.Execute();
        }

        private void RunSettingsGetAutoSave()
        {
            var autoSave = base._settings.GetAutoSaveSetting();
            if (autoSave)
            {
                Reporter.WriteInformation($"Auto Save currently turned on.");
            }
            else
            {
                Reporter.WriteInformation($"Auto Save currently turned off.");
            }
        }
    }
}