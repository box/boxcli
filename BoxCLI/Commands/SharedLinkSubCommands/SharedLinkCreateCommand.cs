using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.SharedLinkSubCommands
{
    public class SharedLinkCreateCommand : SharedLinkSubCommandBase
    {
        private CommandArgument _id;
        private CommandOption _path;
        private CommandLineApplication _app;
        public SharedLinkCreateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names, BoxType t)
            : base(boxPlatformBuilder, home, names, t)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Create a shared link for a Box item.";
            _path = FilePathOption.ConfigureOption(command);
            _id = command.Argument("boxItemId",
                                   "Id of the Box item");

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
            if (!string.IsNullOrEmpty(_path.Value()))
            {
                await base.ProcessSharedLinksFromFile(_id.Value, _path.Value(), base._t, _asUser.Value());
            }
        }
    }
}