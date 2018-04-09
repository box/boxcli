using System;
using System.Threading.Tasks;
using Box.V2;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.GroupSubCommands
{
    public class GroupDeleteCommand : GroupSubCommandBase
    {
        private CommandArgument _groupId;

        private CommandOption _bulkPath;

        private CommandOption _dontPrompt;
        private CommandLineApplication _app;
        public GroupDeleteCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Delete a group.";
            _groupId = command.Argument("groupId",
                                   "Id of group");
            _bulkPath = BulkFilePathOption.ConfigureOption(command);
            _dontPrompt = SuppressDeletePromptOption.ConfigureOption(command);
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
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            if (this._bulkPath.HasValue())
            {
                var path = GeneralUtilities.TranslatePath(this._bulkPath.Value());
                var ids = base.ReadFileForIds(path);
                foreach (var id in ids)
                {
                    try
                    {
                        if (await this.DeleteGroup(boxClient, id))
                        {
                            Reporter.WriteSuccess($"Deleted group {id}");
                        }
                    }
                    catch (Exception e)
                    {
                        Reporter.WriteError($"Error deleting group {id}.");
                        Reporter.WriteError(e.Message);
                    }
                }
                Reporter.WriteInformation("Finished deleting groups...");
                return;
            }
            base.CheckForValue(this._groupId.Value, this._app, "A group ID is required for this command");

            bool result;
            if (this._dontPrompt.HasValue())
            {
                result = await this.DeleteGroup(boxClient, this._groupId.Value);
            }
            else
            {
                Reporter.WriteWarningNoNewLine("Are you sure you want to delete this group? y/N ");
                var yNKey = "n";
                yNKey = Console.ReadLine().ToLower();
                if (yNKey != "y")
                {
                    Reporter.WriteInformation("Aborted group deletion.");
                    return;
                }
                else
                {
                    result = await this.DeleteGroup(boxClient, this._groupId.Value);
                }
            }
            if (result)
            {
                Reporter.WriteSuccess($"Deleted group {this._groupId.Value}");
            }
            else
            {
                Reporter.WriteError($"Couldn't delete group {this._groupId.Value}");
            }
        }

        private async Task<bool> DeleteGroup(BoxClient boxClient, string groupId)
        {
            return await boxClient.GroupsManager.DeleteAsync(groupId);
        }
    }
}