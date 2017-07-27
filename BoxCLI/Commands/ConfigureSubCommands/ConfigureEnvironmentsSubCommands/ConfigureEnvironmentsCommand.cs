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
            command.Command(_names.SubCommandNames.SetAdminUser, _subCommands.CreateSubCommand(_names.SubCommandNames.SetAdminUser).Configure);
            command.Command(_names.SubCommandNames.GetAdminUser, _subCommands.CreateSubCommand(_names.SubCommandNames.GetAdminUser).Configure);
            command.Command(_names.SubCommandNames.GetDefaultUser, _subCommands.CreateSubCommand(_names.SubCommandNames.GetDefaultUser).Configure);
            command.Command(_names.SubCommandNames.SetDefaultUser, _subCommands.CreateSubCommand(_names.SubCommandNames.SetDefaultUser).Configure);
            command.Command(_names.SubCommandNames.Rename, _subCommands.CreateSubCommand(_names.SubCommandNames.Rename).Configure);
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