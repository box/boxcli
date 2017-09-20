using BoxCLI.BoxHome;
using BoxCLI.BoxHome.BoxHomeFiles;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureSettingsSubCommands
{
    public class ConfigureSettingsListCommand : ConfigureSubCommandBase
    {
        public ConfigureSettingsListCommand(IBoxHome boxHome) : base(boxHome)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            command.Description = "List all Box settings.";
            command.OnExecute(() =>
            {
                return this.Execute();
            });
            base.Configure(command);
        }

        protected override int Execute()
        {
            this.RunSettingsList();
            return base.Execute();
        }

        private void RunSettingsList()
        {
            var settings = base._settings.GetAllSettings();
            var outputJson = (settings.OutputJson) ? "on" : "off";
            Reporter.WriteInformation("Current settings:");
            Reporter.WriteInformation($"Path to store Box Reports: {settings.BoxReportsFolderPath}");
            Reporter.WriteInformation($"Box Reports folder name: {settings.BoxReportsFolderName}");
            Reporter.WriteInformation($"Default file format for Box Reports: {settings.BoxReportsFileFormat}");
            Reporter.WriteInformation($"JSON output currently {outputJson}");
        }

    }
}