using System;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.CommentSubCommands
{
    public class CommentSubCommandFactory : AbstractBoxSubCommandFactory
    {
        public CommentSubCommandFactory(IBoxPlatformServiceBuilder builder, IBoxHome boxHome, LocalizedStringsResource names) 
            : base(builder, boxHome, names)
        {
        }

        public override ISubCommand CreateSubCommand(string commandName)
        {
			if (commandName == base._names.SubCommandNames.Get)
			{
				return new CommentGetCommand(_boxPlatformBuilder, _boxHome, _names);
			}
			else if (commandName == base._names.SubCommandNames.Create)
			{
				return new CommentCreateCommand(_boxPlatformBuilder, _boxHome, _names);
			}
			else if (commandName == base._names.SubCommandNames.Update)
			{
				return new CommentUpdateCommand(_boxPlatformBuilder, _boxHome, _names);
			}
			else if (commandName == base._names.SubCommandNames.Delete)
			{
				return new CommentDeleteCommand(_boxPlatformBuilder, _boxHome, _names);
			}
			else if (commandName == base._names.SubCommandNames.List)
			{
				return new CommentListCommand(_boxPlatformBuilder, _boxHome, _names);
			}
			else
			{
				throw new Exception("Command not registered.");
			}
        }
    }
}
