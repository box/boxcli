using System;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;
namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureEnvironmentsSubCommands
{
    public class ConfigureEnvironmentDeleteCommand : BoxBaseCommand
    {
		private CommandArgument _name;
        private CommandOption _dontPrompt;
		private CommandLineApplication _app;

		public ConfigureEnvironmentDeleteCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names) 
            : base(boxPlatformBuilder, boxHome, names)
        {
		}

		public override void Configure(CommandLineApplication command)
		{
			_app = command;
			command.Description = "Delete a Box environment.";
			_name = command.Argument("name",
							   "Name of the environment");
            _dontPrompt = SuppressDeletePromptOption.ConfigureOption(command);
			command.OnExecute(() =>
			{
				return this.Execute();
			});
			base.Configure(command);
		}

		protected async override Task<int> Execute()
		{
			await this.Delete();
			return await base.Execute();
		}

		private async Task Delete()
		{
			base.CheckForValue(this._name.Value, this._app, "An environment name is required for this command.");
            bool deleted;
			if (this._dontPrompt.HasValue())
			{
                await base._boxPlatformBuilder.Build().BustCache();
				deleted = base._environments.DeleteEnvironment(this._name.Value);
			}
			else
			{
				Reporter.WriteWarningNoNewLine("Are you sure you want to delete this environment? y/N ");
				var yNKey = "n";
				yNKey = Console.ReadLine().ToLower();
				if (yNKey != "y")
				{
					Reporter.WriteInformation("Aborted environment deletion.");
					return;
				}
				else
				{
                    await base._boxPlatformBuilder.Build().BustCache();
					deleted = base._environments.DeleteEnvironment(this._name.Value);
				}
			}
			
            Reporter.WriteSuccess("Successfully deleted environment");
		}
    }
}
