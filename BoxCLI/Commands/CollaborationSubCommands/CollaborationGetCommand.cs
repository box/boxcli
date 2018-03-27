using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.CollaborationSubCommands
{
    public class CollaborationGetCommand : CollaborationSubCommandBase
    {
        private CommandArgument _id;
        private CommandLineApplication _app;
        private CommandOption _fieldsOption;
        
        private IBoxHome _home;

        public CollaborationGetCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names, BoxType t)
            : base(boxPlatformBuilder, home, names, t)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get an individual collaboration.";
            _fieldsOption = FieldsOption.ConfigureOption(command);
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
            var fields = base.ProcessFields(this._fieldsOption.Value(), CollaborationSubCommandBase._fields);
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var result = await boxClient.CollaborationsManager.GetCollaborationAsync(this._id.Value, fields: fields);
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(result);
                return;
            }
            base.PrintCollaboration(result);
        }
    }
}