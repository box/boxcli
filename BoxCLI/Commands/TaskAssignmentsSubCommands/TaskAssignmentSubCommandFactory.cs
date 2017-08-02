using System;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.TaskAssignmentsSubCommands
{
    public class TaskAssignmentSubCommandFactory : AbstractBoxSubCommandFactory
    {
        public TaskAssignmentSubCommandFactory(IBoxPlatformServiceBuilder builder, IBoxHome boxHome, LocalizedStringsResource names) 
            : base(builder, boxHome, names)
        {
        }

        public override ISubCommand CreateSubCommand(string commandName)
        {
			if (commandName == base._names.SubCommandNames.Get)
			{
				return new TaskAssignmentGetCommand(_boxPlatformBuilder, _boxHome, _names);
			}
			else if (commandName == base._names.SubCommandNames.Create)
			{
				return new TaskAssignmentCreateCommand(_boxPlatformBuilder, _boxHome, _names);
			}
			else if (commandName == base._names.SubCommandNames.Update)
			{
				return new TaskAssignmentUpdateCommand(_boxPlatformBuilder, _boxHome, _names);
			}
			else if (commandName == base._names.SubCommandNames.Delete)
			{
				return new TaskAssignmentDeleteCommand(_boxPlatformBuilder, _boxHome, _names);
			}
			else if (commandName == base._names.SubCommandNames.List)
			{
				return new TaskAssignmentListCommand(_boxPlatformBuilder, _boxHome, _names);
			}
			else
			{
				throw new Exception("Command not registered.");
			}
        }
    }
}
