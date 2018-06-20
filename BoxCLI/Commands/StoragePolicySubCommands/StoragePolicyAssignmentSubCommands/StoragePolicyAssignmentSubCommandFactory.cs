using System;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.StoragePolicySubCommands.StoragePolicyAssignmentSubCommands
{
    public class StoragePolicyAssignmentSubCommandFactory : AbstractBoxSubCommandFactory
    {
        public StoragePolicyAssignmentSubCommandFactory(IBoxPlatformServiceBuilder builder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(builder, boxHome, names)
        {
        }

        public override ISubCommand CreateSubCommand(string commandName)
        {
            if (commandName == base._names.SubCommandNames.Get)
            {
                return new StoragePolicyAssignmentGetCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (commandName == base._names.SubCommandNames.Add)
            {
                return new StoragePolicyAssignmentCreateCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (commandName == base._names.SubCommandNames.Remove)
            {
                return new StoragePolicyAssignmentDeleteCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (commandName == base._names.SubCommandNames.Update)
            {
                return new StoragePolicyAssignmentUpdateCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (commandName == base._names.SubCommandNames.Lookup)
            {
                return new StoragePolicyAssignmentLookupCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else
            {
                throw new Exception("Command not registered.");
            }
        }
    }
}