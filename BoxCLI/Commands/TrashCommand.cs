using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands
{
    public class TrashCommand : BoxBaseCommand
    {
        public TrashCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, SubCommandFactory factory, LocalizedStringsResource names) 
            : base(boxPlatformBuilder, boxHome, names)
        {
            _subCommands = factory.CreateFactory(base._names.CommandNames.Trash);
        }
        private CommandLineApplication _app;
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Manage your trash.";
            command.ExtendedHelpText = "You can use this command to work with your trash folder.";

            command.Command(base._names.SubCommandNames.List, _subCommands.CreateSubCommand(_names.SubCommandNames.List).Configure);
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

    }
}