using System;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands
{
    public class TaskAssignmentCommand : BoxBaseCommand
    {
		private CommandLineApplication _app;
		public override void Configure(CommandLineApplication command)
		{
			_app = command;
			command.Description = "Work with task assignments in Box.";
			command.ExtendedHelpText = "You can use this command to create, update, delete, and get information about task assignments in your Enterprise.";
			command.Command(_names.SubCommandNames.Get, _subCommands.CreateSubCommand(_names.SubCommandNames.Get).Configure);
            command.Command(_names.SubCommandNames.List, _subCommands.CreateSubCommand(_names.SubCommandNames.List).Configure);
            command.Command(_names.SubCommandNames.Create, _subCommands.CreateSubCommand(_names.SubCommandNames.Create).Configure);
            command.Command(_names.SubCommandNames.Update, _subCommands.CreateSubCommand(_names.SubCommandNames.Update).Configure);
            command.Command(_names.SubCommandNames.Delete, _subCommands.CreateSubCommand(_names.SubCommandNames.Delete).Configure);
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
        public TaskAssignmentCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, SubCommandFactory factory, LocalizedStringsResource names) 
            : base(boxPlatformBuilder, boxHome, names)
        {
            this._subCommands = factory.CreateFactory(base._names.CommandNames.TaskAssignment);
        }
    }
}
