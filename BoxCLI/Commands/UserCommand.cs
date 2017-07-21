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
using Microsoft.Extensions.Logging;
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

            command.Command(base._names.SubCommandNames.Get, _subCommands.CreateSubCommand(_names.SubCommandNames.Get).Configure);
            command.Command(base._names.SubCommandNames.List, _subCommands.CreateSubCommand(base._names.SubCommandNames.List).Configure);
            command.Command(base._names.SubCommandNames.Search, _subCommands.CreateSubCommand(base._names.SubCommandNames.Search).Configure);
            command.Command(base._names.SubCommandNames.Create, _subCommands.CreateSubCommand(base._names.SubCommandNames.Create).Configure);

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