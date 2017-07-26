using System.Threading;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.EventSubCommands
{
    public class EventPollCommand : EventSubCommandBase
    {
        private CommandOption _enterprise;
        private CommandLineApplication _app;
        public EventPollCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Poll the event stream.";
            _enterprise = command.Option("-e|--enterprise", "Poll enterprise events", CommandOptionType.NoValue);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunPoll();
            return await base.Execute();
        }

        private async Task RunPoll()
        {
            Reporter.WriteSuccess("Poll started...");
            Reporter.WriteInformation("Press Ctrl+C to stop polling.");
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            if (this._enterprise.HasValue())
            {
                await base.PollEnterpriseEvents();
            }
            else
            {
                await boxClient.EventsManager.LongPollUserEvents("now", base.PrintEventCollection, new CancellationToken());
            }
        }
    }
}