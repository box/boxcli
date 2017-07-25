using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.SharedLinkSubCommands
{
    public class SharedLinkGetCommand : SharedLinkSubCommandBase
    {
        private CommandArgument _id;
        private CommandLineApplication _app;
        public SharedLinkGetCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names, BoxType t)
            : base(boxPlatformBuilder, home, names, t)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get shared links on a Box item.";
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
            await this.RunGet();
            return await base.Execute();
        }

        private async Task RunGet()
        {
            System.Console.WriteLine("Running Get on Shared Links...");
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            BoxSharedLink link;
            var fields = new List<string>()
            {
                "shared_link"
            };
            if (base._t == BoxType.file)
            {
                System.Console.WriteLine($"Looking for Shared link on this file {this._id.Value}...");
                link = (await boxClient.FilesManager.GetInformationAsync(this._id.Value, fields)).SharedLink;
            }
            else if (base._t == BoxType.folder)
            {
                System.Console.WriteLine($"Looking for Shared link on this folder {this._id.Value}...");
                link = (await boxClient.FoldersManager.GetInformationAsync(this._id.Value, fields)).SharedLink;
            }
            else
            {
                throw new Exception("This item doesn't currently support metadata.");
            }
            base.PrintSharedLink(link);
        }
    }
}