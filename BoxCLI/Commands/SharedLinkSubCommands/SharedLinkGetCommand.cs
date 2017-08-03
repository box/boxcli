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
        private CommandArgument _url;
        private CommandOption _password;
        private CommandLineApplication _app;
        public SharedLinkGetCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names, BoxType t)
            : base(boxPlatformBuilder, home, names, t)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            if (base._t == BoxType.enterprise)
            {
                command.Description = "Get information from a shared item URL.";
                _url = command.Argument("itemUrl",
                                       "Shared item url");
                _password = command.Option("--password",
                                       "Shared item password", CommandOptionType.SingleValue);
            }
            else
            {
                command.Description = "Get shared links on a Box item.";
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
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            var fields = new List<string>()
            {
                "shared_link"
            };
            if (base._t == BoxType.file)
            {
                base.PrintSharedLink((await boxClient.FilesManager.GetInformationAsync(this._id.Value, fields)).SharedLink);
            }
            else if (base._t == BoxType.folder)
            {
                base.PrintSharedLink((await boxClient.FoldersManager.GetInformationAsync(this._id.Value, fields)).SharedLink);
            }
            else if (base._t == BoxType.enterprise)
            {
                base.PrintItem(await boxClient.SharedItemsManager.SharedItemsAsync(this._url.Value, this._password.Value()));
            }
            else
            {
                throw new Exception("This item doesn't currently support shared links.");
            }

        }
    }
}