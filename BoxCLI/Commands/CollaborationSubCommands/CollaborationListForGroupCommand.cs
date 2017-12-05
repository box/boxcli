using System;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.BoxPlatform.Utilities;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.CsvModels;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;
namespace BoxCLI.Commands.CollaborationSubCommands
{
    public class CollaborationListForGroupCommand : CollaborationSubCommandBase
    {
        private CommandArgument _id;
        private CommandOption _save;
        private CommandOption _fileFormat;
        private CommandOption _limit;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public CollaborationListForGroupCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names, BoxType t)
            : base(boxPlatformBuilder, home, names, t)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "List all collaborations for a group.";
            _save = SaveOption.ConfigureOption(command);
            _fileFormat = FileFormatOption.ConfigureOption(command);
            _id = command.Argument("groupId",
                                   "Id of the group");
            _limit = LimitOption.ConfigureOption(command);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunListGroups();
            return await base.Execute();
        }

        private async Task RunListGroups()
        {
            base.CheckForValue(this._id.Value, this._app, "A group ID is required for this command.");
            var BoxCollectionsIterators = base.GetIterators(!String.IsNullOrEmpty(base._oneUseToken.Value()));
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            if (_save.HasValue())
            {
                BoxCollection<BoxCollaboration> collabs;
                var fileName = $"{base._names.CommandNames.Collaborations}-{base._names.SubCommandNames.GetPending}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
                Reporter.WriteInformation("Saving file...");
                collabs = await boxClient.GroupsManager.GetCollaborationsForGroupAsync(this._id.Value, autoPaginate: true);
                var saved = base.WriteOffsetCollectionResultsToReport<BoxCollaboration, BoxCollaborationMap>(collabs, fileName, fileFormat: this._fileFormat.Value());
                Reporter.WriteInformation($"File saved: {saved}");
                return;
            }
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                var result = await boxClient.GroupsManager.GetCollaborationsForGroupAsync(this._id.Value, autoPaginate: true);
                base.OutputJson(result);
                return;
            }
			int limit = -1;
			if (this._limit.HasValue())
			{
				try
				{
					limit = Convert.ToInt32(this._limit.Value());
				}
				catch { }
			}
            await BoxCollectionsIterators.ListOffsetCollectionToConsole<BoxCollaboration>((offset) =>
            {
                return boxClient.GroupsManager.GetCollaborationsForGroupAsync(this._id.Value, offset: (int)offset);
            }, base.PrintCollaboration, limit);
        }
    }
}
