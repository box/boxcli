using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.CollaborationSubCommands
{
    public class CollaborationDeleteCommand : CollaborationSubCommandBase
    {
        private CommandArgument _id;
        private CommandLineApplication _app;
        public CollaborationDeleteCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names, BoxType t)
            : base(boxPlatformBuilder, home, names, t)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Remove a collaboration";
            _id = command.Argument("collaborationId",
                                   "ID of the collaboration");

            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunDelete();
            return await base.Execute();
        }

        private async Task RunDelete()
        {

            base.CheckForValue(this._id.Value, this._app, "A collaboration ID is required for this command.");
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            var result = await boxClient.CollaborationsManager.RemoveCollaborationAsync(this._id.Value);
            if(result)
            {
                Reporter.WriteSuccess($"Collaboration {this._id.Value} successfully removed");
            }
            else
            {
                Reporter.WriteSuccess($"Couldn't remove collaboration {this._id.Value}");
            }
        }
    }
}