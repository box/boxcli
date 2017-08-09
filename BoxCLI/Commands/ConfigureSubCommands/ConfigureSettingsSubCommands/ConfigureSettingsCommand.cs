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
            // command.Command(_names.SubCommandNames.GetAutoSave, _subCommands.CreateSubCommand(_names.SubCommandNames.GetAutoSave).Configure);
            // command.Command(_names.SubCommandNames.ToggleAutoSave, _subCommands.CreateSubCommand(_names.SubCommandNames.ToggleAutoSave).Configure);
            // command.Command(_names.SubCommandNames.GetOutputJson, _subCommands.CreateSubCommand(_names.SubCommandNames.GetOutputJson).Configure);
            // command.Command(_names.SubCommandNames.ToggleOutputJson, _subCommands.CreateSubCommand(_names.SubCommandNames.ToggleOutputJson).Configure);
            command.Command(_names.SubCommandNames.GetFileFormat, _subCommands.CreateSubCommand(_names.SubCommandNames.GetFileFormat).Configure);
            command.Command(_names.SubCommandNames.SetFileFormat, _subCommands.CreateSubCommand(_names.SubCommandNames.SetFileFormat).Configure);
            command.Command(_names.SubCommandNames.GetFolderName, _subCommands.CreateSubCommand(_names.SubCommandNames.GetFolderName).Configure);
            command.Command(_names.SubCommandNames.SetFolderName, _subCommands.CreateSubCommand(_names.SubCommandNames.SetFolderName).Configure);
            command.Command(_names.SubCommandNames.GetFolderPath, _subCommands.CreateSubCommand(_names.SubCommandNames.GetFolderPath).Configure);
            command.Command(_names.SubCommandNames.SetFolderPath, _subCommands.CreateSubCommand(_names.SubCommandNames.SetFolderPath).Configure);
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