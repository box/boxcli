using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.FolderSubCommands
{
    public class FolderChangeUploadEmailCommand : FolderSubCommandBase
    {
        private CommandArgument _folderId;
        private CommandArgument _access;
        private CommandOption _etag;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public FolderChangeUploadEmailCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Update the folder's upload email.";
            _folderId = command.Argument("folderId",
                               "Id of folder to update");
            _access = command.Argument("access", "Can be open or collaborators");
            _etag = command.Option("--etag", "Only update if etag value matches", CommandOptionType.SingleValue);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunChange();
            return await base.Execute();
        }

        private async Task RunChange()
        {
            base.CheckForId(this._folderId.Value, this._app);
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var email = new BoxFolderRequest()
            {
                Id = this._folderId.Value,
                FolderUploadEmail = new BoxEmailRequest()
                {
                    Access = this._access.Value,
                }
            };
            var changedEmail = await boxClient.FoldersManager.UpdateInformationAsync(email, etag: this._etag.Value());
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(changedEmail);
                return;
            }
            Reporter.WriteSuccess($"Updated folder's upload email {this._folderId.Value}");
            base.PrintFolder(changedEmail);
        }
    }
}