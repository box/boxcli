using System;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.TaskSubCommands
{
    public class TaskSubCommandFactory : AbstractBoxSubCommandFactory
    {
        public TaskSubCommandFactory(IBoxPlatformServiceBuilder builder, IBoxHome boxHome, LocalizedStringsResource names) 
            : base(builder, boxHome, names)
        {
        }

        public override ISubCommand CreateSubCommand(string commandName)
        {
			if (commandName == base._names.SubCommandNames.Get)
			{
				return new TaskGetCommand(_boxPlatformBuilder, _boxHome, _names);
			}
			else if (commandName == base._names.SubCommandNames.Create)
			{
				return new TaskCreateCommand(_boxPlatformBuilder, _boxHome, _names);
			}
			else if (commandName == base._names.SubCommandNames.Update)
			{
				return new TaskUpdateCommand(_boxPlatformBuilder, _boxHome, _names);
			}
			else if (commandName == base._names.SubCommandNames.Delete)
			{
				return new TaskDeleteCommand(_boxPlatformBuilder, _boxHome, _names);
			}
			else
			{
				throw new Exception("Command not registered.");
			}
        }
    }
}
