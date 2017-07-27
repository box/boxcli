using System;
using BoxCLI.BoxHome;
using BoxCLI.BoxHome.BoxHomeFiles;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureEnvironmentsSubCommands
{
    public class ConfigureEnvironmentsSubCommandFactory : ISubCommandFactory
    {
        private readonly IBoxHome _boxHome;
        private readonly BoxEnvironments _environments;
        private readonly BoxDefaultSettings _settings;
        private readonly LocalizedStringsResource _names;
        public ConfigureEnvironmentsSubCommandFactory(IBoxHome boxHome, LocalizedStringsResource names)
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
                return new ConfigureEnvironmentsListCommand(_boxHome);
            }
            else if (commandName == _names.SubCommandNames.Add)
            {
                return new ConfigureEnvironmentsAddCommand(_boxHome);
            }
            else if (commandName == _names.SubCommandNames.GetCurrent)
            {
                return new ConfigureEnvironmentsGetCurrentCommand(_boxHome);
            }
            else if (commandName == _names.SubCommandNames.SetCurrent)
            {
                return new ConfigureEnvironmentsSetCurrentCommand(_boxHome);
            }
            else if (commandName == _names.SubCommandNames.SetAdminUser)
            {
                return new ConfigureEnvironmentsSetAdminUserCommand(_boxHome);
            }
            else if (commandName == _names.SubCommandNames.GetAdminUser)
            {
                return new ConfigureEnvironmentsGetAdminUserCommand(_boxHome);
            }
            else if (commandName == _names.SubCommandNames.GetDefaultUser)
            {
                return new ConfigureEnvironmentsGetDefaultUserCommand(_boxHome);
            }
            else if (commandName == _names.SubCommandNames.SetDefaultUser)
            {
                return new ConfigureEnvironmentsSetDefaultUserCommand(_boxHome);
            }
            else if (commandName == _names.SubCommandNames.Rename)
            {
                return new ConfigureEnvironmentsRenameCommand(_boxHome);
            }
            else if (commandName == _names.SubCommandNames.StartUserSession)
            {
                return new ConfigureEnvironmentsStartUserSessionCommand(_boxHome);
            }
            else if (commandName == _names.SubCommandNames.EndUserSession)
            {
                return new ConfigureEnvironmentsEndUserSessionCommand(_boxHome);
            }
            else if (commandName == _names.SubCommandNames.GetSessionExpiration)
            {
                return new ConfigureEnvironmentsGetSessionExpirationCommand(_boxHome);
            }
            else
            {
                throw new Exception("Command not registered.");
            }
        }
    }
}