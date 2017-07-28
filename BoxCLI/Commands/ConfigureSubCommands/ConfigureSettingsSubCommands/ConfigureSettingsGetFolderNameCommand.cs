using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureSettingsSubCommands
{
    public class ConfigureSettingsGetFolderNameCommand : ConfigureSubCommandBase
    {
        private CommandOption _reports;
        private CommandOption _downloads;
        private CommandLineApplication _app;
        public ConfigureSettingsGetFolderNameCommand(IBoxHome boxHome) : base(boxHome)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get folder names for download and reports folders.";
            _reports = command.Option("-r|--reports",
                                                "Retrieve reports folder name",
                                                CommandOptionType.NoValue);
            _downloads = command.Option("-d|--downloads",
                                                "Retrieve downloads folder name",
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
                Reporter.WriteInformation($"Reports Folder Name: {base._settings.GetBoxReportsFolderName()}");
            }
            else if (this._downloads.HasValue())
            {
                Reporter.WriteInformation($"Downloads Folder Name: {base._settings.GetBoxDownloadsFolderName()}");
            }   
            else
            {
                Reporter.WriteError("Select either reports or downloads for this command.");
            }
        }
    }
}