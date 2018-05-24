using System;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
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

            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                var storagePolicies = await boxClient.StoragePoliciesManager.GetListStoragePoliciesAsync(autoPaginate: true);
                base.OutputJson(storagePolicies);
                return;
            }
            var BoxCollectionsIterators = base.GetIterators(!String.IsNullOrEmpty(base._oneUseToken.Value()));
            await BoxCollectionsIterators.ListMarkerCollectionToConsole<BoxStoragePolicy>((marker) =>
            {
                return boxClient.StoragePoliciesManager.GetListStoragePoliciesAsync(limit: 100, marker: marker);
            }, base.PrintStoragePolicy);
        }
    }
}