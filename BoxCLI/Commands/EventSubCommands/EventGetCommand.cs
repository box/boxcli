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
    public class EventGetCommand : EventSubCommandBase
    {
        private CommandOption _enterprise;
        private CommandOption _createdAfter;
        private CommandOption _createdBefore;
        private CommandLineApplication _app;
        public EventGetCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get events.";
            _enterprise = command.Option("-e|--enterprise", "Get enterprise events", CommandOptionType.NoValue);
            _createdBefore = command.Option("--created-before", "Return enterprise events that occured before a time. Use a timestamp or shorthand syntax 00t, like 05w for 5 weeks", CommandOptionType.SingleValue);
            _createdAfter = command.Option("--created-after", "Return enterprise events that occured before a time. Use a timestamp or shorthand syntax 00t, like 05w for 5 weeks", CommandOptionType.SingleValue);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunGet();
            return await base.Execute();
        }

        private async Task RunGet()
        {
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            // boxClient.EventsManager.EnterpriseEventsAsync()
            if (this._enterprise.HasValue())
            {
                var createdBefore = DateTime.Now;
                var createdAfter = DateTime.Now.AddDays(-5);
                if (this._createdBefore.HasValue())
                {
                    try
                    {
                        createdBefore = GeneralUtilities.GetDateTimeFromString(this._createdBefore.Value(), true);
                    }
                    catch 
                    { 
                        createdBefore = DateTime.Parse(this._createdBefore.Value());
                    }
                }
                if (this._createdAfter.HasValue())
                {
                    try
                    {
                        createdAfter = GeneralUtilities.GetDateTimeFromString(this._createdBefore.Value(), true);
                    }
                    catch 
                    { 
                        createdAfter = DateTime.Parse(this._createdBefore.Value());
                    }
                }
                var collection = await boxClient.EventsManager.EnterpriseEventsAsync(createdAfter: createdAfter, createdBefore: createdBefore);
                foreach(var evt in collection.Entries)
                {
                    base.PrintEvent(evt);
                }
            }
            else
            {
                await boxClient.EventsManager.LongPollUserEvents("now", base.PrintEventCollection, new CancellationToken());
            }
        }
    }
}