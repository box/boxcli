using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.TokenSubCommands
{
    public class TokenSubCommandBase : BoxBaseCommand
    {
        protected string FilesResourceUrl { get { return "https://api.box.com/2.0/files/"; } }
        protected string FoldersResourceUrl { get { return "https://api.box.com/2.0/folders/"; } }
        public TokenSubCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }
    }
}