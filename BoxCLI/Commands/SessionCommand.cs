using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands
{
    public class SessionCommand : BoxBaseCommand
    {

        private CommandLineApplication _app;
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Start a session with a user ID.";
            command.ExtendedHelpText = "You can use this command set the CLI to make calls as a Box user for a set amount of time.";

            command.Command(base._names.SubCommandNames.BustCache, _subCommands.CreateSubCommand(_names.SubCommandNames.BustCache).Configure);
            command.Command(base._names.SubCommandNames.StartUserSession, _subCommands.CreateSubCommand(_names.SubCommandNames.StartUserSession).Configure);
            command.Command(base._names.SubCommandNames.EndUserSession, _subCommands.CreateSubCommand(_names.SubCommandNames.EndUserSession).Configure);
            command.Command(base._names.SubCommandNames.GetSessionExpiration, _subCommands.CreateSubCommand(_names.SubCommandNames.GetSessionExpiration).Configure);

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
        public SessionCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, SubCommandFactory factory, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
            _subCommands = factory.CreateFactory(base._names.CommandNames.Session);
        }

    }
}