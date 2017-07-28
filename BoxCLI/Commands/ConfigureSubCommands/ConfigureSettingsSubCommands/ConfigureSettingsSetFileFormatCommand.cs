using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureSettingsSubCommands
{
    public class ConfigureSettingsSetFileFormatCommand : ConfigureSubCommandBase
    {
        private CommandOption _json;
        private CommandOption _csv;
        private CommandLineApplication _app;
        public ConfigureSettingsSetFileFormatCommand(IBoxHome boxHome) : base(boxHome)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Set the file format for generated reports. Defaults to JSON.";
            _json = command.Option("-j|--json",
                                        "Set JSON",
                                        CommandOptionType.NoValue);
            _csv = command.Option("-c|--csv",
                                        "Set CSV",
                                        CommandOptionType.NoValue);
            command.OnExecute(() =>
            {
                return this.Execute();
            });
            base.Configure(command);
        }

        protected override int Execute()
        {
            this.RunSettingsSetFormat();
            return base.Execute();
        }

        private void RunSettingsSetFormat()
        {
            var result = false;
            if (this._json.HasValue())
            {
                result = base._settings.SetBoxReportsFileFormat("json");
            }
            else if (this._csv.HasValue())
            {
                result = base._settings.SetBoxReportsFileFormat("csv");
            }
            else
            {
                result = base._settings.SetBoxReportsFileFormat("json");
            }

            if (result)
            {
                Reporter.WriteSuccess($"Updated file format.");
            }
            else
            {
                Reporter.WriteError("Couldn't update the file format.");
            }
        }
    }
}