using BoxCLI.BoxHome;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureEnvironmentsSubCommands
{
    public class ConfigureEnvironmentsGetCurrentCommand : ConfigureEnvironmentsSubCommandBase
    {
        public ConfigureEnvironmentsGetCurrentCommand(IBoxHome boxHome) : base(boxHome)
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
            this.RunGetCurrent();
            return base.Execute();
        }

        protected virtual void RunGetCurrent()
        {
            base.GetCurrent();
        }

    }
}