using System;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands
{
    public class MetadataCommand : BoxBaseCommand
    {
        private CommandLineApplication _app;
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Manage your metadata.";
            command.ExtendedHelpText = "You can use this command to create, update, delete, and get information about metadata in your Enterprise.";

            command.Command(base._names.SubCommandNames.Get, _subCommands.CreateSubCommand(_names.SubCommandNames.Get).Configure);
            command.Command(base._names.SubCommandNames.GetAll, _subCommands.CreateSubCommand(_names.SubCommandNames.GetAll).Configure);

            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            _app.ShowHelp();
            return await base.Execute();
        }
        private readonly ISubCommandFactory _subCommands;

        public MetadataCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, SubCommandFactory factory, LocalizedStringsResource names, BoxType t)
            : base(boxPlatformBuilder, boxHome, names)
        {
            if (t == BoxType.file)
            {
                _subCommands = factory.CreateFactory(base._names.CommandNames.FileMetadata);
            }
            else if (t == BoxType.folder)
            {
                _subCommands = factory.CreateFactory(base._names.CommandNames.FolderMetadata);
            }
        }
    }
}