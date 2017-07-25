using System;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.SharedItemSubCommands
{
    public class SharedItemSubCommandFactory : AbstractBoxSubCommandFactory
    {
        public SharedItemSubCommandFactory(IBoxPlatformServiceBuilder builder, IBoxHome boxHome, LocalizedStringsResource names) 
            : base(builder, boxHome, names)
        {
        }

        public override ISubCommand CreateSubCommand(string commandName)
        {
            if (commandName == base._names.SubCommandNames.Get) 
            {
                return new SharedItemGetCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else
            {
                throw new Exception("Command not registered.");
            }
        }
    }
}