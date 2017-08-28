using System;
using System.Threading;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.BoxPlatform.Utilities;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.EventSubCommands
{
    public class EventGetCommand : EventSubCommandBase
    {
        private CommandOption _enterprise;
        private CommandOption _createdAfter;
        private CommandOption _save;
        private CommandOption _fileFormat;
        private CommandOption _path;
        private CommandOption _createdBefore;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public EventGetCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get events.";
            _enterprise = command.Option("-e|--enterprise", "Get enterprise events", CommandOptionType.NoValue);
            _createdBefore = command.Option("--created-before", "Return enterprise events that occured before a time. Use a timestamp or shorthand syntax 00t, like 05w for 5 weeks", CommandOptionType.SingleValue);
            _createdAfter = command.Option("--created-after", "Return enterprise events that occured before a time. Use a timestamp or shorthand syntax 00t, like 05w for 5 weeks", CommandOptionType.SingleValue);
            _save = SaveOption.ConfigureOption(command);
            _path = FilePathOption.ConfigureOption(command);
            _fileFormat = FileFormatOption.ConfigureOption(command);

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
            var BoxCollectionsIterators = base.GetIterators();
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
                    Reporter.WriteInformation(createdBefore.ToString());
                }
                if (this._createdAfter.HasValue())
                {
                    try
                    {
                        createdAfter = GeneralUtilities.GetDateTimeFromString(this._createdAfter.Value(), true);
                    }
                    catch
                    {
                        createdAfter = DateTime.Parse(this._createdAfter.Value());
                    }
                }
                if (this._save.HasValue())
                {
                    var fileName = $"{base._names.CommandNames.Events}-{base._names.SubCommandNames.Get}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
                    Reporter.WriteInformation("Saving file...");
                    var events = await boxClient.EventsManager.EnterpriseEventsAsync(createdAfter: createdAfter, createdBefore: createdBefore);
                    base.WriteEventListResultsToReport(events.Entries, fileName, _path.Value(), _fileFormat.Value());
                    return;
                }
                if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
                {
                    var events = await boxClient.EventsManager.EnterpriseEventsAsync(createdAfter: createdAfter, createdBefore: createdBefore);
                    base.OutputJson(events);
                    return;
                }
                await BoxCollectionsIterators.ListEventCollectionToConsole((position) =>
                {
                    return boxClient.EventsManager.EnterpriseEventsAsync(createdAfter: createdAfter, createdBefore: createdBefore, streamPosition: position);
                }, base.PrintEvent);
            }
            else
            {
                if (this._save.HasValue())
                {
                    var fileName = $"{base._names.CommandNames.Events}-{base._names.SubCommandNames.Get}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
                    Reporter.WriteInformation("Saving file...");
                    var events = await boxClient.EventsManager.UserEventsAsync();
                    base.WriteEventListResultsToReport(events.Entries, fileName, _path.Value(), _fileFormat.Value());
                    return;
                }
                await BoxCollectionsIterators.ListEventCollectionToConsole((position) =>
                {
                    return boxClient.EventsManager.UserEventsAsync(streamPosition: position);
                }, base.PrintEvent);
            }
        }
    }
}