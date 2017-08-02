using System;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.MetadataTemplateSubCommands
{
    public class MetadataTemplateCreateCommand : MetadataTemplateSubCommandBase
    {
        private CommandArgument _scope;
        private CommandArgument _name;
        private CommandOption _templateKey;
        private CommandOption _hidden;
        private CommandOption _bulkFilePaths;
        private CommandOption _bulkFilePath;
        private CommandLineApplication _app;
        public MetadataTemplateCreateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get information about a metadata template.";
            _scope = command.Argument("scope",
                                   "The scope of the metadata template");
            _name = command.Argument("displayName",
                                   "The display name of the template.");
            _templateKey = command.Option("--template-key", "A unique identifier for the template.", CommandOptionType.SingleValue);
            _hidden = command.Option("--hidden", "Whether this template is hidden in the UI.", CommandOptionType.NoValue);
            _bulkFilePaths = command.Option("--bulk-file-path-csv", 
                                    "Provide file paths for the metadata temple CSV file and metadata template fields CSV file", 
                                    CommandOptionType.MultipleValue);
            _bulkFilePath = BulkFilePathOption.ConfigureOption(command);
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
            if (this._bulkFilePaths.HasValue())
            {
                if(this._bulkFilePaths.Values.Count != 2)
                {
                    throw new Exception("CSV bulk upload requires 2 files");
                }
                await base.CreateMetadataTemplatesFromFile(this._bulkFilePaths.Values[0], this._bulkFilePaths.Values[1]);
                return;
            }
            if (this._bulkFilePath.HasValue())
            {
                return;
            }
            base.CheckForScope(this._scope.Value, this._app);
            base.CheckForName(this._name.Value, this._app);
            var boxClient = base.ConfigureBoxClient(returnServiceAccount: true);
            var template = new BoxMetadataTemplate();
            template.Scope = this._scope.Value;
            template.DisplayName = this._name.Value;
            template.Hidden = this._hidden.HasValue();
            template.TemplateKey = this._templateKey.Value();
            template.Fields = base.BuildTemplateFromConsole();

            base.PrintMetadataTemplate(await boxClient.MetadataManager.CreateMetadataTemplate(template));
        }
    }
}