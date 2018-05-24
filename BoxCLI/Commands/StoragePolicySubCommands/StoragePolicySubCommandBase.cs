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

namespace BoxCLI.Commands.StoragePolicySubCommands
{
    public class StoragePolicySubCommandBase : BoxBaseCommand
    {
        protected CommandOption _asUser;
        protected readonly List<string> _levels;
        public StoragePolicySubCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _asUser = AsUserOption.ConfigureOption(command);
            base.Configure(command);
        }

        protected virtual void PrintStoragePolicy(BoxStoragePolicy sp)
        {
            Reporter.WriteInformation($"ID: {sp.Id}");
            Reporter.WriteInformation($"Name: {sp.Name}");
        }

        protected virtual void PrintStoragePolicyAssignment(BoxStoragePolicyAssignment a, bool json = false)
        {
            if (json)
            {
                base.OutputJson(a);
                return;
            }
            else
            {
                Reporter.WriteInformation($"ID: {a.Id}");
                Reporter.WriteInformation($"Storage Policy ID: {a.BoxStoragePolicy.Id}");
                Reporter.WriteInformation($"Assigned To: {a.AssignedTo.Type} {a.AssignedTo.Id}");
            }
        }
    }
}