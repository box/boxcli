using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureEnvironmentsSubCommands
{
    public class ConfigureEnvironmentsGetAdminUserCommand : ConfigureEnvironmentsSubCommandBase
    {
        private CommandOption _envName;
        private CommandLineApplication _app;
        public ConfigureEnvironmentsGetAdminUserCommand(IBoxHome boxHome) : base(boxHome)
        {
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get the Admin user in your a Box environment.";
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
            var adminId = base._environments.GetAdminAsUserIdSetting();
            if (string.IsNullOrEmpty(adminId))
            {
                Reporter.WriteInformation("No Admin user set.");
            }
            else
            {
                Reporter.WriteInformation($"Admin User ID: {adminId}");
            }
        }
    }
}