using System;
using Box.V2.Config;

namespace BoxCLI.BoxPlatform.Models
{
    public class BoxCLIConfig : BoxConfig
    {
        public BoxCLIConfig(string clientId, string clientSecret, string enterpriseId,
        string jwtPrivateKey, string jwtPrivateKeyPassword, string jwtPublicKeyId)
            : base(clientId: clientId, clientSecret: clientSecret, enterpriseId: enterpriseId,
                jwtPrivateKey: jwtPrivateKey, jwtPrivateKeyPassword: jwtPrivateKeyPassword, jwtPublicKeyId: jwtPublicKeyId)
        {
            this.UserAgent = $"{BoxCLIInfo.ProductTitle} v{BoxCLIInfo.Version}";
        }

        public BoxCLIConfig(string clientId, string clientSecret, Uri redirect)
            : base(clientId: clientId, clientSecret: clientSecret, redirectUri: redirect)
        {
            this.UserAgent = $"{BoxCLIInfo.ProductTitle} v{BoxCLIInfo.Version}";
        }
    }
}