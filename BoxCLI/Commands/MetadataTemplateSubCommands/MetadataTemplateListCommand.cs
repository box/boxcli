using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.BoxPlatform.Utilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.MetadataTemplateSubCommands
{
    public class MetadataTemplateListCommand : MetadataTemplateSubCommandBase
    {
        private CommandLineApplication _app;
        public MetadataTemplateListCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get all metadata templates in your Enterprise.";

            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunList();
            return await base.Execute();
        }

        private async Task RunList()
        {
            var boxClient = base.ConfigureBoxClient(returnServiceAccount: true);
            var collection = await boxClient.MetadataManager.GetEnterpriseMetadataAsync();
            foreach(var template in collection.Entries)
            {
                base.PrintMetadataTemplate(template);
            }
        }
    }
}