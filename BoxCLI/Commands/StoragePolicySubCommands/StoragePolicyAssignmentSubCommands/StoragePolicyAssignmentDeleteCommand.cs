using System;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.StoragePolicySubCommands.StoragePolicyAssignmentSubCommands
{
    public class StoragePolicyAssignmentDeleteCommand : StoragePolicyAssignmentSubCommandBase
    {
        private CommandArgument _assignmentId;
        private CommandOption _bulkPath;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public StoragePolicyAssignmentDeleteCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Remove a storage policy assignment, returning the user to the enterprise default.";
            _assignmentId = command.Argument("assignmentId",
                                   "Id of the storage policy assignment");
            _bulkPath = BulkFilePathOption.ConfigureOption(command);

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
            base.CheckForValue(this._assignmentId.Value, this._app, "A storage policy assignment ID is required for this command.");
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            if (this._bulkPath.HasValue())
            {
                var path = GeneralUtilities.TranslatePath(this._bulkPath.Value());
                var ids = base.ReadFileForIds(path);
                foreach (var id in ids)
                {
                    try
                    {
                        if (await boxClient.StoragePoliciesManager.DeleteAssignmentAsync(id))
                        {
                            Reporter.WriteSuccess($"Deleted storage policy assignment {id}");
                        }
                    }
                    catch (Exception e)
                    {
                        Reporter.WriteError($"Error deleting storage policy assignment {id}.");
                        Reporter.WriteError(e.Message);
                    }
                }
                Reporter.WriteInformation("Finished deleting storage policy assignments...");
                return;
            }
            base.CheckForValue(this._assignmentId.Value, this._app, "A storage policy assignment ID is required for this command.");
            var result = await boxClient.StoragePoliciesManager.DeleteAssignmentAsync(this._assignmentId.Value);
            if (result)
            {
                Reporter.WriteSuccess($"Deleted storage policy assignment {this._assignmentId.Value}");
            }
            else
            {
                Reporter.WriteError($"Couldn't delete storage policy assignment {this._assignmentId.Value}");
            }
        }
    }
}