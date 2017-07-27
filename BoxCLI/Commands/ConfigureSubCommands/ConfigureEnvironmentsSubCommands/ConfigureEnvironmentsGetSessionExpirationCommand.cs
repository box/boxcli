using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureEnvironmentsSubCommands
{
    public class ConfigureEnvironmentsGetSessionExpirationCommand : ConfigureEnvironmentsSubCommandBase
    {
        private CommandLineApplication _app;
        public ConfigureEnvironmentsGetSessionExpirationCommand(IBoxHome boxHome) : base(boxHome)
        {
        } 

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get the expiration time for the currently running user session.";
            command.OnExecute(() =>
            {
                return this.Execute();
            });
            base.Configure(command);
        }

        protected override int Execute()
        {
            this.RunGetExpiration();
            return base.Execute();
        }

        private void RunGetExpiration()
        {
            var expiresAt = base._environments.GetUserSessionExpirationSetting();
            if (expiresAt.HasValue)
            {
                Reporter.WriteInformation($"This session will expire at {expiresAt}");
            }
            else
            {
                Reporter.WriteInformation("No sessions are currently running.");
            }
        }
    }
}