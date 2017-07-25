using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.SharedItemSubCommands
{
    public class SharedItemSubCommandBase : BoxBaseCommand
    {
        protected CommandOption _asUser;
        public SharedItemSubCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _asUser = AsUserOption.ConfigureOption(command);
            base.Configure(command);
        }

        protected virtual void PrintItem(BoxItem item)
        {
            Reporter.WriteInformation($"ID: {item.Id}");
            Reporter.WriteInformation($"Name: {item.Name}");
        }
    }
}