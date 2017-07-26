using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureEnvironmentsSubCommands
{
    public class ConfigureEnvironmentsCommand : ConfigureSubCommandBase
    {
        private CommandLineApplication _app;

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Work with your Box CLI environments.";
            command.OnExecute(() =>
            {
                return this.Execute();
            });
            command.Command(_names.SubCommandNames.List, _subCommands.CreateSubCommand(_names.SubCommandNames.List).Configure);
            command.Command(_names.SubCommandNames.Add, _subCommands.CreateSubCommand(_names.SubCommandNames.Add).Configure);
            command.Command(_names.SubCommandNames.GetCurrent, _subCommands.CreateSubCommand(_names.SubCommandNames.GetCurrent).Configure);
            command.Command(_names.SubCommandNames.SetCurrent, _subCommands.CreateSubCommand(_names.SubCommandNames.SetCurrent).Configure);
            base.Configure(command);
        }
        protected override int Execute()
        {
            _app.ShowHelp();
            return base.Execute();
        }
        private readonly ISubCommandFactory _subCommands;
        private readonly LocalizedStringsResource _names;
        public ConfigureEnvironmentsCommand(IBoxHome boxHome, SubCommandFactory factory, LocalizedStringsResource names)
            : base(boxHome)
        {
            _names = names;
            _subCommands = factory.CreateFactory(_names.CommandNames.Environments);
        }
    }
}