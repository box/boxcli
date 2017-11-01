using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.SharedLinkSubCommands
{
    public class SharedLinkDeleteCommand : SharedLinkSubCommandBase
    {
        private CommandArgument _id;
        private CommandArgument _type;
        private CommandOption _dontPrompt;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public SharedLinkDeleteCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names, BoxType t)
            : base(boxPlatformBuilder, home, names, t)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Delete a shared link for a Box item.";
            _dontPrompt = SuppressDeletePromptOption.ConfigureOption(command);
            _id = command.Argument("boxItemId",
                                   "Id of the Box item");

            if (base._t == BoxType.enterprise)
            {
                _type = command.Argument("itemType", "Type of item for shared link: either file or folder.");
            }
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunDelete();
            return await base.Execute();
        }

        private async Task RunDelete()
        {
            base.CheckForId(this._id.Value, this._app);
            if (base._t == BoxType.enterprise)
            {
                if (this._type.Value == String.Empty && this._type.Value != SharedLinkSubCommandBase.BOX_FILE && this._type.Value != SharedLinkSubCommandBase.BOX_FOLDER)
                {
                    _app.ShowHelp();
                    throw new Exception("You must provide an item type for this command: choose file or folder");
                }
            }
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            if (base._t == BoxType.file || (this._type != null && this._type.Value == SharedLinkSubCommandBase.BOX_FILE))
            {
                BoxFile sharedLinkDeleted;
                if (this._dontPrompt.HasValue())
                {
                    sharedLinkDeleted = await boxClient.FilesManager.DeleteSharedLinkAsync(this._id.Value);
                }
                else
                {
                    Reporter.WriteWarningNoNewLine("Are you sure you want to delete this shared link? y/N ");
                    var yNKey = "n";
                    yNKey = Console.ReadLine().ToLower();
                    if (yNKey != "y")
                    {
                        Reporter.WriteInformation("Aborted shared link deletion.");
                        return;
                    }
                    else
                    {
                        sharedLinkDeleted = await boxClient.FilesManager.DeleteSharedLinkAsync(this._id.Value);
                    }
                }
                if (sharedLinkDeleted.SharedLink == null)
                {
                    Reporter.WriteSuccess($"Shared link on file ID {this._id.Value} successfully removed");
                }
                else
                {
                    Reporter.WriteSuccess($"Couldn't remove shared link on file ID {this._id.Value}");
                }
                if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
                {
                    base.OutputJson(sharedLinkDeleted);
                    return;
                }
            }
            else if (base._t == BoxType.folder || (this._type != null && this._type.Value == SharedLinkSubCommandBase.BOX_FOLDER))
            {
                BoxFolder sharedLinkDeleted;
                if (this._dontPrompt.HasValue())
                {
                    sharedLinkDeleted = await boxClient.FoldersManager.DeleteSharedLinkAsync(this._id.Value);
                }
                else
                {
                    Reporter.WriteWarningNoNewLine("Are you sure you want to delete this shared link? y/N ");
                    var yNKey = "n";
                    yNKey = Console.ReadLine().ToLower();
                    if (yNKey != "y")
                    {
                        Reporter.WriteInformation("Aborted shared link deletion.");
                        return;
                    }
                    else
                    {
                        sharedLinkDeleted = await boxClient.FoldersManager.DeleteSharedLinkAsync(this._id.Value);
                    }
                }
                if (sharedLinkDeleted.SharedLink == null)
                {
                    Reporter.WriteSuccess($"Shared link on folder ID {this._id.Value} successfully removed");
                }
                else
                {
                    Reporter.WriteSuccess($"Couldn't remove shared link on folder ID {this._id.Value}");
                }
                if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
                {
                    base.OutputJson(sharedLinkDeleted);
                    return;
                }
            }
            else
            {
                throw new Exception("Box type not supported for this command.");
            }
        }
    }
}