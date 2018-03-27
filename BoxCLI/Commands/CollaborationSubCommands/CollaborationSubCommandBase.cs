using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Box.V2.Exceptions;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.CsvModels;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;
using Newtonsoft.Json.Linq;

namespace BoxCLI.Commands.CollaborationSubCommands
{
    public class CollaborationSubCommandBase : BoxBaseCommand
    {
        protected CommandOption _asUser;
        protected readonly BoxType _t;
        protected readonly static List<string> _fields = _fields = new List<string>()
        {
            "status",
            "accessible_by",
            "acknowledged_at",
            "item",
            "id",
            "created_at",
            "modified_at"
        };
        public CollaborationSubCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names, BoxType t)
            : base(boxPlatformBuilder, home, names)
        {
            _t = t;
        }

        public override void Configure(CommandLineApplication command)
        {
            _asUser = AsUserOption.ConfigureOption(command);
            base.Configure(command);
        }

        protected async Task ProcessAddCollaborationsFromFile(string path, BoxType t, 
            string command, List<string> fields,
            bool save = false, string overrideSavePath = "",
            string overrideSaveFileFormat = "", bool json = false)
        {
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: this._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var processedCollaborations = new List<BoxCollaboration>();
            if (!string.IsNullOrEmpty(path))
            {
                path = GeneralUtilities.TranslatePath(path);
            }
            try
            {
                var collaborationRequests = new List<BoxCollaborationRequest>();
                if (command.ToLower() == CollaborationAddCommand.commandName)
                {
                    collaborationRequests = base.ReadFile<BoxCollaborationRequest, BoxCollaborationRequestMap>(path);
                }
                else if (command.ToLower() == CollaborationUpdateCommand.commandName)
                {
                    collaborationRequests = base.ReadFile<BoxCollaborationRequest, BoxCollaborationUpdateRequestMap>(path);
                }
                else
                {
                    throw new Exception("Cannot use bulk-file-path with this command.");
                }

                foreach (var collaborationRequest in collaborationRequests)
                {
                    try
                    {

                        var createdCollaboration = new BoxCollaboration();
                        if (command.ToLower() == CollaborationAddCommand.commandName)
                        {
                            Reporter.WriteInformation($"Processing collaboration for item ID: {collaborationRequest.Item.Id}");
                            Reporter.WriteInformation($"Processing collaboration for item type: {collaborationRequest.Item.Type}");
                            createdCollaboration = await boxClient.CollaborationsManager.AddCollaborationAsync(collaborationRequest, fields: fields);
                        }
                        else if (command.ToLower() == CollaborationUpdateCommand.commandName)
                        {
                            Reporter.WriteInformation($"Processing update on collaboration ID: {collaborationRequest.Id}");
                            createdCollaboration = await boxClient.CollaborationsManager.EditCollaborationAsync(collaborationRequest, fields: fields);
                        }
                        else
                        {
                            throw new Exception("Cannot use bulk-file-path with this command.");
                        }
                        if (createdCollaboration != null)
                        {
                            this.PrintCollaboration(createdCollaboration, json);
                            if (save || !string.IsNullOrEmpty(overrideSavePath) || base._settings.GetAutoSaveSetting())
                            {
                                processedCollaborations.Add(createdCollaboration);
                            }
                        }
                    }
                    catch (BoxException e)
                    {
                        var errorMessage = JObject.Parse(e.Message);
                        var code = errorMessage.GetValue("code").ToString();
                        if (code == "user_already_collaborator" || code == "conflict")
                        {
                            Reporter.WriteWarning("Collaboration already exists...");

                            var existingCollaborations = new BoxCollection<BoxCollaboration>();
                            var itemId = collaborationRequest.Item.Id;
                            if (collaborationRequest.Item.Type == BoxType.folder)
                            {
                                existingCollaborations = await boxClient.FoldersManager.GetCollaborationsAsync(itemId, fields: fields);
                            }
                            else if (collaborationRequest.Item.Type == BoxType.file)
                            {
                                existingCollaborations = await boxClient.FilesManager.GetCollaborationsAsync(itemId, fields: fields);
                            }
                            else
                            {
                                throw e;
                            }

                            var existingCollab = new BoxCollaboration();
                            if (!string.IsNullOrEmpty(collaborationRequest.AccessibleBy.Id))
                            {
                                existingCollab = existingCollaborations.Entries.Find((collaboration) =>
                                {
                                    return collaboration.AccessibleBy.Id == collaborationRequest.AccessibleBy.Id;
                                });
                            }
                            else if (!string.IsNullOrEmpty(collaborationRequest.AccessibleBy.Login))
                            {
                                var user = (await boxClient.UsersManager.GetEnterpriseUsersAsync(filterTerm: collaborationRequest.AccessibleBy.Login)).Entries.FirstOrDefault();
                                if (user != null)
                                {
                                    existingCollab = existingCollaborations.Entries.Find((collaboration) =>
                                    {
                                        return collaboration.AccessibleBy.Id == user.Id;
                                    });
                                }
                                else
                                {
                                    throw e;
                                }
                            }
                            if (existingCollab != null)
                            {
                                processedCollaborations.Add(existingCollab);
                            }
                            else
                            {
                                throw e;
                            }
                        }
                        else
                        {
                            Reporter.WriteError("Failed processing on collaboration:");
                            if (!String.IsNullOrEmpty(collaborationRequest.Id))
                            {
                                Reporter.WriteError($"Collaboration ID: {collaborationRequest.Id}");
                            }
                            Reporter.WriteError($"Role: {collaborationRequest.Role}");
                            if (!String.IsNullOrEmpty(collaborationRequest.Status))
                            {
                                Reporter.WriteError($"Status: {collaborationRequest.Status}");
                            }
                            if (collaborationRequest.Item != null)
                            {
                                Reporter.WriteError($"Item ID: {collaborationRequest.Item.Id}");
                                Reporter.WriteError($"Item type: {collaborationRequest.Item.Type}");
                            }
                            if (collaborationRequest.AccessibleBy != null)
                            {
                                Reporter.WriteError($"Accessible by ID: {collaborationRequest.AccessibleBy.Id}");
                                Reporter.WriteError($"Accessible by type: {collaborationRequest.AccessibleBy.Type}");
                            }
                            Reporter.WriteError("Reason:");
                            Reporter.WriteError(e.Message);
                        }
                    }
                    catch (Exception e)
                    {
                        Reporter.WriteError("Failed processing on collaboration:");
                        if (!String.IsNullOrEmpty(collaborationRequest.Id))
                        {
                            Reporter.WriteError($"Collaboration ID: {collaborationRequest.Id}");
                        }
                        Reporter.WriteError($"Role: {collaborationRequest.Role}");
                        if (!String.IsNullOrEmpty(collaborationRequest.Status))
                        {
                            Reporter.WriteError($"Status: {collaborationRequest.Status}");
                        }
                        if (collaborationRequest.Item != null)
                        {
                            Reporter.WriteError($"Item ID: {collaborationRequest.Item.Id}");
                            Reporter.WriteError($"Item type: {collaborationRequest.Item.Type}");
                        }
                        if (collaborationRequest.AccessibleBy != null)
                        {
                            Reporter.WriteError($"Accessible by ID: {collaborationRequest.AccessibleBy.Id}");
                            Reporter.WriteError($"Accessible by type: {collaborationRequest.AccessibleBy.Type}");
                        }
                        Reporter.WriteError("Reason:");
                        Reporter.WriteError(e.Message);
                    }
                }
            }
            catch (Exception e)
            {
                Reporter.WriteError(e.Message);
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
                var fileName = String.Empty;
                if (command.ToLower() == CollaborationAddCommand.commandName)
                {
                    fileName = $"{base._names.CommandNames.Collaborations}-{base._names.SubCommandNames.Add}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
                }
                else if (command.ToLower() == CollaborationUpdateCommand.commandName)
                {
                    fileName = $"{base._names.CommandNames.Collaborations}-{base._names.SubCommandNames.Update}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
                }
                if (!String.IsNullOrEmpty(fileName))
                {
                    base.WriteListResultsToReport<BoxCollaboration, BoxCollaborationMap>(processedCollaborations, fileName, savePath, fileFormat);
                }
            }
        }

        protected virtual void PrintCollaborations(BoxCollection<BoxCollaboration> collabs)
        {
            if (collabs == null || collabs.Entries.Count == 0)
            {
                Reporter.WriteInformation("This item has no collaborations.");
            }
            foreach (var collab in collabs.Entries)
            {
                base.PrintCollaboration(collab);
            }
        }

        protected virtual string ProcessRoleOptions(CommandOption editor, CommandOption viewer,
            CommandOption uploader, CommandOption previewerUploader, CommandOption viewerUploader,
            CommandOption coOwner, CommandOption previewer, CommandOption owner = null)
        {
            bool isOwnerRole = false;
            if (owner != null)
            {
                isOwnerRole = owner.HasValue();
            }
            var roles = new Dictionary<string, bool>()
                {
                    {BoxCollaborationRoles.Editor, editor.HasValue()},
                    {BoxCollaborationRoles.Viewer, viewer.HasValue()},
                    {BoxCollaborationRoles.Uploader, uploader.HasValue()},
                    {BoxCollaborationRoles.PreviewerUploader, previewerUploader.HasValue()},
                    {BoxCollaborationRoles.ViewerUploader, viewerUploader.HasValue()},
                    {BoxCollaborationRoles.CoOwner, coOwner.HasValue()},
                    {BoxCollaborationRoles.Owner, isOwnerRole},
                    {BoxCollaborationRoles.Previewer, previewer.HasValue()},
                };
            var result = roles.First(x => x.Value == true);
            return result.Key.ToLower();
        }
    }
}