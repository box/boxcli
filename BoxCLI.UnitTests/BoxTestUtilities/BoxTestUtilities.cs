using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform;
using BoxCLI.BoxPlatform.Cache;
using Microsoft.Extensions.Caching.Memory;
using Moq;

namespace BoxCLI.UnitTests.TestUtilities
{
    public static class BoxTestUtilities
    {
        public static IBoxPlatformCache GetBoxPlatformCache()
        {
            var boxCache = new Mock<IBoxPlatformCache>();
            var cache = new Mock<IMemoryCache>();
            return boxCache.Object;
        }

        public static IBoxHome GetBoxHome()
        {
            return new BoxHomeDirectory();
        }
    }
}