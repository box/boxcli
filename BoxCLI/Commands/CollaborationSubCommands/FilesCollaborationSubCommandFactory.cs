using System;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.CollaborationSubCommands
{
    public class FilesCollaborationSubCommandFactory : AbstractBoxSubCommandFactory
    {
        public FilesCollaborationSubCommandFactory(IBoxPlatformServiceBuilder builder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(builder, boxHome, names)
        {
        }

        public override ISubCommand CreateSubCommand(string commandName)
        {
            if (commandName == base._names.SubCommandNames.List)
            {
                return new CollaborationListCommand(_boxPlatformBuilder, _boxHome, _names, BoxType.file);
            }
            else if (commandName == base._names.SubCommandNames.Add)
            {
                return new CollaborationAddCommand(_boxPlatformBuilder, _boxHome, _names, BoxType.file);
            }
            else if (commandName == base._names.SubCommandNames.Update)
            {
                return new CollaborationUpdateCommand(_boxPlatformBuilder, _boxHome, _names, BoxType.file);
            }
            else if (commandName == base._names.SubCommandNames.Delete)
            {
                return new CollaborationDeleteCommand(_boxPlatformBuilder, _boxHome, _names, BoxType.enterprise);
            }
            else
            {
                throw new Exception("Command not registered.");
            }
        }
    }
}