using Newtonsoft.Json;

namespace BoxCLI.BoxHome.Models.BoxConfigFile
{
    public class BoxAppSettings
    {
        [JsonProperty(PropertyName = "clientID")]
        public string ClientId { get; set; }
        [JsonProperty(PropertyName = "clientSecret")]
        public string ClientSecret { get; set; }
        [JsonProperty(PropertyName = "appAuth")]
        public BoxAppAuth AppAuth { get; set; }
    }
}