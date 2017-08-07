using System;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.CollaborationSubCommands
{
    public class CollaborationSubCommandFactory : AbstractBoxSubCommandFactory
    {
        public CollaborationSubCommandFactory(IBoxPlatformServiceBuilder builder, IBoxHome boxHome, LocalizedStringsResource names) 
            : base(builder, boxHome, names)
        {
        }

        public override ISubCommand CreateSubCommand(string commandName)
        {
            if (commandName == base._names.SubCommandNames.Get) 
            {
                return new CollaborationGetCommand(_boxPlatformBuilder, _boxHome, _names, BoxType.enterprise);
            }
            else if (commandName == base._names.SubCommandNames.Add)
            {
                return new CollaborationAddCommand(_boxPlatformBuilder, _boxHome, _names, BoxType.enterprise);
            }
            else if (commandName == base._names.SubCommandNames.Delete)
            {
                return new CollaborationDeleteCommand(_boxPlatformBuilder, _boxHome, _names, BoxType.enterprise);
            }
            else if (commandName == base._names.SubCommandNames.Update)
            {
                return new CollaborationUpdateCommand(_boxPlatformBuilder, _boxHome, _names, BoxType.enterprise);
            }
			else if (commandName == base._names.SubCommandNames.GetPending)
			{
				return new CollaborationGetPendingCommand(_boxPlatformBuilder, _boxHome, _names, BoxType.enterprise);
			}
            else
            {
                throw new Exception("Command not registered.");
            }
        }
    }
}