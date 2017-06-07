using Box.V2;
using Box.V2.Config;
using Box.V2.JWTAuth;
using BoxCLI.BoxPlatform.Cache;

namespace BoxCLI.BoxPlatform.Service
{
    public interface IBoxPlatformService
    {
        string JwtPrivateKey { get; }

        BoxConfig BoxPlatformConfig { get; }

        BoxJWTAuth BoxPlatformAuthorizedClient { get; }

        BoxClient AdminClient();

        string EnterpriseToken();

        IBoxCachedToken EnterpriseAccessTokenAndExpiration();

    }
}