using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.MetadataSubCommands
{
    public class MetadataCreateCommand : MetadataSubCommandBase
    {
        private CommandArgument _id;
        private CommandArgument _scope;
        private CommandArgument _template;
        private CommandOption _bulkFilePath;
        private CommandOption _keyVal;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public MetadataCreateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names, BoxType t)
            : base(boxPlatformBuilder, home, names, t)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Add metadata to an item";
            _id = command.Argument("boxItemId",
                                   "Id of the Box item");
            _scope = command.Argument("scope",
                                   "The scope of the metadata object");
            _template = command.Argument("template",
                                   "The key of the template");
            _bulkFilePath = BulkFilePathOption.ConfigureOption(command);
            _keyVal = command.Option("--kv <KEYVALS>",
                "Metadata keys and values. Usage: key1=val1&key2=val2 Note: For float type, use \"f\" on end of digits, key1=1234f&key2=1234.50f",
                CommandOptionType.SingleValue);
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
            if (this._bulkFilePath.HasValue())
            {
                var json = false;
                if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
                {
                    json = true;
                }
                await base.AddMetadataToItemFromFile(this._bulkFilePath.Value(), json: json);
                return;
            }
            base.CheckForId(this._id.Value, this._app);
            base.CheckForScope(this._scope.Value, this._app);
            base.CheckForTemplate(this._template.Value, this._app);
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            Dictionary<string, object> metadata;
            if (this._keyVal.HasValue())
            {
                metadata = base.MetadataKeyValuesFromCommandOption(this._keyVal.Value());
            }
            else
            {
                metadata = base.MetadataKeyValuesFromConsole();
            }
            if (base._t == BoxType.file)
            {
                metadata = await boxClient.MetadataManager.CreateFileMetadataAsync(this._id.Value, metadata, this._scope.Value, this._template.Value);
            }
            else if (base._t == BoxType.folder)
            {
                metadata = await boxClient.MetadataManager.CreateFolderMetadataAsync(this._id.Value, metadata, this._scope.Value, this._template.Value);
            }
            else
            {
                throw new Exception("This item doesn't currently support metadata.");
            }
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(metadata);
                return;
            }
            Reporter.WriteSuccess("Created metadata.");
            base.PrintMetadata(metadata);
        }
    }
}