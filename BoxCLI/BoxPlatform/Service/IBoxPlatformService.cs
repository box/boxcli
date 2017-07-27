using System.Threading.Tasks;
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
        BoxClient AsUserClient(string asUserId);
        BoxClient ClientFromToken(string token);
        string GetServiceAccountToken();
        string GetUserToken(string id);
        string EnterpriseToken();
        Task<bool> BustCache();
    }
}