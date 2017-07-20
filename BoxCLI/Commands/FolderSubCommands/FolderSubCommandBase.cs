using System;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.FolderSubCommands
{
    public class FolderSubCommandBase : BoxBaseCommand
    {
        private CommandLineApplication _app;
       
        public FolderSubCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base (boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            base.Configure(command);
        }

        
    }
}