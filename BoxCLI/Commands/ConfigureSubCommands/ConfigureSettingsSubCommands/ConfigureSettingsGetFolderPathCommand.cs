using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureSettingsSubCommands
{
    public class ConfigureSettingsGetFolderPathCommand : ConfigureSubCommandBase
    {
        public ConfigureSettingsGetFolderPathCommand(IBoxHome boxHome) : base(boxHome)
        {
        }
        private CommandOption _reports;
        private CommandOption _downloads;
        private CommandLineApplication _app;

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get folder paths for download and reports folders.";
            _reports = command.Option("-r|--reports",
                                                "Retrieve reports folder path",
                                                CommandOptionType.NoValue);
            _downloads = command.Option("-d|--downloads",
                                                "Retrieve downloads folder path",
                                                CommandOptionType.NoValue);
            command.OnExecute(() =>
            {
                return this.Execute();
            });
            base.Configure(command);
        }

        protected override int Execute()
        {
            this.RunSettingsGetFolder();
            return base.Execute();
        }

        private void RunSettingsGetFolder()
        {
            if(this._reports.HasValue())
            {
                Reporter.WriteInformation($"Reports Folder Path: {base._settings.GetBoxReportsFolderPath()}");
            }
            else if (this._downloads.HasValue())
            {
                Reporter.WriteInformation($"Downloads Folder Path: {base._settings.GetBoxDownloadsFolderPath()}");
            }   
            else
            {
                Reporter.WriteError("Select either reports or downloads for this command.");
            }
        }
    }
}