using System;
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
        private CommandOption _eventTypes;
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
            _eventTypes = command.Option("--event-types", "Return enterprise events filtered by event types. Format using a comma delimited list: NEW_USER,DELETE_USER,EDIT_USER", CommandOptionType.SingleValue);
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
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            if (this._enterprise.HasValue())
            {
                var eventTypes = this._eventTypes.HasValue() ? this._eventTypes.Value().Split(',') : new string[0];
                await base.PollEnterpriseEvents(eventTypes);
            }
            else
            {
                if (this._eventTypes.HasValue())
                {
                    throw new Exception("Cannot use --event-types with the user event stream.");
                }
                await boxClient.EventsManager.LongPollUserEvents("now", base.PrintEventCollection, new CancellationToken());
            }
        }
    }
}