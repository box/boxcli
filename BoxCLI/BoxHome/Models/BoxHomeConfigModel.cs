using Newtonsoft.Json;

namespace BoxCLI.BoxHome.Models
{
    public class BoxHomeConfigModel
    {
        [JsonProperty(PropertyName = "clientId")]
        public string ClientId { get; set; }
        [JsonProperty(PropertyName = "clientSecret")]
        public string ClientSecret { get; set; }
        [JsonProperty(PropertyName = "enterpriseId")]
        public string EnterpriseId { get; set; }
        [JsonProperty(PropertyName = "publicKeyId")]
        public string JwtPublicKeyId { get; set; }
        [JsonProperty(PropertyName = "privateKey")]
        public string JwtPrivateKey { get; set; }
        [JsonProperty(PropertyName = "privateKeyPassword")]
        public string JwtPrivateKeyPassword { get; set; }
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }
    }
}