using System;
using BoxCLI.BoxHome;
using BoxCLI.BoxHome.BoxHomeFiles;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.FolderSubCommands
{
    public class FolderSubCommandFactory : AbstractBoxSubCommandFactory
    {
        public FolderSubCommandFactory(IBoxPlatformServiceBuilder builder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(builder, boxHome, names)
        {
        }

        public override ISubCommand CreateSubCommand(string commandName)
        {
            if (commandName == base._names.SubCommandNames.Get)
            {
                return new FolderGetCommand(base._boxPlatformBuilder, base._boxHome, base._names);
            }
            else if (commandName == base._names.SubCommandNames.Create)
            {
                return new FolderCreateCommand(base._boxPlatformBuilder, base._boxHome, base._names);
            }
            else if (commandName == base._names.SubCommandNames.ListItems)
            {
                return new FolderListItemsCommand(base._boxPlatformBuilder, base._boxHome, base._names);
            }
            else if (commandName == base._names.SubCommandNames.Move)
            {
                return new FolderMoveCommand(base._boxPlatformBuilder, base._boxHome, base._names);
            }
            else if (commandName == base._names.SubCommandNames.Copy)
            {
                return new FolderCopyCommand(base._boxPlatformBuilder, base._boxHome, base._names);
            }
            else if (commandName == base._names.SubCommandNames.Delete)
            {
                return new FolderDeleteCommand(base._boxPlatformBuilder, base._boxHome, base._names);
            }
            else if (commandName == base._names.SubCommandNames.ChangeUploadEmail)
            {
                return new FolderChangeUploadEmailCommand(base._boxPlatformBuilder, base._boxHome, base._names);
            }
            else if (commandName == base._names.SubCommandNames.Update)
            {
                return new FolderUpdateCommand(base._boxPlatformBuilder, base._boxHome, base._names);
            }
            else if (commandName == base._names.SubCommandNames.Download)
            {
                return new FolderDownloadCommand(base._boxPlatformBuilder, base._boxHome, base._names);
            }
            else
            {
                throw new Exception("Command not registered.");
            }
        }
    }
}