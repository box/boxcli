using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands
{
    public abstract class HelpCommandBase : CommandBase
    {
        private CommandLineApplication _command;

        public override void Configure(CommandLineApplication command)
        {
            _command = command;
            command.HelpOption("-h|--help");
            base.Configure(command);
        }
    }
}