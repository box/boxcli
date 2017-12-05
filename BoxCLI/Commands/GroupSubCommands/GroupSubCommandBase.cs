using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Box.V2.Models;
using Box.V2.Models.Request;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.CsvModels;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.GroupSubCommands
{
    public class GroupSubCommandBase : BoxBaseCommand
    {
        protected CommandOption _asUser;
        protected readonly List<string> _levels;
        public GroupSubCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _levels = new List<string>
            {
                "admins_only",
                "admins_and_members",
                "all_managed_users"
            };
        }

        public override void Configure(CommandLineApplication command)
        {
            _asUser = AsUserOption.ConfigureOption(command);
            base.Configure(command);
        }

        protected virtual string CheckInvitabilityLevel(string i)
        {
            if (!this._levels.Contains(i))
            {
                throw new Exception("Not a valid invitability level value. Use admins_only, admins_and_members, or all_managed_users.");
            }
            return i;
        }
        protected virtual string CheckViewMembersLevel(string m)
        {
            if (!this._levels.Contains(m))
            {
                throw new Exception("Not a valid member viewability level value. Use admins_only, admins_and_members, or all_managed_users.");
            }
            return m;
        }
        protected virtual void PrintGroup(BoxGroup g, bool json)
        {
            if (json)
            {
                base.OutputJson(g);
                return;
            }
            else
            {
                this.PrintGroup(g);
            }
        }
        protected virtual void PrintGroup(BoxGroup g)
        {
            Reporter.WriteInformation($"ID: {g.Id}");
            Reporter.WriteInformation($"Name: {g.Name}");
        }

        protected async Task CreateGroupsFromFile(string path,
            bool save = false, string overrideSavePath = "", string overrideSaveFileFormat = "", bool json = false)
        {
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: this._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            if (!string.IsNullOrEmpty(path))
            {
                path = GeneralUtilities.TranslatePath(path);
            }
            try
            {
                var groupRequests = base.ReadFile<BoxGroupRequest, BoxGroupRequestMap>(path);
                List<BoxGroup> saveCreated = new List<BoxGroup>();

                foreach (var groupRequest in groupRequests)
                {
                    BoxGroup createdGroup = null;
                    try
                    {
                        createdGroup = await boxClient.GroupsManager.CreateAsync(groupRequest);
                    }
                    catch (Exception e)
                    {
                        Reporter.WriteError("Couldn't create group...");
                        Reporter.WriteError(e.Message);
                    }
                    if (createdGroup != null)
                    {
                        this.PrintGroup(createdGroup, json);
                        if (save || !string.IsNullOrEmpty(overrideSavePath) || base._settings.GetAutoSaveSetting())
                        {
                            saveCreated.Add(createdGroup);
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
                    var fileName = $"{base._names.CommandNames.Groups}-{base._names.SubCommandNames.Create}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
                    base.WriteListResultsToReport<BoxGroup, BoxGroupMap>(saveCreated, fileName, savePath, fileFormat);
                }
            }
            catch (Exception e)
            {
                Reporter.WriteError(e.Message);
            }
        }
    }
}