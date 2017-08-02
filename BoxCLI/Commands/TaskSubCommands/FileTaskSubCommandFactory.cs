using System;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.TaskSubCommands
{
    public class FileTaskSubCommandFactory : AbstractBoxSubCommandFactory
    {
        public FileTaskSubCommandFactory(IBoxPlatformServiceBuilder builder, IBoxHome boxHome, LocalizedStringsResource names) 
            : base(builder, boxHome, names)
        {
        }

        public override ISubCommand CreateSubCommand(string commandName)
        {
			if (commandName == base._names.SubCommandNames.List)
			{
				return new TaskListCommand(_boxPlatformBuilder, _boxHome, _names);
			}
			else
			{
				throw new Exception("Command not registered.");
			}
        }
    }
}
