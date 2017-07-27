using System;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.GroupSubCommands.GroupMembershipSubCommands
{
    public class GroupMembershipSubCommandFactory : AbstractBoxSubCommandFactory
    {
        public GroupMembershipSubCommandFactory(IBoxPlatformServiceBuilder builder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(builder, boxHome, names)
        {
        }

        public override ISubCommand CreateSubCommand(string commandName)
        {
            if (commandName == base._names.SubCommandNames.Get)
            {
                return new GroupMemberGetCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (commandName == base._names.SubCommandNames.Add)
            {
                return new GroupMembershipCreateCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (commandName == base._names.SubCommandNames.Remove)
            {
                return new GroupMembershipDeleteCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (commandName == base._names.SubCommandNames.Update)
            {
                return new GroupMembershipUpdateCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (commandName == base._names.SubCommandNames.List)
            {
                return new GroupMembershipListCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (commandName == base._names.SubCommandNames.Create)
            {
                return new GroupMembershipCreateCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else
            {
                throw new Exception("Command not registered.");
            }
        }
    }
}