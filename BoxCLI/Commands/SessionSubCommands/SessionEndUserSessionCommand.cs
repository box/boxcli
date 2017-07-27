using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.SessionSubCommands
{
    public class SessionEndUserSessionCommand : SessionSubCommandBase
    {
        private CommandLineApplication _app;

        public SessionEndUserSessionCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names) 
            : base(boxPlatformBuilder, boxHome, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "End any currently running user session.";
            command.OnExecute(() =>
            {
                return this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            this.RunEndSession();
            return await base.Execute();
        }

        private void RunEndSession()
        {
            base._environments.ExpireUserSession();
            Reporter.WriteSuccess("All sessions ended.");
        }
    }
}