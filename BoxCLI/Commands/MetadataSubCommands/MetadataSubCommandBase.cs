using System;
using System.Collections.Generic;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.MetadataSubCommands
{
    public class MetadataSubCommandBase : BoxBaseCommand
    {
        protected CommandOption _asUser;
        protected readonly BoxType _t;
        public MetadataSubCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names, BoxType t)
            : base(boxPlatformBuilder, home, names)
        {
            _t = t;
        }

        public override void Configure(CommandLineApplication command)
        {
            _asUser = AsUserOption.ConfigureOption(command);
            base.Configure(command);
        }

        protected virtual void CheckForScope(string scope, CommandLineApplication app)
        {
            if (string.IsNullOrEmpty(scope))
            {
                app.ShowHelp();
                throw new Exception("The scope of the metadata object is required for this command.");
            }
        }

        protected virtual void CheckForTemplate(string template, CommandLineApplication app)
        {
            if (string.IsNullOrEmpty(template))
            {
                app.ShowHelp();
                throw new Exception("The key of the template is required for this command.");
            }
        }

        protected virtual Dictionary<string, object> MetadataKeyValuesFromConsole()
        {
            var q = "";
            var key = "";
            var val = "";
            var md = new Dictionary<string, object>();
            do
            {
                if (md.Count > 0)
                {
                    Reporter.WriteInformation("Current metadata object:");
                    foreach (var k in md.Keys)
                    {
                        Reporter.WriteInformation($"Key: {k} - Value: {md[k]}");
                    }
                }
                Reporter.WriteInformation("Enter the metadata key:");
                key = Console.ReadLine();
                Reporter.WriteInformation("Enter the metadata value:");
                val = Console.ReadLine();
                md.Add(key, val);
                Reporter.WriteInformation("Enter to continue, q to quit.");
                q = Console.ReadLine().ToLower();
            }
            while (q != "q");
            Reporter.WriteSuccess("Finished building metadata.");
            return md;
        }

        protected virtual void PrintMetadataCollection(BoxMetadataTemplateCollection<Dictionary<string, object>> mdt)
        {
            foreach (var md in mdt.Entries)
            {
                this.PrintMetadata(md);
            }
        }
        protected virtual void PrintMetadata(Dictionary<string, object> md)
        {
            foreach (var key in md.Keys)
            {
                Reporter.WriteInformation($"{key}: {md[key]}");
            }
        }
    }
}