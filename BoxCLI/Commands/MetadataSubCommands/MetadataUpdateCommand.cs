using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.MetadataSubCommands
{
    public class MetadataUpdateCommand : MetadataSubCommandBase
    {
        private CommandArgument _id;
        private CommandArgument _scope;
        private CommandArgument _template;
        private CommandOption _add;
        private CommandOption _replace;
        private CommandOption _remove;
        private CommandOption _test;
        private CommandOption _move;
        private CommandOption _copy;
        private CommandOption _path;
        private CommandOption _value;
        private CommandOption _from;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public MetadataUpdateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names, BoxType t)
            : base(boxPlatformBuilder, home, names, t)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Update metadata object.";
            _id = command.Argument("boxItemId",
                                   "Id of the Box item");
            _scope = command.Argument("scope",
                                   "The scope of the metadata object");
            _template = command.Argument("template",
                                   "The key of the template");
            _add = command.Option("-a|--add", "Add operation", CommandOptionType.NoValue);
            _copy = command.Option("-c|--copy", "Copy operation", CommandOptionType.NoValue);
            _from = command.Option("-f|--from", "Required for move or copy. The path that designates the source key, in the format of a JSON-Pointer.", CommandOptionType.SingleValue);
            _move = command.Option("-m|--move", "Move operation", CommandOptionType.NoValue);
            _path = command.Option("-p|--path", "The path that designates the key, in the format of a JSON-Pointer", CommandOptionType.SingleValue);
            _remove = command.Option("--remove", "Remove operation", CommandOptionType.NoValue);
            _replace = command.Option("--replace", "Replace operation", CommandOptionType.NoValue);
            _test = command.Option("-t|--test", "Test operation", CommandOptionType.NoValue);
            _value = command.Option("-v|--value", "The value to be set or tested. Required for add, replace, and test operations.", CommandOptionType.SingleValue);

            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunUpdate();
            return await base.Execute();
        }

        private async Task RunUpdate()
        {
            base.CheckForId(this._id.Value, this._app);
            base.CheckForScope(this._scope.Value, this._app);
            base.CheckForTemplate(this._template.Value, this._app);
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            var updates = ProcessMetadataUpdate();
            Dictionary<string, object> metadata;
            if (base._t == BoxType.file)
            {
                metadata = await boxClient.MetadataManager.UpdateFileMetadataAsync(this._id.Value, updates, this._scope.Value, this._template.Value);
            }
            else if (base._t == BoxType.folder)
            {
                metadata = await boxClient.MetadataManager.UpdateFolderMetadataAsync(this._id.Value, updates, this._scope.Value, this._template.Value);
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
            base.PrintMetadata(metadata);
        }

        private List<BoxMetadataUpdate> ProcessMetadataUpdate()
        {
            var updates = new List<BoxMetadataUpdate>();
            var update = new BoxMetadataUpdate();
            if (this._add.HasValue())
            {
                update.Op = MetadataUpdateOp.add;
            }
            else if (this._copy.HasValue())
            {
                update.Op = MetadataUpdateOp.copy;
            }
            else if (this._move.HasValue())
            {
                update.Op = MetadataUpdateOp.move;
            }
            else if (this._remove.HasValue())
            {
                update.Op = MetadataUpdateOp.remove;
            }
            else if (this._replace.HasValue())
            {
                update.Op = MetadataUpdateOp.replace;
            }
            else if (this._test.HasValue())
            {
                update.Op = MetadataUpdateOp.test;
            }
            else
            {
                throw new Exception("You must select an op for this command");
            }

            update.Path = this._path.Value();
            update.From = this._from.Value();
            update.Value = this._value.Value();
            updates.Add(update);
            return updates;
        }
    }
}