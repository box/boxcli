using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.StoragePolicySubCommands
{
    public class StoragePolicyGetCommand : StoragePolicySubCommandBase
    {
        private CommandArgument _policyId;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public StoragePolicyGetCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get information about a storage policy.";
            _policyId = command.Argument("storagePolicyId",
                                   "Id of the storage policy");

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
            base.CheckForValue(this._policyId.Value, this._app, "A storage policy ID is required for this command");
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var storagePolicy = await boxClient.StoragePoliciesManager.GetStoragePolicyAsync(_policyId.Value);
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(storagePolicy);
                return;
            }
            base.PrintStoragePolicy(storagePolicy);
        }
    }
}