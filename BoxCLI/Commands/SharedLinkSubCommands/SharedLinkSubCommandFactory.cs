using System;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.SharedLinkSubCommands
{
    public class SharedLinkSubCommandFactory : AbstractBoxSubCommandFactory
    {
        public SharedLinkSubCommandFactory(IBoxPlatformServiceBuilder builder, IBoxHome boxHome, LocalizedStringsResource names) 
            : base(builder, boxHome, names)
        {
            
        }

        public override ISubCommand CreateSubCommand(string commandName)
        {
            if (commandName == base._names.SubCommandNames.Get) 
            {
                return new SharedLinkGetCommand(_boxPlatformBuilder, _boxHome, _names, BoxType.enterprise);
            }
            else
            {
                throw new Exception("Command not registered.");
            }
        }
    }
}