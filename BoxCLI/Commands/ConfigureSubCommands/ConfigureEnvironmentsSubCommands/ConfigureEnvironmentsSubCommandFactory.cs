using System;
using BoxCLI.BoxHome;
using BoxCLI.BoxHome.BoxHomeFiles;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureEnvironmentsSubCommands
{
    public class ConfigureEnvironmentsSubCommandFactory : AbstractBoxSubCommandFactory
    {

        public ConfigureEnvironmentsSubCommandFactory(IBoxPlatformServiceBuilder builder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(builder, boxHome, names)
        {
        }

        public override ISubCommand CreateSubCommand(string commandName)
        {
            if (commandName == _names.SubCommandNames.List)
            {
                return new ConfigureEnvironmentsListCommand(_boxHome);
            }
            else if (commandName == _names.SubCommandNames.Add)
            {
                return new ConfigureEnvironmentsAddCommand(_boxHome);
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
            else if (commandName == _names.SubCommandNames.GetCurrent)
            {
                return new ConfigureEnvironmentsGetCurrentCommand(_boxHome);
            }
            else if (commandName == _names.SubCommandNames.SetCurrent)
            {
                return new ConfigureEnvironmentsSetCurrentCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else
            {
                throw new Exception("Command not registered.");
            }
        }
    }
}