using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Box.V2.Models;
using Box.V2.Models.Request;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CsvModels;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.GroupSubCommands.GroupMembershipSubCommands
{
    public class GroupMembershipSubCommandBase : GroupSubCommandBase
    {
        public GroupMembershipSubCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }

        protected virtual void PrintGroupMember(BoxGroupMembership g, bool json)
        {
            if (json)
            {
                base.OutputJson(g);
                return;
            }
            else
            {
                this.PrintGroupMember(g);
            }
        }

        protected virtual void PrintGroupMember(BoxGroupMembership g)
        {
            Reporter.WriteInformation($"ID: {g.Id}");
            Reporter.WriteInformation("Group: ");
            base.PrintGroup(g.Group);
            Reporter.WriteInformation("Group Member: ");
            Reporter.WriteInformation($"Role: {g.Role}");
            base.PrintMiniUser(g.User);
        }

        protected async Task CreateGroupMembershipsFromFile(string path,
            bool save = false, string overrideSavePath = "", string overrideSaveFileFormat = "", 
            bool json = false)
        {
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: this._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            if (!string.IsNullOrEmpty(path))
            {
                path = GeneralUtilities.TranslatePath(path);
            }
            try
            {
                var groupMembershipRequests = base.ReadFile<BoxGroupMembershipRequest, BoxGroupMembershipRequestMap>(path);
                List<BoxGroupMembership> saveCreated = new List<BoxGroupMembership>();

                foreach (var groupMembershipRequest in groupMembershipRequests)
                {
                    BoxGroupMembership createdGroupMembership = null;
                    try
                    {
                        createdGroupMembership = await boxClient.GroupsManager.AddMemberToGroupAsync(groupMembershipRequest);
                    }
                    catch (Exception e)
                    {
                        Reporter.WriteError("Couldn't create group membership...");
                        Reporter.WriteError(e.Message);
                    }
                    if (createdGroupMembership != null)
                    {
                        this.PrintGroupMember(createdGroupMembership, json);
                        if (save || !string.IsNullOrEmpty(overrideSavePath) || base._settings.GetAutoSaveSetting())
                        {
                            saveCreated.Add(createdGroupMembership);
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
                    var fileName = $"{base._names.CommandNames.GroupMembership}-{base._names.SubCommandNames.Create}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
                    base.WriteListResultsToReport<BoxGroupMembership, BoxGroupMembershipMap>(saveCreated, fileName, savePath, fileFormat);
                }
            }
            catch (Exception e)
            {
                Reporter.WriteError(e.Message);
            }
        }
        protected async Task UpdateGroupMembershipsFromFile(string path,
            bool save = false, string overrideSavePath = "", string overrideSaveFileFormat = "", 
            bool json = false)
        {
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: this._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            if (!string.IsNullOrEmpty(path))
            {
                path = GeneralUtilities.TranslatePath(path);
            }
            try
            {
                var groupMembershipRequests = base.ReadFile<BoxGroupMembership, BoxGroupMembershipUpdateRequestMap>(path);
                List<BoxGroupMembership> saveUpdated = new List<BoxGroupMembership>();

                foreach (var groupMembershipRequest in groupMembershipRequests)
                {
                    BoxGroupMembership updatedGroupMembership = null;
                    try
                    {
                        updatedGroupMembership = await boxClient.GroupsManager.UpdateGroupMembershipAsync(groupMembershipRequest.Id, new BoxGroupMembershipRequest()
                        {
                            Role = groupMembershipRequest.Role
                        });
                    }
                    catch (Exception e)
                    {
                        Reporter.WriteError("Couldn't update group membership...");
                        Reporter.WriteError(e.Message);
                    }
                    if (updatedGroupMembership != null)
                    {
                        this.PrintGroupMember(updatedGroupMembership, json);
                        if (save || !string.IsNullOrEmpty(overrideSavePath) || base._settings.GetAutoSaveSetting())
                        {
                            saveUpdated.Add(updatedGroupMembership);
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
                    var fileName = $"{base._names.CommandNames.GroupMembership}-{base._names.SubCommandNames.Update}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
                    base.WriteListResultsToReport<BoxGroupMembership, BoxGroupMembershipMap>(saveUpdated, fileName, savePath, fileFormat);
                }
            }
            catch (Exception e)
            {
                Reporter.WriteError(e.Message);
            }
        }
    }
}