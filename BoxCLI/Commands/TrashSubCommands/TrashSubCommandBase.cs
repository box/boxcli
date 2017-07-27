using System;
using System.Collections.Generic;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.TrashSubCommands
{
    public class TrashSubCommandBase : BoxBaseCommand
    {
        protected CommandOption _asUser;
        protected CommandOption _json;
        public TrashSubCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _asUser = AsUserOption.ConfigureOption(command);
            _json = OutputJsonOption.ConfigureOption(command);
            base.Configure(command);
        }

        protected virtual void CheckForType(string type, CommandLineApplication app)
        {
            var validTypes = new List<string>()
            {
                base._names.CommandNames.Files,
                base._names.CommandNames.Folders
            };
            if (!validTypes.Contains(type))
            {
                app.ShowHelp();
                var types = string.Join(" ", validTypes);
                throw new Exception($"One of the following types is required: {types}");
            }
        }
    }
}