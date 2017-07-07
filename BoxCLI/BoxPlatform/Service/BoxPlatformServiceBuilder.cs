using System;
using System.IO;
using Box.V2.Config;
using Box.V2.JWTAuth;
using BoxCLI.BoxPlatform.Cache;
using BoxCLI.BoxPlatform.Models;
using BoxCLI.CommandUtilities;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Utilities;

namespace BoxCLI.BoxPlatform.Service
{
    public class BoxPlatformServiceBuilder : IBoxPlatformServiceBuilder
    {
        BoxPlatformService BoxService = new BoxPlatformService();
        private IBoxConfig BoxPlatformConfig;
        private IBoxPlatformCache BoxPlatformCache;
        private readonly IBoxHome BoxHome;
        private readonly IBoxCollectionsIterators BoxIterators;

        public BoxPlatformServiceBuilder(IBoxHome boxHome, IBoxPlatformCache cache, IBoxCollectionsIterators iterators)
        {
            BoxHome = boxHome;
            BoxPlatformCache = cache;
            BoxIterators = iterators;
        }

        public void SetConfig()
        {
            var environments = BoxHome.GetBoxEnvironments();
            var defaultEnv = environments.GetDefaultEnvironment();
            BoxPlatformConfig = new BoxCLIConfig(defaultEnv.ClientId, defaultEnv.ClientSecret,
                defaultEnv.EnterpriseId, defaultEnv.JwtPrivateKey, defaultEnv.JwtPrivateKeyPassword,
                defaultEnv.JwtPublicKeyId);
            BoxService.BoxPlatformConfig = BoxPlatformConfig;
        }

        public void SetCache()
        {
            BoxService.BoxPlatformCache = BoxPlatformCache;
        }

        public void SetAuthorizedClient()
        {
            BoxService.BoxPlatformAuthorizedClient = new BoxJWTAuth(BoxPlatformConfig);
        }

        public void SetIterators()
        {
            BoxService.BoxCollectionsIterators = BoxIterators;
        }

        public IBoxPlatformService Build()
        {
            SetConfig();
            SetCache();
            SetAuthorizedClient();
            SetIterators();
            return BoxService;
        }
    }
}