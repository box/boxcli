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
            if (defaultEnv.HasInLinePrivateKey)
            {
                using (FileStream fs = new FileStream(defaultEnv.BoxConfigFilePath, FileMode.Open))
                {
                    BoxPlatformConfig = BoxCLIConfig.CreateFromJsonFile(fs);
                }
            }
            else if (!string.IsNullOrEmpty(defaultEnv.PrivateKeyPath))
            {
                var config = BoxPlatformUtilities.ParseBoxConfig(File.ReadAllText(defaultEnv.BoxConfigFilePath));
                var pem = File.ReadAllText(defaultEnv.PrivateKeyPath);
                BoxPlatformConfig = new BoxCLIConfig(config.AppSettings.ClientId, config.AppSettings.ClientSecret,
                                                    config.EnterpriseId, pem, config.AppSettings.AppAuth.Passphrase,
                                                    config.AppSettings.AppAuth.PublicKeyId);
            }
            else
            {
                // Logic to revalidate existing environments to add new detectable fields added to the model.
                // Could come in handy when introducing breaking changes to environment file model.
                var existing = environments.RevalidateExistingConfigFile(defaultEnv.BoxConfigFilePath, defaultEnv.PrivateKeyPath);
                existing.Name = defaultEnv.Name;
                if (!environments.UpdateEnvironment(existing, defaultEnv.Name))
                {
                    throw new Exception($"An error occurred with your environment. Try deleting the environment {defaultEnv.Name} and adding again.");
                }
                if (existing.HasInLinePrivateKey)
                {
                    using (FileStream fs = new FileStream(existing.BoxConfigFilePath, FileMode.Open))
                    {
                        BoxPlatformConfig = BoxCLIConfig.CreateFromJsonFile(fs);       
                    }
                }
                else if (!string.IsNullOrEmpty(existing.PrivateKeyPath))
                {
                    var config = BoxPlatformUtilities.ParseBoxConfig(File.ReadAllText(existing.BoxConfigFilePath));
                    var pem = File.ReadAllText(existing.PrivateKeyPath);
                    BoxPlatformConfig = new BoxCLIConfig(config.AppSettings.ClientId, config.AppSettings.ClientSecret,
                                                        config.EnterpriseId, pem, config.AppSettings.AppAuth.Passphrase,
                                                        config.AppSettings.AppAuth.PublicKeyId);
                }
                else
                {
                    throw new Exception("An unknown error occured.");
                }
            }
            BoxPlatformConfig.UserAgent = $"{BoxCLIInfo.ProductTitle} v{BoxCLIInfo.Version}";
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

        public IBoxPlatformService Build(bool isTokenCall = false)
        {
            if (!isTokenCall)
            {
                SetConfig();
                SetCache();
                SetAuthorizedClient();
            }
            SetIterators();
            return BoxService;
        }
    }
}