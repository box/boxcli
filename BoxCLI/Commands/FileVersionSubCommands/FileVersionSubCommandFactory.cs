using System;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.FileVersionSubCommands
{
    public class FileVersionSubCommandFactory : AbstractBoxSubCommandFactory
    {
        public FileVersionSubCommandFactory(IBoxPlatformServiceBuilder builder, IBoxHome boxHome, LocalizedStringsResource names) 
            : base(builder, boxHome, names)
        {
        }

        public override ISubCommand CreateSubCommand(string commandName)
        {
            if (commandName == base._names.SubCommandNames.List)
            {
                return new FileVersionListCommand(base._boxPlatformBuilder, base._boxHome, base._names);
            }
            else if (commandName == _names.SubCommandNames.Download)
            {
                return new FileVersionDownloadCommand(base._boxPlatformBuilder, base._boxHome, base._names);
            }
            else if (commandName == _names.SubCommandNames.Upload)
            {
                return new FileVersionUploadCommand(base._boxPlatformBuilder, base._boxHome, base._names);
            }
            else
            {
                throw new Exception("Command not registered.");
            }
        }
    }
}