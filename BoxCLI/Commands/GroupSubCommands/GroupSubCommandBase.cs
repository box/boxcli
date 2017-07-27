using System;
using System.Collections.Generic;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
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
        protected virtual void PrintGroup(BoxGroup g)
        {
            Reporter.WriteInformation($"ID: {g.Id}");
            Reporter.WriteInformation($"Name: {g.Name}");
        }
    }
}