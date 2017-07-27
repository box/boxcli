using System;
using BoxCLI.BoxPlatform.Utilities;

namespace BoxCLI.BoxPlatform.Cache
{
    public interface IBoxPlatformCache
    {
        BoxCachedToken GetToken(Func<string> generateToken);
        BoxCachedToken BustCache();
    }
}