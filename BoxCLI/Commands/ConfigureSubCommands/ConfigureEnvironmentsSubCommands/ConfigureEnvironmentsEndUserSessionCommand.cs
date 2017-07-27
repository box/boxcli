using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureEnvironmentsSubCommands
{
    public class ConfigureEnvironmentsEndUserSessionCommand : ConfigureEnvironmentsSubCommandBase
    {
        private CommandLineApplication _app;
        public ConfigureEnvironmentsEndUserSessionCommand(IBoxHome boxHome) : base(boxHome)
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

        protected override int Execute()
        {
            this.RunEndSession();
            return base.Execute();
        }

        private void RunEndSession()
        {
            base._environments.ExpireUserSession();
            Reporter.WriteSuccess("All sessions ended.");
        }
    }
}