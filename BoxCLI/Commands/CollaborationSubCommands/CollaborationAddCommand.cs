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
    public class CollaborationAddCommand : CollaborationSubCommandBase
    {
        private CommandArgument _id;
        private CommandOption _path;
        private CommandArgument _type;
        private CommandLineApplication _app;
        public CollaborationAddCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names, BoxType t)
            : base(boxPlatformBuilder, home, names, t)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Create a collaboration for a Box item.";
            _path = FilePathOption.ConfigureOption(command);
            _id = command.Argument("boxItemId",
                                   "Id of the Box item");
            if(base._t == BoxType.enterprise)
            {
                _type = command.Argument("boxItemType", "Type of Box item");
            }

            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunCreate();
            return await base.Execute();
        }

        private async Task RunCreate()
        {
            if(string.IsNullOrEmpty(this._id.Value) && string.IsNullOrEmpty(this._path.Value()))
            {
                this._app.ShowHelp();
            }
            if(!string.IsNullOrEmpty(this._type.Value))
            {
                var type = base.ProcessType(this._type.Value);
                await base.ProcessCollaborationsFromFile(_id.Value, _path.Value(), type, _asUser.Value());
            }
            if (!string.IsNullOrEmpty(_path.Value()))
            {
                await base.ProcessCollaborationsFromFile(_id.Value, _path.Value(), base._t, _asUser.Value());
            }
        }
    }
}