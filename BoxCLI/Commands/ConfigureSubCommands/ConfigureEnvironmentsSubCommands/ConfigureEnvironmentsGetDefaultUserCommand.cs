using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureEnvironmentsSubCommands
{
    public class ConfigureEnvironmentsGetDefaultUserCommand : ConfigureEnvironmentsSubCommandBase
    {
        private CommandOption _envName;
        private CommandLineApplication _app;
        public ConfigureEnvironmentsGetDefaultUserCommand(IBoxHome boxHome) : base(boxHome)
        {
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get the default user ID used with the session commands. A default user ID can be stored for each Box environment you add.";
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
            this.RunGetAdmin();
            return base.Execute();
        }

        private void RunGetAdmin()
        {
            var userId = base._environments.GetDefaultAsUserIdSetting();
            if (string.IsNullOrEmpty(userId))
            {
                Reporter.WriteInformation("No default user set.");
            }
            else
            {
                Reporter.WriteInformation($"Default User ID: {userId}");
            }
        }
    }
}