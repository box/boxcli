using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Box.V2;
using Box.V2.Config;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandModels;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.CsvModels;
using BoxCLI.CommandUtilities.Globalization;
using CsvHelper;
using Microsoft.Extensions.CommandLineUtils;
using Newtonsoft.Json;

namespace BoxCLI.Commands.UserSubCommands
{
    public class UserSubCommandBase : BoxBaseCommand
    {
        protected readonly List<string> _fields;
        protected CommandOption _asUser;
        private CommandLineApplication _app;

        public UserSubCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _fields = new List<string>()
            {
                "name",
                "login",
                "enterprise",
                "status",
                "role",
                "address",
                "phone",
                "job_title",
                "language",
                "avatar_url",
                "created_at",
                "modified_at",
                "max_upload_size",
                "space_amount",
                "space_used",
                // "tracking_codes",
                "is_platform_access_only",
                "is_sync_enabled",
                "is_exempt_from_login_verification",
                "is_exempt_from_device_limits",
                "can_see_managed_users"
            };
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            _asUser = AsUserOption.ConfigureOption(command);
            base.Configure(command);
        }

        public virtual void PrintUserInfo(BoxUser user, bool json = false)
        {
            if (json)
            {
                base.OutputJson(user);
                return;
            }
            else
            {
                this.PrintUserInfo(user);
            }
        }

        public virtual void PrintUserInfo(BoxUser user)
        {
            Reporter.WriteInformation("----Information about this user----");
            if (user.IsPlatformAccessOnly == true)
            {
                Reporter.WriteInformation("User is an App User");
            }
            if (user.Login.Contains("AutomationUser") && user.Login.Contains("@boxdevedition.com"))
            {
                Reporter.WriteInformation("User is a Service Account");
            }
            Reporter.WriteInformation($"User Id: {user.Id}");
            Reporter.WriteInformation($"User Status: {user.Status}");
            Reporter.WriteInformation($"User Type: {user.Type}");
            Reporter.WriteInformation($"User Name: {user.Name}");
            Reporter.WriteInformation($"User Login: {user.Login}");
            if (user.Enterprise != null)
            {
                Reporter.WriteInformation($"Enterprise this User Belongs to: {user.Enterprise.Name}");
                Reporter.WriteInformation($"Enterprise this User Belongs to: {user.Enterprise.Id}");
                Reporter.WriteInformation($"Enterprise this User Belongs to: {user.Enterprise.Type}");
            }
            Reporter.WriteInformation($"User Address: {user.Address}");
            Reporter.WriteInformation($"User Phone: {user.Phone}");
            Reporter.WriteInformation($"User Language: {user.Language}");
            Reporter.WriteInformation($"User Role: {user.Role}");
            Reporter.WriteInformation($"User Job Title: {user.JobTitle}");
            Reporter.WriteInformation($"User Max Upload Size: {user.MaxUploadSize}");
            Reporter.WriteInformation($"User Space Alloted: {user.SpaceAmount}");
            Reporter.WriteInformation($"User Space Used: {user.SpaceUsed}");
        }

        protected void CheckForUserId(string id, CommandLineApplication app)
        {
            if (string.IsNullOrEmpty(id))
            {
                app.ShowHelp();
                throw new Exception("A user ID is required for this command.");
            }
        }

        protected void PrintAliases(BoxCollection<BoxEmailAlias> aliases)
        {
            Reporter.WriteInformation($"User has a total of {aliases.TotalCount} email aliases");
            for (int i = 0; i < aliases.TotalCount; i++)
            {
                Reporter.WriteInformation($"Email Alias Information");
                Reporter.WriteInformation($"Email Alias:       {aliases.Entries[i].Email}");
                Reporter.WriteInformation($"Aliases Confirmed: {aliases.Entries[i].IsConfirmed}");
                Reporter.WriteInformation($"Alias ID:          {aliases.Entries[i].Id}");
            }
        }

        protected async Task CreateUsersFromFile(string path, string asUser = "",
            bool save = false, string overrideSavePath = "", string overrideSaveFileFormat = "", bool json = false)
        {
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: this._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            path = GeneralUtilities.TranslatePath(path);
            try
            {
                var userRequests = base.ReadFile<BoxUserRequest, BoxUserRequestMap>(path);
                foreach (var userRequest in userRequests)
                {
                    var createdUser = await boxClient.UsersManager.CreateEnterpriseUserAsync(userRequest);
                    PrintUserInfo(createdUser, json);
                }
            }
            catch (Exception e)
            {
                Reporter.WriteError(e.Message);
            }
        }

        protected BoxUserRequest CreateUserRequest(string name = "", string userId = "", string role = "", bool removeFromEnterprise = false,
            string language = "", string jobTitle = "", string phoneNumber = "", string address = "", string spaceAmount = "", string status = "",
            bool syncDisable = false, bool syncEnable = false, bool isExemptFromDeviceLimits = false, bool notExemptFromDeviceLimits = false,
            bool isExemptFromLoginVerificaton = false, bool notExemptFromLoginVerification = false, bool isPasswordResetRequired = false, string login = "")
        {
            if (syncDisable && syncEnable)
            {
                throw new Exception("--sync-disable and --sync-enable cannot be passed in a single call");
            }
            if (isExemptFromDeviceLimits && notExemptFromDeviceLimits)
            {
                throw new Exception("--is-exempt-from-device-limits and --not-exempt-from-device-limits cannot be passed in a single call");
            }
            if (isExemptFromLoginVerificaton && notExemptFromLoginVerification)
            {
                throw new Exception("--is-exempt-login-verification and --not-exempt-login-verification cannot be passed in a single call");
            }

            BoxUserRequest userRequest = new BoxUserRequest();
            if (!string.IsNullOrEmpty(login)) { userRequest.Login = login; }
            if (!string.IsNullOrEmpty(userId)) { userRequest.Id = userId; }
            if (removeFromEnterprise) { userRequest.Enterprise = "null"; }
            if (!string.IsNullOrEmpty(name)) { userRequest.Name = name; }
            if (!string.IsNullOrEmpty(role))
            {
                if (!(role == "user" || role == "coadmin")) { throw new Exception("Role must be coadmin or user."); }
                userRequest.Role = role;
            }
            if (!string.IsNullOrEmpty(language)) { userRequest.Language = language; }
            if (syncEnable) { userRequest.IsSyncEnabled = true; }
            if (syncDisable) { userRequest.IsSyncEnabled = false; }
            if (!string.IsNullOrEmpty(jobTitle)) { userRequest.JobTitle = jobTitle; }
            if (!string.IsNullOrEmpty(phoneNumber)) { userRequest.Phone = phoneNumber; }
            if (!string.IsNullOrEmpty(address)) { userRequest.Address = address; }
            if (!string.IsNullOrEmpty(spaceAmount)) { userRequest.SpaceAmount = double.Parse(spaceAmount); }
            if (!string.IsNullOrEmpty(status)) { userRequest.Status = status; }
            if (isExemptFromDeviceLimits) { userRequest.IsExemptFromDeviceLimits = true; }
            if (notExemptFromDeviceLimits) { userRequest.IsExemptFromDeviceLimits = false; }
            if (isExemptFromLoginVerificaton) { userRequest.IsExemptFromLoginVerification = true; }
            if (notExemptFromLoginVerification) { userRequest.IsExemptFromLoginVerification = false; }
            if (isPasswordResetRequired) { userRequest.IsPasswordResetRequired = true; }

            return userRequest;
        }
    }
}