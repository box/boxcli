using System;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands
{
    public class CollaborationOnItemCommand : BoxBaseCommand
    {
        private CommandLineApplication _app;
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Manage your collaborations on Box items.";
            command.ExtendedHelpText = "You can use this command to create, update, delete, and get information about collaborations on items in your Enterprise.";

            command.Command(base._names.SubCommandNames.List, _subCommands.CreateSubCommand(_names.SubCommandNames.List).Configure);
            command.Command(base._names.SubCommandNames.Add, _subCommands.CreateSubCommand(_names.SubCommandNames.Add).Configure);
            command.Command(base._names.SubCommandNames.Update, _subCommands.CreateSubCommand(_names.SubCommandNames.Update).Configure);

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

        public CollaborationOnItemCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, SubCommandFactory factory, 
            LocalizedStringsResource names, BoxType t = BoxType.enterprise)
            : base(boxPlatformBuilder, boxHome, names)
        {
            if (t == BoxType.file)
            {
                _subCommands = factory.CreateFactory(base._names.CommandNames.FileCollaborations);
            }
            else if (t == BoxType.folder)
            {
                _subCommands = factory.CreateFactory(base._names.CommandNames.FolderCollaborations);
            }
            else
            {
                throw new Exception("This item does not support collaborations.");
            }
        }
    }
}