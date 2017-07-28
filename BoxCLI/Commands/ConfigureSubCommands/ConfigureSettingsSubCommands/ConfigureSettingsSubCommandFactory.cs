using System;
using BoxCLI.BoxHome;
using BoxCLI.BoxHome.BoxHomeFiles;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureSettingsSubCommands
{

    public class ConfigureSettingsSubCommandFactory : ISubCommandFactory
    {
        private readonly IBoxHome _boxHome;
        private readonly BoxEnvironments _environments;
        private readonly BoxDefaultSettings _settings;
        private readonly LocalizedStringsResource _names;

        public ConfigureSettingsSubCommandFactory(IBoxHome boxHome, LocalizedStringsResource names)
        {
            _boxHome = boxHome;
            _environments = boxHome.GetBoxEnvironments();
            _settings = boxHome.GetBoxHomeSettings();
            _names = names;
        }
        public ISubCommand CreateSubCommand(string commandName)
        {
            if (commandName == _names.SubCommandNames.List)
            {
                return new ConfigureSettingsListCommand(_boxHome);
            }
            else if (commandName == _names.SubCommandNames.GetFileFormat)
            {
                return new ConfigureSettingsGetFileFormatCommand(_boxHome);
            }
            else if (commandName == _names.SubCommandNames.GetFolderName)
            {
                return new ConfigureSettingsGetFolderNameCommand(_boxHome);
            }
            else if (commandName == _names.SubCommandNames.GetFolderPath)
            {
                return new ConfigureSettingsGetFolderPathCommand(_boxHome);
            }
            else if (commandName == _names.SubCommandNames.SetFileFormat)
            {
                return new ConfigureSettingsSetFileFormatCommand(_boxHome);
            }
            else if (commandName == _names.SubCommandNames.SetFolderName)
            {
                return new ConfigureSettingsSetFolderNameCommand(_boxHome);
            }
            else if (commandName == _names.SubCommandNames.SetFolderPath)
            {
                return new ConfigureSettingsSetFolderPathCommand(_boxHome);
            }
            else if (commandName == _names.SubCommandNames.GetOutputJson)
            {
                return new ConfigureSettingsGetOutputJsonCommand(_boxHome);
            }
            else if (commandName == _names.SubCommandNames.GetAutoSave)
            {
                return new ConfigureSettingsGetAutoSaveCommand(_boxHome);
            }
            else if (commandName == _names.SubCommandNames.ToggleAutoSave)
            {
                return new ConfigureSettingsToggleAutoSaveCommand(_boxHome);
            }
            else if (commandName == _names.SubCommandNames.ToggleOutputJson)
            {
                return new ConfigureSettingsToggleOutputJsonCommand(_boxHome);
            }
            else
            {
                throw new Exception("Command not registered.");
            }
        }
    }
}