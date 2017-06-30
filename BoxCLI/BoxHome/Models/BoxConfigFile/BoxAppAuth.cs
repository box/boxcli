using Newtonsoft.Json;

namespace BoxCLI.BoxHome.Models.BoxConfigFile
{
    public class BoxAppAuth
    {
        [JsonProperty(PropertyName = "publicKeyID")]
        public string PublicKeyId { get; set; }
        [JsonProperty(PropertyName = "privateKey")]
        public string PrivateKey { get; set; }
        [JsonProperty(PropertyName = "passphrase")]
        public string Passphrase { get; set; }
    }
}