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