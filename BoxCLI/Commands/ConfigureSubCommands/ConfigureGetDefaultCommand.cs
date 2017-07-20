using BoxCLI.BoxHome;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands
{
    public class ConfigureGetDefaultCommand : ConfigureSubCommandBase
    {
        public ConfigureGetDefaultCommand(IBoxHome boxHome) : base(boxHome)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            command.Description = "List current default Box environment.";
            command.OnExecute(() =>
            {
                return this.Execute();
            });
            base.Configure(command);
        }

        protected override int Execute()
        {
            base.RunGetDefault();
            return base.Execute();
        }
    }
}