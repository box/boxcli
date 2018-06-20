using System;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;
using Box.V2.Models;

namespace BoxCLI.Commands.StoragePolicySubCommands
{
    public class StoragePolicyListCommand : StoragePolicySubCommandBase
    {
        private CommandLineApplication _app;
        private IBoxHome _home;

        public StoragePolicyListCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "List available storage policies.";

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
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());

            var storagePolicies = await boxClient.StoragePoliciesManager.GetListStoragePoliciesAsync(autoPaginate: true);
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(storagePolicies);
                return;
            }
            foreach (var storagePolicy in storagePolicies.Entries)
            {
                base.PrintStoragePolicy(storagePolicy);
                Reporter.WriteInformation("");
            }
        }
    }
}