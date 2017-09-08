using System;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands
{
    public class FolderCommand : BoxBaseCommand
    {
        private CommandLineApplication _app;
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Manage folders in Box.";
            command.ExtendedHelpText = "You can use this command to create, update, delete, and get information about folders in your Enterprise.";
            command.Command(_names.SubCommandNames.Get, _subCommands.CreateSubCommand(_names.SubCommandNames.Get).Configure);
            command.Command(_names.SubCommandNames.Create, _subCommands.CreateSubCommand(_names.SubCommandNames.Create).Configure);
            command.Command(_names.SubCommandNames.ListItems, _subCommands.CreateSubCommand(_names.SubCommandNames.ListItems).Configure);
            command.Command(_names.SubCommandNames.Update, _subCommands.CreateSubCommand(_names.SubCommandNames.Update).Configure);
            command.Command(_names.SubCommandNames.Move, _subCommands.CreateSubCommand(_names.SubCommandNames.Move).Configure);
            command.Command(_names.SubCommandNames.Copy, _subCommands.CreateSubCommand(_names.SubCommandNames.Copy).Configure);
            command.Command(_names.SubCommandNames.Delete, _subCommands.CreateSubCommand(_names.SubCommandNames.Delete).Configure);
            command.Command(_names.SubCommandNames.Download, _subCommands.CreateSubCommand(_names.SubCommandNames.Download).Configure);
            command.Command(_names.SubCommandNames.Upload, _subCommands.CreateSubCommand(_names.SubCommandNames.Upload).Configure);
            command.Command(_names.SubCommandNames.ChangeUploadEmail, _subCommands.CreateSubCommand(_names.SubCommandNames.ChangeUploadEmail).Configure);
            command.Command(_names.CommandNames.Metadata, new MetadataCommand(base._boxPlatformBuilder, base._boxHome, this._factory, base._names, BoxType.folder).Configure);
            command.Command(_names.CommandNames.Collaborations, new CollaborationOnItemCommand(base._boxPlatformBuilder, base._boxHome, this._factory, base._names, BoxType.folder).Configure);
            command.Command(_names.CommandNames.SharedLinks, new SharedLinkCommand(base._boxPlatformBuilder, base._boxHome, this._factory, base._names, BoxType.folder).Configure);
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
        private readonly SubCommandFactory _factory;
        public FolderCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, SubCommandFactory factory, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
            _factory = factory;
            _subCommands = factory.CreateFactory(_names.CommandNames.Folders);
        }

    }
}