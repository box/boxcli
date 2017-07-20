using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands
{
    public class WebhooksCommand : BoxBaseCommand
    {
        private CommandLineApplication _app;
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Manage your webhooks.";
            command.ExtendedHelpText = "You can use this command to create, update, delete, and get information about webhooks in your Enterprise.";

            command.Command(base._names.SubCommandNames.Get, _subCommands.CreateSubCommand(_names.SubCommandNames.Get).Configure);
            command.Command(base._names.SubCommandNames.List, _subCommands.CreateSubCommand(base._names.SubCommandNames.List).Configure);
            command.Command(base._names.SubCommandNames.Create, _subCommands.CreateSubCommand(base._names.SubCommandNames.Create).Configure);
            command.Command(base._names.SubCommandNames.Update, _subCommands.CreateSubCommand(base._names.SubCommandNames.Update).Configure);
            command.Command(base._names.SubCommandNames.Delete, _subCommands.CreateSubCommand(base._names.SubCommandNames.Delete).Configure);

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

        public WebhooksCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, SubCommandFactory factory, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
            _subCommands = factory.CreateFactory(base._names.CommandNames.Webhooks);
        }
    }
}