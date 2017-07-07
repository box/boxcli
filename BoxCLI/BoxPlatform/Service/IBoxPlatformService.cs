using Box.V2;
using Box.V2.Config;
using Box.V2.JWTAuth;
using BoxCLI.BoxPlatform.Cache;
using BoxCLI.BoxPlatform.Utilities;

namespace BoxCLI.BoxPlatform.Service
{
    public interface IBoxPlatformService
    {

        BoxJWTAuth BoxPlatformAuthorizedClient { get; set; }
        IBoxCollectionsIterators BoxCollectionsIterators { get; set; }

        BoxClient AdminClient();
        
        string EnterpriseToken();

    }
}