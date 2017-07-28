using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureSettingsSubCommands
{
    public class ConfigureSettingsSetFolderPathCommand : ConfigureSubCommandBase
    {
        private CommandArgument _path;
        private CommandOption _reports;
        private CommandOption _downloads;
        private CommandLineApplication _app;
        public ConfigureSettingsSetFolderPathCommand(IBoxHome boxHome) : base(boxHome)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get folder names for download and reports folders.";
            _path = command.Argument("folderPath", "New folder path.");
            _reports = command.Option("-r|--reports",
                                                "Set reports folder path",
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
            base.CheckForValue(this._path.Value, this._app, "A folder path is required for this command");
            var result = false;
            if (this._reports.HasValue())
            {
                result = base._settings.SetBoxReportsFolderPath(this._path.Value);
            }
            else if (this._downloads.HasValue())
            {
                result = base._settings.SetBoxDownloadsFolderPath(this._path.Value);
            }
            else
            {
                Reporter.WriteError("Select either reports or downloads for this command.");
            }

            if (result)
            {
                Reporter.WriteSuccess($"Updated folder path.");
            }
            else
            {
                Reporter.WriteError("Couldn't update the folder path.");
            }
        }
    }
}