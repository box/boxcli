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
            command.Description = "Get information about a metadata template.";
            _scope = command.Argument("scope",
                                   "The scope of the metadata template");
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
            base.CheckForScope(this._scope.Value, this._app);
            base.CheckForTemplate(this._template.Value, this._app);
            var boxClient = base.ConfigureBoxClient(returnServiceAccount: true);
            var template = await boxClient.MetadataManager.GetMetadataTemplate(this._scope.Value, this._template.Value);
            if (base._json.HasValue())
            {
                base.OutputJson(template);
                return;
            }
            base.PrintMetadataTemplate(template);
        }
    }
}