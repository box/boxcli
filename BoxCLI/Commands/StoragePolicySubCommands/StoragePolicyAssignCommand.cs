using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandModels;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.CsvModels;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.StoragePolicySubCommands
{
    public class StoragePolicyAssignCommand : StoragePolicySubCommandBase
    {
        private CommandArgument _policyId;
        private CommandArgument _userId;
        private CommandOption _save;
        private CommandOption _bulkPath;
        private CommandOption _fileFormat;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public StoragePolicyAssignCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get information about a storage policy.";
            _policyId = command.Argument("storagePolicyId",
                                   "Id of the storage policy");
            _userId = command.Argument("userId", 
                                   "Id of the user to assign the policy to");

            _bulkPath = BulkFilePathOption.ConfigureOption(command);
            _save = SaveOption.ConfigureOption(command);
            _fileFormat = FileFormatOption.ConfigureOption(command);

            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunAssign();
            return await base.Execute();
        }

        private async Task RunAssign()
        {
            if (this._bulkPath.HasValue())
            {
                var json = false;
                if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
                {
                    json = true;
                }
                await AssignStoragePoliciesFromFile(this._bulkPath.Value(), this._save.HasValue(),
                json: json, overrideSaveFileFormat: this._fileFormat.Value());
                return;
            }

            base.CheckForValue(this._policyId.Value, this._app, "A storage policy ID is required for this command");
            base.CheckForValue(this._userId.Value, this._app, "A user ID is required for this command");
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var assignment = await boxClient.StoragePoliciesManager.AssignAsync(_userId.Value, _policyId.Value);
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(assignment);
                return;
            }
            base.PrintStoragePolicyAssignment(assignment);
        }

        private async Task AssignStoragePoliciesFromFile(string path,
            bool save = false, string overrideSavePath = "", string overrideSaveFileFormat = "", bool json = false)
        {
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: this._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            if (!string.IsNullOrEmpty(path))
            {
                path = GeneralUtilities.TranslatePath(path);
            }
            try
            {
                var assignmentRequests = base.ReadFile<BoxStoragePolicyAssignmentRequest, BoxStoragePolicyAssignmentRequestMap>(path);
                var saveCreated = new List<BoxStoragePolicyAssignment>();

                foreach (var assignmentRequest in assignmentRequests)
                {
                    BoxStoragePolicyAssignment newAssignment = null;
                    try
                    {
                        newAssignment = await boxClient.StoragePoliciesManager.AssignAsync(assignmentRequest.UserId, assignmentRequest.StoragePolicyId);
                    }
                    catch (Exception e)
                    {
                        Reporter.WriteError($"Couldn't assign storage policy {assignmentRequest.StoragePolicyId} to user {assignmentRequest.UserId}...");
                        Reporter.WriteError(e.Message);
                    }
                    if (newAssignment != null)
                    {
                        base.PrintStoragePolicyAssignment(newAssignment, json);
                        if (save || !string.IsNullOrEmpty(overrideSavePath) || base._settings.GetAutoSaveSetting())
                        {
                            saveCreated.Add(newAssignment);
                        }
                    }
                }
                if (save || !string.IsNullOrEmpty(overrideSavePath) || base._settings.GetAutoSaveSetting())
                {
                    var fileFormat = base._settings.GetBoxReportsFileFormatSetting();
                    if (!string.IsNullOrEmpty(overrideSaveFileFormat))
                    {
                        fileFormat = overrideSaveFileFormat;
                    }
                    var savePath = base._settings.GetBoxReportsFolderPath();
                    if (!string.IsNullOrEmpty(overrideSavePath))
                    {
                        savePath = overrideSavePath;
                    }
                    var fileName = $"{base._names.CommandNames.StoragePolicy}-{base._names.SubCommandNames.Assign}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
                    base.WriteListResultsToReport<BoxStoragePolicyAssignment, BoxStoragePolicyAssignmentMap>(saveCreated, fileName, savePath, fileFormat);
                }
            }
            catch (Exception e)
            {
                Reporter.WriteError(e.Message);
            }
        }
    }
}