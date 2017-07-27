using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureEnvironmentsSubCommands
{
    public class ConfigureEnvironmentsSetAdminUserCommand : ConfigureEnvironmentsSubCommandBase
    {
        private CommandArgument _adminUserId;
        private CommandOption _envName;
        private CommandLineApplication _app;
        public ConfigureEnvironmentsSetAdminUserCommand(IBoxHome boxHome) : base(boxHome)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Set the Admin user in a Box environment.";
            _adminUserId = command.Argument("adminUserId",
                               "The user ID for your Box Admin user");
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
            this.RunSetAdmin();
            return base.Execute();
        }

        private void RunSetAdmin()
        {
            base.CheckForValue(this._adminUserId.Value, this._app, "An admin user ID is required for this command.");
            var result = base._environments.SetAdminAsUserIdSetting(this._adminUserId.Value, this._envName.Value());
            if (result)
            {
                Reporter.WriteSuccess("Successfully set the Admin User ID");
            }
            else 
            {
                Reporter.WriteError("Couldn't set the Admin User ID");
            }
        }
    }
}