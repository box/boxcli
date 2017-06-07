using System;
using BoxCLI.BoxPlatform.Utilities;

namespace BoxCLI.BoxPlatform.Cache
{
    public interface IBoxPlatformCache
    {
        IBoxCachedToken GetToken(BoxTokenTypes tokenType, string tokenId, Func<string> generateToken);
    }
}