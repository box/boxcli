using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureEnvironmentsSubCommands
{
    public class ConfigureEnvironmentsUpdatePrivateKeyPathCommand : ConfigureEnvironmentsSubCommandBase
    {
        private CommandArgument _existingName;
        private CommandArgument _newPath;
        private CommandOption _disableFilePathTranslation;
        private CommandLineApplication _app;
        public ConfigureEnvironmentsUpdatePrivateKeyPathCommand(IBoxHome boxHome) : base(boxHome)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Update the path to your private key file.";
            _existingName = command.Argument("existingEnvironmentName",
                               "The name of the existing environment to update.");
            _newPath = command.Argument("newPath",
                               "The new path to your private key file.");
            _disableFilePathTranslation = command.Option("--disable-file-path-translation",
                           "Disable file path translation.",
                           CommandOptionType.NoValue);
            command.OnExecute(() =>
            {
                return this.Execute();
            });
            base.Configure(command);
        }

        protected override int Execute()
        {
            this.RunUpdate();
            return base.Execute();
        }

        private void RunUpdate()
        {
            base.CheckForValue(this._existingName.Value, this._app, "An existing environment name is required for this command.");
            base.CheckForValue(this._newPath.Value, this._app, "A new private key path is required for this command.");
            var result = base._environments.UpdateEnvironmentFilePath(this._existingName.Value,
                this._newPath.Value, ignoreFilePathTranslation: this._disableFilePathTranslation.HasValue());
            if (result)
            {
                Reporter.WriteSuccess("Successfully updated the private key path.");
            }
            else
            {
                Reporter.WriteError("Couldn't update the private key path.");
            }
        }

    }
}