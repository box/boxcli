using System;
using System.IO;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxHome.BoxHomeFiles;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands
{
    public class FileCommand : BoxBaseCommand
    {
        private CommandLineApplication _app;
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Work with files in Box.";
            command.ExtendedHelpText = "You can use this command to create, update, delete, and get information about files in your Enterprise.";
            command.Command(_names.SubCommandNames.Get, _subCommands.CreateSubCommand(_names.SubCommandNames.Get).Configure);
            command.Command(_names.SubCommandNames.Download, _subCommands.CreateSubCommand(_names.SubCommandNames.Download).Configure);
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

        public FileCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, SubCommandFactory factory, LocalizedStringsResource names) 
            : base(boxPlatformBuilder, boxHome, names)
        {
            _subCommands = factory.CreateFactory(_names.CommandNames.Files);
        }
    }
}