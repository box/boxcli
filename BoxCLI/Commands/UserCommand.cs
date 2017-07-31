using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using Box.V2;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.BoxPlatform.Utilities;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CsvModels;
using Microsoft.Extensions.CommandLineUtils;
using System.Linq;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands
{
    public class UserCommand : BoxBaseCommand
    {
        private CommandLineApplication _app;
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Manage your Box users.";
            command.ExtendedHelpText = "You can use this command to create, update, delete, and get information about a Box user in your Enterprise.";
            
            command.Command(_names.SubCommandNames.Get, _subCommands.CreateSubCommand(_names.SubCommandNames.Get).Configure);
            command.Command(_names.SubCommandNames.List, _subCommands.CreateSubCommand(_names.SubCommandNames.List).Configure);
            command.Command(_names.SubCommandNames.Search, _subCommands.CreateSubCommand(_names.SubCommandNames.Search).Configure);
            command.Command(_names.SubCommandNames.Create, _subCommands.CreateSubCommand(_names.SubCommandNames.Create).Configure);
            command.Command(_names.SubCommandNames.Update, _subCommands.CreateSubCommand(_names.SubCommandNames.Update).Configure);
            command.Command(_names.SubCommandNames.Delete, _subCommands.CreateSubCommand(_names.SubCommandNames.Delete).Configure);
            command.Command(_names.SubCommandNames.Invite, _subCommands.CreateSubCommand(_names.SubCommandNames.Invite).Configure);
            command.Command(_names.SubCommandNames.MoveRootContent, _subCommands.CreateSubCommand(_names.SubCommandNames.MoveRootContent).Configure);
            command.Command(_names.SubCommandNames.ChangeLogin, _subCommands.CreateSubCommand(_names.SubCommandNames.ChangeLogin).Configure);
            command.Command(_names.SubCommandNames.AddEmailAlias, _subCommands.CreateSubCommand(_names.SubCommandNames.AddEmailAlias).Configure);
            command.Command(_names.SubCommandNames.GetEmailAliases, _subCommands.CreateSubCommand(_names.SubCommandNames.GetEmailAliases).Configure);
            command.Command(_names.SubCommandNames.DeleteEmailAlias, _subCommands.CreateSubCommand(_names.SubCommandNames.DeleteEmailAlias).Configure);

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

        public UserCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, SubCommandFactory factory, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
            _subCommands = factory.CreateFactory(base._names.CommandNames.Users);
        }
    }
}