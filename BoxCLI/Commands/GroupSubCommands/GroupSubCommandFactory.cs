using System;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.GroupSubCommands
{
    public class GroupSubCommandFactory : AbstractBoxSubCommandFactory
    {
        public GroupSubCommandFactory(IBoxPlatformServiceBuilder builder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(builder, boxHome, names)
        {
        }

        public override ISubCommand CreateSubCommand(string commandName)
        {
            if (commandName == base._names.SubCommandNames.Get)
            {
                return new GroupGetCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (commandName == base._names.SubCommandNames.Create)
            {
                return new GroupCreateCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (commandName == base._names.SubCommandNames.Update)
            {
                return new GroupUpdateCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (commandName == base._names.SubCommandNames.Delete)
            {
                return new GroupDeleteCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (commandName == base._names.SubCommandNames.List)
            {
                return new GroupListCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else
            {
                throw new Exception("Command not registered.");
            }
        }
    }
}