using System;
using System.IO;
using Box.V2.Config;
using Box.V2.JWTAuth;
using BoxCLI.BoxPlatform.Cache;
using BoxCLI.BoxPlatform.Models;
using BoxCLI.CommandUtilities;
using BoxCLI.BoxHome;

namespace BoxCLI.BoxPlatform.Service
{
    public class BoxPlatformServiceBuilder : IBoxPlatformServiceBuilder
    {
        BoxPlatformService BoxService = new BoxPlatformService();
        private IBoxConfig BoxPlatformConfig;
        private IBoxPlatformCache BoxPlatformCache;
        private readonly IBoxHome BoxHome;

        public BoxPlatformServiceBuilder(IBoxHome boxHome, IBoxPlatformCache cache)
        {
            BoxHome = boxHome;
            BoxPlatformCache = cache;
        }

        public void SetConfig()
        {
            var environments = BoxHome.GetBoxEnvironments();
            System.Console.WriteLine("Pulling default environment...");
            var defaultEnv = environments.GetDefaultEnvironment();
            System.Console.WriteLine("Found default environment...");
            System.Console.WriteLine(defaultEnv.Name);
            BoxPlatformConfig = new BoxCLIConfig(defaultEnv.ClientId, defaultEnv.ClientSecret,
                defaultEnv.EnterpriseId, defaultEnv.JwtPrivateKey, defaultEnv.JwtPrivateKeyPassword,
                defaultEnv.JwtPublicKeyId);
            BoxService.BoxPlatformConfig = BoxPlatformConfig;
        }

        public void SetCache()
        {
            BoxService.BoxPlatformCache = BoxPlatformCache;
            System.Console.WriteLine("Cache set");
            BoxPlatformCache.BustCache();
            System.Console.WriteLine("Busted cache...");
        }

        public void SetAuthorizedClient()
        {
            BoxService.BoxPlatformAuthorizedClient = new BoxJWTAuth(BoxPlatformConfig);
            System.Console.WriteLine("Authorized client...");
        }

        public IBoxPlatformService Build()
        {
            SetConfig();
            SetCache();
            SetAuthorizedClient();
            System.Console.WriteLine("Returning built service...");
            return BoxService;
        }
    }
}