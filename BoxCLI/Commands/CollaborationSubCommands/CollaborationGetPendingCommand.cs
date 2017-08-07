using System;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.CsvModels;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.CollaborationSubCommands
{
    public class CollaborationGetPendingCommand : CollaborationSubCommandBase
    {
        private CommandOption _save;
        private CommandOption _fileFormat;
        private CommandLineApplication _app;
        public CollaborationGetPendingCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names, BoxType t)
            : base(boxPlatformBuilder, home, names, t)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "List all pending collaborations for a user.";
            _save = SaveOption.ConfigureOption(command);
            _fileFormat = FileFormatOption.ConfigureOption(command);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunGetPending();
            return await base.Execute();
        }

        private async Task RunGetPending()
        {
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            var collabs = await boxClient.CollaborationsManager.GetPendingCollaborationAsync();
            if (_save.HasValue())
            {
                var fileName = $"{base._names.CommandNames.Collaborations}-{base._names.SubCommandNames.GetPending}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
                Reporter.WriteInformation("Saving file...");

                var saved = base.WriteOffsetCollectionResultsToReport<BoxCollaboration, BoxCollaborationMap>(collabs, fileName, fileFormat: this._fileFormat.Value());
                Reporter.WriteInformation($"File saved: {saved}");
                return;
            }


            base.PrintCollaborations(collabs);
        }
    }
}
