using System;
using BoxCLI.BoxHome;
using BoxCLI.BoxHome.BoxHomeFiles;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.FileSubCommand
{
    public class FileSubCommandFactory : AbstractBoxSubCommandFactory
    {
        public FileSubCommandFactory(IBoxPlatformServiceBuilder builder, IBoxHome boxHome, LocalizedStringsResource names) 
            : base(builder, boxHome, names)
        {
        }

        public override ISubCommand CreateSubCommand(string commandName)
        {
            if (commandName == base._names.SubCommandNames.Get)
            {
                return new FileGetCommand(base._boxPlatformBuilder, base._boxHome, base._names);
            }
            else if (commandName == _names.SubCommandNames.Download)
            {
                return new FileDownloadCommand(base._boxPlatformBuilder, base._boxHome, base._names);
            }
            else
            {
                throw new Exception("Command not registered.");
            }
        }
    }
}