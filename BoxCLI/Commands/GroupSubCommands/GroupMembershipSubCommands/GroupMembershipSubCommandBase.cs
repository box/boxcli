using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
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

        protected virtual void PrintGroupMember(BoxGroupMembership g)
        {
            Reporter.WriteInformation($"ID: {g.Id}");
            Reporter.WriteInformation("Group: ");
            base.PrintGroup(g.Group);
            Reporter.WriteInformation("Group Member: ");
            Reporter.WriteInformation($"Role: {g.Role}");
            base.PrintMiniUser(g.User);
        }
    }
}