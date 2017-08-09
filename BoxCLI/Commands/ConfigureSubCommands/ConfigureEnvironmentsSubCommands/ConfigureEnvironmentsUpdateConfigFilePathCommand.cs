using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureEnvironmentsSubCommands
{
    public class ConfigureEnvironmentsUpdateConfigFilePathCommand : ConfigureEnvironmentsSubCommandBase
    {
        private CommandArgument _existingName;
        private CommandArgument _newPath;
        private CommandOption _pemPath;
        private CommandLineApplication _app;
        public ConfigureEnvironmentsUpdateConfigFilePathCommand(IBoxHome boxHome) : base(boxHome)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Update the path to your Box configuration file.";
            _existingName = command.Argument("existingEnvironmentName",
                               "The name of the existing environment to update.");
            _newPath = command.Argument("newPath",
                               "The new path to your Box configuration file.");
            _pemPath = command.Option("--private-key-path <PATH>",
                           "Provide a path to your application private key.",
                           CommandOptionType.SingleValue);
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
            base.CheckForValue(this._newPath.Value, this._app, "A new Box configuration file path is required for this command.");
            var result = base._environments.UpdateConfigFilePath(this._existingName.Value, this._newPath.Value, this._pemPath.Value());
            if (result)
            {
                Reporter.WriteSuccess("Successfully updated the Box configuration file path.");
            }
            else 
            {
                Reporter.WriteError("Couldn't update the Box configuration file path.");
            }
        }

    }
}