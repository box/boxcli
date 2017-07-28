using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureSettingsSubCommands
{
    public class ConfigureSettingsSetFolderNameCommand : ConfigureSubCommandBase
    {
        private CommandArgument _name;
        private CommandOption _reports;
        private CommandOption _downloads;
        private CommandLineApplication _app;
        public ConfigureSettingsSetFolderNameCommand(IBoxHome boxHome) : base(boxHome)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get folder names for download and reports folders.";
            _name = command.Argument("folderName", "New folder name.");
            _reports = command.Option("-r|--reports",
                                                "Set reports folder name",
                                                CommandOptionType.NoValue);
            _downloads = command.Option("-d|--downloads",
                                                "Set downloads folder name",
                                                CommandOptionType.NoValue);
            command.OnExecute(() =>
            {
                return this.Execute();
            });
            base.Configure(command);
        }

        protected override int Execute()
        {
            this.RunSettingsSetFolder();
            return base.Execute();
        }

        private void RunSettingsSetFolder()
        {
            base.CheckForValue(this._name.Value, this._app, "A folder name is required for this command");
            var result = false;
            if (this._reports.HasValue())
            {
                result = base._settings.SetBoxReportsFolderName(this._name.Value);
            }
            else if (this._downloads.HasValue())
            {
                result = base._settings.SetBoxDownloadsFolderName(this._name.Value);
            }
            else
            {
                Reporter.WriteError("Select either reports or downloads for this command.");
            }

            if (result)
            {
                Reporter.WriteSuccess($"Updated folder name.");
            }
            else
            {
                Reporter.WriteError("Couldn't update the folder name.");
            }
        }
    }
}