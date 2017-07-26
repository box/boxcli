using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands
{
    public class ConfigureBustCacheCommand : ConfigureSubCommandBase
    {
        private CommandLineApplication _app;
        public ConfigureBustCacheCommand(IBoxHome boxHome) : base(boxHome)
        {
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Bust the token cache.";
            command.OnExecute(() =>
            {
                return this.Execute();
            });
            base.Configure(command);
        }
        protected override int Execute()
        {
            this.RunBust();
            return base.Execute();
        }
        protected virtual void RunBust()
        {
            base._boxHome.BustCache();
            Reporter.WriteSuccess("Token cache cleared.");
        }
    }
}