using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.EventSubCommands
{
    public class EventSubCommandBase : BoxBaseCommand
    {
        protected CommandOption _asUser;
        public EventSubCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _asUser = AsUserOption.ConfigureOption(command);
            base.Configure(command);
        }

        protected virtual void PrintEventCollection(BoxEventCollection<BoxEnterpriseEvent> evts)
        {
            foreach (var evt in evts.Entries)
            {
                this.PrintEvent(evt);
            }
        }
        protected virtual void PrintEvent(BoxEnterpriseEvent evt)
        {
            Reporter.WriteInformation($"***********************");
            Reporter.WriteInformation($"Event ID: {evt.EventId}");
            Reporter.WriteInformation($"Event Type: {evt.EventType}");
            Reporter.WriteInformation($"Session ID: {evt.SessionId}");
            Reporter.WriteInformation($"Source ID: {evt.Source.Id}");
            Reporter.WriteInformation($"Source Type: {evt.Source.Type}");
            base.PrintMiniUser(evt.CreatedBy);
            Reporter.WriteInformation($"***********************");
        }
    }
}