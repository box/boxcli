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
        private CommandOption _eventTypes;
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
            _createdBefore = command.Option("--created-before", "Return enterprise events that occured before a time. Use a timestamp or shorthand syntax 00t, like 05w for 5 weeks. If not used, defaults to now.", CommandOptionType.SingleValue);
            _createdAfter = command.Option("--created-after", "Return enterprise events that occured before a time. Use a timestamp or shorthand syntax 00t, like 05w for 5 weeks. If not used, defaults to 5 days ago.", CommandOptionType.SingleValue);
            _eventTypes = command.Option("--event-types", "Return enterprise events filtered by event types. Format using a comma delimited list: NEW_USER,DELETE_USER,EDIT_USER", CommandOptionType.SingleValue);
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
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var BoxCollectionsIterators = base.GetIterators(!String.IsNullOrEmpty(base._oneUseToken.Value()));
            var eventTypes = this._eventTypes.HasValue() ? this._eventTypes.Value().Split(',') : new string[0];
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
                    var fileName = $"{base._names.CommandNames.Events}-enterprise-{base._names.SubCommandNames.Get}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
                    Reporter.WriteInformation("Saving file...");
                    var events = await BoxCollectionsIterators.ReturnAllEvents((position) =>
                    {
                        return boxClient.EventsManager.EnterpriseEventsAsync(limit: 1000, createdAfter: createdAfter, createdBefore: createdBefore, streamPosition: position, eventTypes: eventTypes);
                    });
                    base.WriteEventListResultsToReport(events.Entries, fileName, _path.Value(), _fileFormat.Value());
                    return;
                }
                if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
                {
                    var events = await BoxCollectionsIterators.ReturnAllEvents((position) =>
                    {
                        return boxClient.EventsManager.EnterpriseEventsAsync(limit: 1000, createdAfter: createdAfter, createdBefore: createdBefore, streamPosition: position, eventTypes: eventTypes);
                    });
                    base.OutputJson(events);
                    return;
                }
                await BoxCollectionsIterators.ListEventCollectionToConsole((position) =>
                {
                    return boxClient.EventsManager.EnterpriseEventsAsync(createdAfter: createdAfter, createdBefore: createdBefore, streamPosition: position, eventTypes: eventTypes);
                }, base.PrintEvent);
            }
            else
            {
                if (this._eventTypes.HasValue())
                {
                    throw new Exception("Cannot use --event-types with the user event stream.");
                }
                if (this._save.HasValue())
                {
                    var fileName = $"{base._names.CommandNames.Events}-user-{base._names.SubCommandNames.Get}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
                    Reporter.WriteInformation("Saving file...");
                    var events = await BoxCollectionsIterators.ReturnAllEvents((position) =>
                    {
                        return boxClient.EventsManager.UserEventsAsync(limit: 1000, streamPosition: position);
                    });
                    base.WriteEventListResultsToReport(events.Entries, fileName, _path.Value(), _fileFormat.Value());
                    return;
                }
                if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
                {
                    var events = await BoxCollectionsIterators.ReturnAllEvents((position) =>
                    {
                        return boxClient.EventsManager.UserEventsAsync(limit: 1000, streamPosition: position);
                    });
                    base.OutputJson(events);
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