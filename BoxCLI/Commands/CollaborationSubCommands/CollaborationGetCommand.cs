using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.CollaborationSubCommands
{
    public class CollaborationGetCommand : CollaborationSubCommandBase
    {
        private CommandArgument _id;
        private CommandLineApplication _app;
        public CollaborationGetCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names, BoxType t)
            : base(boxPlatformBuilder, home, names, t)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get an individual collaboration.";
            _id = command.Argument("collaborationId",
                                   "Id of the collaboration");

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
            base.CheckForValue(this._id.Value, this._app, "A collaboration ID is required for this command.");
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            var result = await boxClient.CollaborationsManager.GetCollaborationAsync(this._id.Value);
            if (base._json.HasValue())
            {
                base.OutputJson(result);
                return;
            }
            base.PrintCollaboration(result);
        }
    }
}