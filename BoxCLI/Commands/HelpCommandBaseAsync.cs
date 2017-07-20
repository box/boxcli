using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands
{
    public class HelpCommandBaseAsync : CommandBaseAsync
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