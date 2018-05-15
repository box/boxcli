using System.Threading.Tasks;
using Box.V2.Models;
using Box.V2.Models.Request;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.StoragePolicySubCommands.StoragePolicyAssignmentSubCommands
{
    public class StoragePolicyAssignmentCreateCommand : StoragePolicyAssignmentSubCommandBase
    {
        private CommandArgument _userId;
        private CommandArgument _storagePolicyId;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public StoragePolicyAssignmentCreateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Assign a storage policy to a user.";
            _userId = command.Argument("userId",
                                   "Id of user");
            _storagePolicyId = command.Argument("storagePolicyId",
                                   "Id of storage policy");

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
            base.CheckForValue(this._userId.Value, this._app, "A user ID is required for this command.");
            base.CheckForValue(this._storagePolicyId.Value, this._app, "A group ID is required for this command.");

            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var assignment = await boxClient.StoragePoliciesManager.CreateAssignmentAsync(_userId.Value, _storagePolicyId.Value);
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(assignment);
                return;
            }
            base.PrintStoragePolicyAssignment(assignment);
        }
    }
}