using System;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands
{
    public class CollaborationCommand : BoxBaseCommand
    {
        private CommandLineApplication _app;
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Manage individual collaborations.";
            command.ExtendedHelpText = "You can use this command to create, update, delete, and get information about a collaboration in your Enterprise.";

            command.Command(base._names.SubCommandNames.Get, _subCommands.CreateSubCommand(_names.SubCommandNames.Get).Configure);
            command.Command(base._names.SubCommandNames.Add, _subCommands.CreateSubCommand(_names.SubCommandNames.Add).Configure);
            command.Command(base._names.SubCommandNames.Update, _subCommands.CreateSubCommand(_names.SubCommandNames.Update).Configure);
            command.Command(base._names.SubCommandNames.GetPending, _subCommands.CreateSubCommand(_names.SubCommandNames.GetPending).Configure);
            command.Command(base._names.SubCommandNames.ListForGroup, _subCommands.CreateSubCommand(_names.SubCommandNames.ListForGroup).Configure);

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

        public CollaborationCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, SubCommandFactory factory,
            LocalizedStringsResource names, BoxType t = BoxType.enterprise)
            : base(boxPlatformBuilder, boxHome, names)
        {
            _subCommands = factory.CreateFactory(base._names.CommandNames.Collaborations);
        }
    }
}