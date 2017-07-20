using System;
using System.IO;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxHome.BoxHomeFiles;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.Commands.ConfigureSubCommands;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;


namespace BoxCLI.Commands
{
    public class ConfigureCommand : HelpCommandBase
    {
        private CommandLineApplication _app;
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Configure your Box environments.";
            command.OnExecute(() =>
            {
                return this.Execute();
            });

            command.Command(_names.SubCommandNames.List, _subCommands.CreateSubCommand(_names.SubCommandNames.List).Configure);

            command.Command(_names.SubCommandNames.GetDefault, _subCommands.CreateSubCommand(_names.SubCommandNames.GetDefault).Configure);

            command.Command(_names.SubCommandNames.Add, _subCommands.CreateSubCommand(_names.SubCommandNames.Add).Configure);

            command.Command(_names.SubCommandNames.SetDefault, _subCommands.CreateSubCommand(_names.SubCommandNames.SetDefault).Configure);

            command.Command(_names.CommandNames.Settings, new ConfigureSettingsCommand(_boxHome, _factory, _names).Configure);

            base.Configure(command);
        }

        protected override int Execute()
        {
            _app.ShowHelp();
            return base.Execute();
        }

        private readonly IBoxHome _boxHome;
        private readonly BoxEnvironments _environments;
        private readonly BoxDefaultSettings _settings;
        private readonly SubCommandFactory _factory;
        private readonly ISubCommandFactory _subCommands;
        private readonly LocalizedStringsResource _names;
        public ConfigureCommand(IBoxHome boxHome, SubCommandFactory factory, LocalizedStringsResource names)
        {
            _boxHome = boxHome;
            _environments = boxHome.GetBoxEnvironments();
            _settings = boxHome.GetBoxHomeSettings();
            _factory = factory;
            _names = names;
            _subCommands = factory.CreateFactory(_names.CommandNames.Configure);
        }
    }
}