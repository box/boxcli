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
            else
            {
                throw new Exception("Command not registered.");
            }
        }
    }
}