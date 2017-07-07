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
            System.Console.WriteLine("Getting token...");
            var token = EnterpriseToken();
            System.Console.WriteLine("Token:");
            System.Console.WriteLine(token);
            return BoxPlatformAuthorizedClient.AdminClient(token);
        }

        public string EnterpriseToken()
        {
            System.Console.WriteLine("Trying token call...");
            System.Console.WriteLine(BoxPlatformCache.GetType());
            return BoxPlatformCache.GetToken(() => { return BoxPlatformAuthorizedClient.AdminToken(); }).AccessToken;
        }
    }
}