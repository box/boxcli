using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.StoragePolicySubCommands.StoragePolicyAssignmentSubCommands
{
    public class StoragePolicyAssignmentLookupCommand : StoragePolicyAssignmentSubCommandBase
    {
        private CommandArgument _type;
        private CommandArgument _id;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public StoragePolicyAssignmentLookupCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Look up which storage policy an object is assigned to.";
            _id = command.Argument("id", "Id of the object to look up");
            _type = command.Argument("type",
                                     "Type of object to look up (default: user)");

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
            base.CheckForValue(this._id.Value, this._app, "A lookup ID is required for this command.");
            var type = "user";
            if (!string.IsNullOrEmpty(this._type.Value))
            {
                type = this._type.Value;
            }
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var assignment = await boxClient.StoragePoliciesManager.GetAssignmentForTargetAsync(_id.Value, type);
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(assignment);
                return;
            }
            base.PrintStoragePolicyAssignment(assignment);
        }
    }
}