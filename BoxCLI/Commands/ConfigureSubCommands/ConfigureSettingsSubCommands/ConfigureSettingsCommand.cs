using BoxCLI.BoxHome;
using BoxCLI.BoxHome.BoxHomeFiles;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureSettingsSubCommands
{
    public class ConfigureSettingsCommand : ConfigureSubCommandBase
    {
        private CommandLineApplication _app;
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Work with your Box CLI settings.";
            command.OnExecute(() =>
            {
                return this.Execute();
            });
            command.Command(_names.SubCommandNames.List, _subCommands.CreateSubCommand(_names.SubCommandNames.List).Configure);
            base.Configure(command);
        }
        protected override int Execute()
        {
            _app.ShowHelp();
            return base.Execute();
        }
        private readonly ISubCommandFactory _subCommands;
        private readonly LocalizedStringsResource _names;
        public ConfigureSettingsCommand(IBoxHome boxHome, SubCommandFactory factory, LocalizedStringsResource names)
            : base (boxHome)
        {
            _names = names;
            _subCommands = factory.CreateFactory(_names.CommandNames.Settings);

        }
    }
}