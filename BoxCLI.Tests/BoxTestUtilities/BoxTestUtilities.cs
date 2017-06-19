using BoxCLI.BoxPlatform;
using BoxCLI.BoxPlatform.Cache;
using Microsoft.Extensions.Caching.Memory;
using Moq;

namespace BoxCLI.Tests.TestUtilities
{
    public static class BoxTestUtilities
    {
        public static BoxPlatformSettings GetBoxPlatformSettings()
        {
            var settings = new BoxPlatformSettings()
            {
                ClientId = "123",
                ClientSecret = "321",
                EnterpriseId = "789",
                JwtPrivateKeyPassword = "password",
                JwtPublicKeyId = "987"
            };
            return settings;
        }

        public static IBoxPlatformCache GetBoxPlatformCache()
        {
            var boxCache = new Mock<IBoxPlatformCache>();
            var cache = new Mock<IMemoryCache>();
            return boxCache.Object;
        }
    }
}