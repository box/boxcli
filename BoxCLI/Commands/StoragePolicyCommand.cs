using System;
using System.IO;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxHome.BoxHomeFiles;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.Commands.StoragePolicySubCommands.StoragePolicyAssignmentSubCommands;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands
{
    public class StoragePolicyCommand : BoxBaseCommand
    {
        private CommandLineApplication _app;
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Manage storage policies to determine where users' content will be physically stored.";
            command.ExtendedHelpText = "You can use this command to get information about available storage policies and assign them to users.";
            command.Command(_names.SubCommandNames.Get, _subCommands.CreateSubCommand(_names.SubCommandNames.Get).Configure);
            command.Command(_names.SubCommandNames.List, _subCommands.CreateSubCommand(_names.SubCommandNames.List).Configure);
            command.Command(_names.SubCommandNames.Assign, _subCommands.CreateSubCommand(_names.SubCommandNames.Assign).Configure);
            command.Command(_names.CommandNames.StoragePolicyAssignment, new StoragePolicyAssignmentCommand(base._boxPlatformBuilder, base._boxHome, base._names, this._factory).Configure);
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

        public StoragePolicyCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, SubCommandFactory factory, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
            _factory = factory;
            _subCommands = factory.CreateFactory(_names.CommandNames.StoragePolicy);
        }
    }
}