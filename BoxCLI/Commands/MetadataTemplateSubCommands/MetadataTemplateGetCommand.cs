using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.MetadataTemplateSubCommands
{
    public class MetadataTemplateGetCommand : MetadataTemplateSubCommandBase
    {
        private CommandArgument _scope;
        private CommandArgument _template;
        private CommandLineApplication _app;
        public MetadataTemplateGetCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get information about a metadata object.";
            _scope = command.Argument("scope",
                                   "The scope of the metadata object");
            _template = command.Argument("template",
                                   "The key of the template");

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
            var boxClient = base.ConfigureBoxClient(returnAdmin: true);
            base.PrintMetadataTemplate(await boxClient.MetadataManager.GetMetadataTemplate(this._scope.Value, this._template.Value));
        }
    }
}