using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureSettingsSubCommands
{
    public class ConfigureSettingsGetFileFormatCommand : ConfigureSubCommandBase
    {
        private CommandLineApplication _app;
        public ConfigureSettingsGetFileFormatCommand(IBoxHome boxHome) : base(boxHome)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get file format for generated reports.";
            command.OnExecute(() =>
            {
                return this.Execute();
            });
            base.Configure(command);
        }

        protected override int Execute()
        {
            this.RunSettingsGetFormat();
            return base.Execute();
        }

        private void RunSettingsGetFormat()
        {
            Reporter.WriteInformation($"Reports file format: {base._settings.GetBoxReportsFileFormatSetting()}");
        }
    }
}