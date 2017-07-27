using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureEnvironmentsSubCommands
{
    public class ConfigureEnvironmentsRenameCommand : ConfigureEnvironmentsSubCommandBase
    {
        private CommandArgument _existingName;
        private CommandArgument _newName;
        private CommandLineApplication _app;
        public ConfigureEnvironmentsRenameCommand(IBoxHome boxHome) : base(boxHome)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Set the Admin user in a Box environment.";
            _existingName = command.Argument("existingEnvironmentName",
                               "The existing name of the environment to rename.");
            _newName = command.Argument("newEnvironmentName",
                               "The new name of the environment.");
            command.OnExecute(() =>
            {
                return this.Execute();
            });
            base.Configure(command);
        }

        protected override int Execute()
        {
            this.RunRename();
            return base.Execute();
        }

        private void RunRename()
        {
            base.CheckForValue(this._existingName.Value, this._app, "An existing environment name is required for this command.");
            base.CheckForValue(this._newName.Value, this._app, "A new environment name is required for this command.");
            var result = base._environments.ChangeBoxEnvironmentName(this._existingName.Value, this._newName.Value);
            if (result)
            {
                Reporter.WriteSuccess("Successfully renamed the environment");
            }
            else 
            {
                Reporter.WriteError("Couldn't rename the environment");
            }
        }

    }
}