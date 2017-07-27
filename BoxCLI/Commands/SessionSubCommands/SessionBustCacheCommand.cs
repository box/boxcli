using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.SessionSubCommands
{
    public class SessionBustCacheCommand : SessionSubCommandBase
    {
        private CommandLineApplication _app;

        public SessionBustCacheCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
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
        protected async override Task<int> Execute()
        {
            this.RunBust();
            return await base.Execute();
        }
        protected virtual void RunBust()
        {
            base._boxPlatformBuilder.Build().BustCache();
            Reporter.WriteSuccess("Token cache cleared.");
        }
    }
}