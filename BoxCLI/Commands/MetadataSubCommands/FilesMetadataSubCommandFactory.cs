using System;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.MetadataSubCommands
{
    public class FilesMetadataSubCommandFactory : AbstractBoxSubCommandFactory
    {
        public FilesMetadataSubCommandFactory(IBoxPlatformServiceBuilder builder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(builder, boxHome, names)
        {
        }

        public override ISubCommand CreateSubCommand(string commandName)
        {
            if (commandName == base._names.SubCommandNames.Get) 
            {
                return new MetadataGetCommand(_boxPlatformBuilder, _boxHome, _names, BoxType.file);
            }
            else if (commandName == base._names.SubCommandNames.GetAll)
            {
                return new MetadataGetAllCommand(_boxPlatformBuilder, _boxHome, _names, BoxType.file);
            }
            else if (commandName == base._names.SubCommandNames.Create)
            {
                return new MetadataCreateCommand(_boxPlatformBuilder, _boxHome, _names, BoxType.file);
            }
            else if (commandName == base._names.SubCommandNames.Update)
            {
                return new MetadataUpdateCommand(_boxPlatformBuilder, _boxHome, _names, BoxType.file);
            }
            else
            {
                throw new Exception("Command not registered.");
            }
        }
    }
}