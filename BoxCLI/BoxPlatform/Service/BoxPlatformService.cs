using System;
using System.IO;
using Box.V2;
using Box.V2.Config;
using Box.V2.JWTAuth;
using Microsoft.Extensions.Options;
using BoxCLI.BoxPlatform.Cache;
using BoxCLI.BoxPlatform.Utilities;
using System.Threading.Tasks;

namespace BoxCLI.BoxPlatform.Service
{
    public class BoxPlatformService : IBoxPlatformService
    {
        public BoxJWTAuth BoxPlatformAuthorizedClient { get; set; }
        public IBoxPlatformCache BoxPlatformCache { get; set; }
        public IBoxConfig BoxPlatformConfig { get; set; }
        public IBoxCollectionsIterators BoxCollectionsIterators { get; set; }
        public BoxPlatformService()
        {
        }

        public BoxClient AdminClient()
        {
            var token = EnterpriseToken();
            return BoxPlatformAuthorizedClient.AdminClient(token);
        }

        public BoxClient AsUserClient(string asUserId)
        {
            var token = EnterpriseToken();
            return BoxPlatformAuthorizedClient.AdminClient(token, asUserId);
        }

        public string EnterpriseToken()
        {
            return BoxPlatformCache.GetToken(() => { return BoxPlatformAuthorizedClient.AdminToken(); }).AccessToken;
        }
    }
}