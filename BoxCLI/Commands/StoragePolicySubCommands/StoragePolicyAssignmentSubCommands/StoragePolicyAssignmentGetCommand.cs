using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.StoragePolicySubCommands.StoragePolicyAssignmentSubCommands
{
    public class StoragePolicyAssignmentGetCommand : StoragePolicyAssignmentSubCommandBase
    {
        private CommandArgument _assignmentId;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public StoragePolicyAssignmentGetCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get information about a storage policy assignment.";
            _assignmentId = command.Argument("assignmentId",
                                   "Id of the storage policy assignment");

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
            base.CheckForValue(this._assignmentId.Value, this._app, "A storage policy assignment ID is required for this command.");
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var assignment = await boxClient.StoragePoliciesManager.GetAssignmentAsync(_assignmentId.Value);
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(assignment);
                return;
            }
            base.PrintStoragePolicyAssignment(assignment);
        }
    }
}