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
            for(int i=0; i<aliases.TotalCount; i++) 
            {
                Reporter.WriteInformation($"Email Alias Information");
                Reporter.WriteInformation($"Email Alias:       {aliases.Entries[i].Email}");
                Reporter.WriteInformation($"Aliases Confirmed: {aliases.Entries[i].IsConfirmed}");
                Reporter.WriteInformation($"Alias ID:          {aliases.Entries[i].Id}");
            }
        }
    }
}