using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands
{
    public class EventCommand : BoxBaseCommand
    {
        private CommandLineApplication _app;
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Work with events.";
            command.ExtendedHelpText = "Monitor events in your Enterprise.";

            command.Command(base._names.SubCommandNames.Poll, _subCommands.CreateSubCommand(_names.SubCommandNames.Poll).Configure);

            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            _app.ShowHelp();
            return await base.Execute();
        }
        private readonly ISubCommandFactory _subCommands;

        public EventCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, SubCommandFactory factory, LocalizedStringsResource names) 
            : base(boxPlatformBuilder, boxHome, names)
        {
            _subCommands = factory.CreateFactory(base._names.CommandNames.Events);
        }
    }
}