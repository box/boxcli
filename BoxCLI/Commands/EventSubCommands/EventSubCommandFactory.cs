using System;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.EventSubCommands
{
    public class EventSubCommandFactory : AbstractBoxSubCommandFactory
    {
        public EventSubCommandFactory(IBoxPlatformServiceBuilder builder, IBoxHome boxHome, LocalizedStringsResource names) 
            : base(builder, boxHome, names)
        {
        }

        public override ISubCommand CreateSubCommand(string commandName)
        {
            if (commandName == base._names.SubCommandNames.Poll)
            {
                return new EventPollCommand(_boxPlatformBuilder, _boxHome, _names);
            }
			else if (commandName == base._names.SubCommandNames.Get)
			{
				return new EventGetCommand(_boxPlatformBuilder, _boxHome, _names);
			}
            else
            {
                throw new Exception("Command not registered.");
            }
        }
    }
}