using System;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.StoragePolicySubCommands
{
    public class StoragePolicySubCommandFactory : AbstractBoxSubCommandFactory
    {
        public StoragePolicySubCommandFactory(IBoxPlatformServiceBuilder builder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(builder, boxHome, names)
        {
        }

        public override ISubCommand CreateSubCommand(string commandName)
        {
            if (commandName == base._names.SubCommandNames.Get)
            {
                return new StoragePolicyGetCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (commandName == base._names.SubCommandNames.List)
            {
                return new StoragePolicyListCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (commandName == base._names.SubCommandNames.Assign)
            {
                return new StoragePolicyAssignCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else
            {
                throw new Exception("Command not registered.");
            }
        }
    }
}