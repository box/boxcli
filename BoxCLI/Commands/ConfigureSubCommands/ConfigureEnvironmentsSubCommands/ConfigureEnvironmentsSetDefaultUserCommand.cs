using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureEnvironmentsSubCommands
{
    public class ConfigureEnvironmentsSetDefaultUserCommand : ConfigureEnvironmentsSubCommandBase
    {
        private CommandArgument _defaultUserId;
        private CommandOption _envName;
        private CommandLineApplication _app;
        public ConfigureEnvironmentsSetDefaultUserCommand(IBoxHome boxHome) : base(boxHome)
        {
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Set the Admin user in a Box environment.";
            _defaultUserId = command.Argument("defaultUserId",
                               "The user ID for a default user for this environment.");
            _envName = command.Option("--env-name",
                                "Select an environment to update. Defaults to current environment if not set.",
                                CommandOptionType.SingleValue);
            command.OnExecute(() =>
            {
                return this.Execute();
            });
            base.Configure(command);
        }

        protected override int Execute()
        {
            this.RunSetDefault();
            return base.Execute();
        }

        private void RunSetDefault()
        {
            base.CheckForValue(this._defaultUserId.Value, this._app, "A user ID is required for this command.");
            var result = base._environments.SetDefaultAsUserIdSetting(this._defaultUserId.Value, this._envName.Value());
            if (result)
            {
                Reporter.WriteSuccess("Successfully set the Default User ID");
            }
            else 
            {
                Reporter.WriteError("Couldn't set the Default User ID");
            }
        }
    }
}