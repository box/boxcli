using Newtonsoft.Json;

namespace BoxCLI.BoxHome.Models
{
    public class BoxHomeConfigModel
    {
        [JsonProperty(PropertyName = "clientId")]
        public string ClientId { get; set; }
        [JsonProperty(PropertyName = "enterpriseId")]
        public string EnterpriseId { get; set; }
        [JsonProperty(PropertyName = "boxConfigFilePath")]
        public string BoxConfigFilePath { get; set; }
        [JsonProperty(PropertyName = "name")]
        public string Name { get; set; }
    }
}