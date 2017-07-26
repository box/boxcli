using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureEnvironmentsSubCommands
{
    public class ConfigureEnvironmentsSetCurrentCommand : ConfigureEnvironmentsSubCommandBase
    {
        private CommandArgument _name;
        private CommandLineApplication _app;
        public ConfigureEnvironmentsSetCurrentCommand(IBoxHome boxHome) : base(boxHome)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Set your current Box environment to use.";
            _name = command.Argument("name",
                               "Name of the environment");
            command.OnExecute(() =>
            {
                return this.Execute();
            });
            base.Configure(command);
        }

        protected override int Execute()
        {
            this.RunSetCurrent();
            return base.Execute();
        }

        private void RunSetCurrent()
        {
            base.CheckForValue(this._name.Value, this._app, "An environment name is required for this command.");
            base._environments.SetDefaultEnvironment(this._name.Value);
            Reporter.WriteSuccess("Successfully set new default environment:");
            base._boxHome.BustCache();
            base.GetCurrent();
        }
    }
}