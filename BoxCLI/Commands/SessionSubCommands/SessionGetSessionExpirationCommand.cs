using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.SessionSubCommands
{
    public class SessionGetSessionExpirationCommand : SessionSubCommandBase
    {
        private CommandLineApplication _app;

        public SessionGetSessionExpirationCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names) 
            : base(boxPlatformBuilder, boxHome, names)
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

        protected async override Task<int> Execute()
        {
            this.RunGetExpiration();
            return await base.Execute();
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