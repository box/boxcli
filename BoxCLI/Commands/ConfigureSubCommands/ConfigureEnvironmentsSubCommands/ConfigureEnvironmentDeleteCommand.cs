using System;
using System.Linq;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;
namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureEnvironmentsSubCommands
{
    public class ConfigureEnvironmentDeleteCommand : ConfigureEnvironmentsSubCommandBase
    {
		private CommandArgument _name;
        private CommandOption _dontPrompt;
		private CommandLineApplication _app;

		public ConfigureEnvironmentDeleteCommand(IBoxHome boxHome) 
            : base(boxHome)
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

		 protected override int Execute()
        {
            this.RunDelete();
            return base.Execute();
        }

		private void RunDelete()
		{
			base.CheckForValue(this._name.Value, this._app, "An environment name is required for this command.");
            bool deleted;
			if (this._dontPrompt.HasValue())
			{
                base._boxHome.BustCache();
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
                    base._boxHome.BustCache();
					deleted = base._environments.DeleteEnvironment(this._name.Value);
				}
			}
            Reporter.WriteSuccess("Successfully deleted environment");
			if(base._environments.GetAllEnvironments().Count > 0)
			{
				var newDefault = base._environments.GetAllEnvironments().First();
				base._environments.SetDefaultEnvironment(newDefault.Value.Name);
				Reporter.WriteInformation($"Set {newDefault.Value.Name} as the current environment.");
			}
			else
			{
				Reporter.WriteInformation($"No environments configured. Please add a new environment by using the following command:");
				Reporter.WriteInformation("box configure environments add <FILEPATH> --name <NAME> --private-key-path <KEYPATH>");
			}
		}
    }
}
