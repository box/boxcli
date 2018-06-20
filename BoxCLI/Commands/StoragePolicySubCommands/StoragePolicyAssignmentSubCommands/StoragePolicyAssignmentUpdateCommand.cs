using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.StoragePolicySubCommands.StoragePolicyAssignmentSubCommands
{
    public class StoragePolicyAssignmentUpdateCommand : StoragePolicyAssignmentSubCommandBase
    {
        private CommandArgument _assignmentId;
        private CommandArgument _storagePolicyId;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public StoragePolicyAssignmentUpdateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Update a storage policy assignment.";
            _assignmentId = command.Argument("assignmentId",
                                   "Id of the storage policy assignment");
            _storagePolicyId = command.Argument("storagePolicyId",
                                   "Id of the storage policy to assign");

            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunUpdate();
            return await base.Execute();
        }

        private async Task RunUpdate()
        {
            base.CheckForValue(this._assignmentId.Value, this._app, "A storage policy assignment ID is required for this command.");
            base.CheckForValue(this._storagePolicyId.Value, this._app, "A storage policy ID is required for this command.");
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var assignment = await boxClient.StoragePoliciesManager.UpdateStoragePolicyAssignment(_assignmentId.Value, _storagePolicyId.Value);
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(assignment);
                return;
            }
            base.PrintStoragePolicyAssignment(assignment);
        }
    }
}