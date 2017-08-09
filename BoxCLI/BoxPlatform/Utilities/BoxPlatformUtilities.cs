using System;
using BoxCLI.BoxHome.Models.BoxConfigFile;
using Newtonsoft.Json.Linq;

namespace BoxCLI.BoxPlatform.Utilities
{
    public static class BoxPlatformUtilities
    {
        public static BoxConfigFileModel ParseBoxConfig(string jsonString)
        {
            var config = new BoxConfigFileModel();
            config.AppSettings = new BoxAppSettings();
            config.AppSettings.AppAuth = new BoxAppAuth();
            var json = JObject.Parse(jsonString);

            if (json["boxAppSettings"] != null)
            {
                var boxAppSettings = json["boxAppSettings"];

                if (boxAppSettings["clientID"] != null)
                {
                    config.AppSettings.ClientId = boxAppSettings["clientID"].ToString();
                }
                else
                {
                    throw new Exception("Your configuration file is missing the client ID value.");
                }

                if (boxAppSettings["clientSecret"] != null)
                {
                    config.AppSettings.ClientSecret = boxAppSettings["clientSecret"].ToString();
                }
                else
                {
                    throw new Exception("Your configuration file is missing the client secret value.");
                }

                if (boxAppSettings["appAuth"] != null)
                {
                    var appAuth = boxAppSettings["appAuth"];

                    if (appAuth["privateKey"] != null)
                    {
                        config.AppSettings.AppAuth.PrivateKey = appAuth["privateKey"].ToString();
                    }

                    if (appAuth["passphrase"] != null)
                    {
                        config.AppSettings.AppAuth.Passphrase = appAuth["passphrase"].ToString();
                    }

                    if (appAuth["publicKeyID"] != null)
                    {
                        config.AppSettings.AppAuth.PublicKeyId = appAuth["publicKeyID"].ToString();
                    }
                    else
                    {
                        throw new Exception("Your configuration file is missing the public key ID value.");
                    }
                }
            }

            if (json["enterpriseID"] != null)
            {
                config.EnterpriseId = json["enterpriseID"].ToString();
            }
            else
            {
                throw new Exception("Your configuration file is missing the Enterprise ID value.");
            }

            return config;
        }
    }
}