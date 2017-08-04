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
                "tracking_codes",
                "is_platform_access_only",
                "is_sync_enabled",
                "is_exempt_from_login_verification",
                "is_exempt_from_device_limits",
                "can_see_managed_users"
            };
        }

        public virtual void PrintUserInfo(BoxUser user)
        {
            System.Console.WriteLine("----Information about this user----");
            if (user.IsPlatformAccessOnly == true)
            {
                System.Console.WriteLine("User is an App User");
            }
            if (user.Login.Contains("AutomationUser") && user.Login.Contains("@boxdevedition.com"))
            {
                System.Console.WriteLine("User is a Service Account");
            }
            System.Console.WriteLine($"User Id: {user.Id}");
            System.Console.WriteLine($"User Status: {user.Status}");
            System.Console.WriteLine($"User Type: {user.Type}");
            System.Console.WriteLine($"User Name: {user.Name}");
            System.Console.WriteLine($"User Login: {user.Login}");
            if (user.Enterprise != null)
            {
                System.Console.WriteLine($"Enterprise this User Belongs to: {user.Enterprise.Name}");
                System.Console.WriteLine($"Enterprise this User Belongs to: {user.Enterprise.Id}");
                System.Console.WriteLine($"Enterprise this User Belongs to: {user.Enterprise.Type}");
            }
            System.Console.WriteLine($"User Address: {user.Address}");
            System.Console.WriteLine($"User Phone: {user.Phone}");
            System.Console.WriteLine($"User Language: {user.Language}");
            System.Console.WriteLine($"User Role: {user.Role}");
            System.Console.WriteLine($"User Job Title: {user.JobTitle}");
            System.Console.WriteLine($"User Max Upload Size: {user.MaxUploadSize}");
            System.Console.WriteLine($"User Space Alloted: {user.SpaceAmount}");
            System.Console.WriteLine($"User Space Used: {user.SpaceUsed}");
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
            bool save = false, string overrideSavePath = "", string overrideSaveFileFormat = "")
        {
            var boxClient = base.ConfigureBoxClient(returnServiceAccount: true);
            path = GeneralUtilities.TranslatePath(path);
            System.Console.WriteLine($"Path: {path}");
            try
            {
                System.Console.WriteLine("Reading file...");
                var userRequests = base.ReadFile<BoxUserRequest, BoxUserRequestMap>(path);
                System.Console.WriteLine($"User Requests: {userRequests}");
                System.Console.WriteLine($"User Requests: {userRequests.Count}");
                System.Console.WriteLine($"User Requests: {userRequests.FirstOrDefault().Name}");
                foreach (var userRequest in userRequests)
                {
                    System.Console.WriteLine($"Processing a user request: {userRequest.Name}");
                    System.Console.WriteLine($"Processing a user request: {userRequest.Type}");
                    var createdUser = await boxClient.UsersManager.CreateEnterpriseUserAsync(userRequest);
                    PrintUserInfo(createdUser);
                }
                System.Console.WriteLine("Created all users...");
            }
            catch (Exception e)
            {
                System.Console.WriteLine(e.Message);
                Reporter.WriteError(e.Message);
            }
        }

        protected BoxUserRequest CreateUserRequest(string name = "", string userId = "", string role = "", bool removeFromEnterprise = false,
            string language = "", string jobTitle = "", string phoneNumber = "", string address = "", string spaceAmount = "", string status = "",
            bool syncDisable = false, bool syncEnable = false, bool isExemptFromDeviceLimits = false, bool notExemptFromDeviceLimits = false,
            bool isExemptFromLoginVerificaton = false, bool notExemptFromLoginVerification = false, bool isPasswordResetRequired = false)
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