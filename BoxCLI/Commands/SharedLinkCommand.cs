using System;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands
{
    public class SharedLinkCommand : BoxBaseCommand
    {
        private CommandLineApplication _app;
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Manage your shared links.";
            command.ExtendedHelpText = "You can use this command to create, update, delete, and get information about shared links in your Enterprise.";
            command.Command(base._names.SubCommandNames.Get, _subCommands.CreateSubCommand(_names.SubCommandNames.Get).Configure);
            command.Command(base._names.SubCommandNames.Create, _subCommands.CreateSubCommand(_names.SubCommandNames.Create).Configure);
            command.Command(base._names.SubCommandNames.Update, _subCommands.CreateSubCommand(_names.SubCommandNames.Update).Configure);
            command.Command(base._names.SubCommandNames.Delete, _subCommands.CreateSubCommand(_names.SubCommandNames.Delete).Configure);

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
        private readonly BoxType _t;

        public SharedLinkCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, SubCommandFactory factory,
            LocalizedStringsResource names, BoxType t = BoxType.enterprise)
            : base(boxPlatformBuilder, boxHome, names)
        {
            _t = t;
            if (t == BoxType.file)
            {
                _subCommands = factory.CreateFactory(base._names.CommandNames.FileSharedLinks);
            }
            else if (t == BoxType.folder)
            {
                _subCommands = factory.CreateFactory(base._names.CommandNames.FolderSharedLinks);
            }
            else
            {
                _subCommands = factory.CreateFactory(base._names.CommandNames.SharedLinks);
            }
        }
    }
}