using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands
{
    public class ConfigureSetDefaultCommand : ConfigureSubCommandBase
    {
        private CommandArgument _name;
        public ConfigureSetDefaultCommand(IBoxHome boxHome) : base(boxHome)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            command.Description = "Set the default Box environment to use.";
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
            this.RunSetDefault(_name.Value);
            return base.Execute();
        }

        private void RunSetDefault(string name)
        {
            if (string.IsNullOrEmpty(name))
            {
                System.Console.WriteLine("You must enter a name for the Box environment.");
                return;
            }
            base._environments.SetDefaultEnvironment(name);
            Reporter.WriteSuccess("Successfully set new default environment:");
            base.RunGetDefault();
        }
    }
}