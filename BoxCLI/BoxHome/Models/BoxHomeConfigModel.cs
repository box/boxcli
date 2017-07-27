using System;
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
        [JsonProperty(PropertyName = "defaultAsUserId")]
        public string DefaultAsUserId { get; set; }
        [JsonProperty(PropertyName = "useDefaultAsUser")]
        public bool UseDefaultAsUser { get; set; } = false;
        [JsonProperty(PropertyName = "adminAsUserId")]
        public string AdminAsUserId { get; set; }
        [JsonProperty(PropertyName = "tempAsUserId")]
        public string TempAsUserId { get; set; }
        [JsonProperty(PropertyName = "useTempAsUser")]
        public bool UseTempAsUser { get; set; } = false;
        [JsonProperty(PropertyName = "userSessionExpiration")]
        public DateTime? UserSessionExpiration { get; set; }
        [JsonProperty(PropertyName = "userSessionEnabled")]
        public bool UserSessionEnabled { get; set; }
    }
}