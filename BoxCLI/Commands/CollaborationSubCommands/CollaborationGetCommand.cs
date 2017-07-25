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
            command.Description = "Get collaborations on a Box item.";
            if (base._t == BoxType.enterprise)
            {
                _id = command.Argument("boxCollaborationId",
                                       "Id of the collaboration");
            }
            else
            {
                _id = command.Argument("boxItemId",
                                       "Id of the Box item");
            }

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

            if (string.IsNullOrEmpty(this._id.Value))
            {
                this._app.ShowHelp();
                return;
            }
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            BoxCollection<BoxCollaboration> collabs;
            if (base._t == BoxType.file)
            {
                System.Console.WriteLine($"Looking for Collaborations on this file {this._id.Value}...");
                collabs = await boxClient.FilesManager.GetCollaborationsAsync(this._id.Value);
            }
            else if (base._t == BoxType.folder)
            {
                System.Console.WriteLine($"Looking for Collaborations on this folder {this._id.Value}...");
                collabs = await boxClient.FoldersManager.GetCollaborationsAsync(this._id.Value);
            }
            else
            {
                collabs = new BoxCollection<BoxCollaboration>();
                collabs.Entries = new List<BoxCollaboration>();
                collabs.Entries.Add(await boxClient.CollaborationsManager.GetCollaborationAsync(this._id.Value));
            }
            base.PrintCollaborations(collabs);
        }
    }
}