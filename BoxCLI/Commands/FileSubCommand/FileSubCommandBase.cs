using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.FileSubCommand
{
    public class FileSubCommandBase : BoxBaseCommand
    {
        public FileSubCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }
    }
}