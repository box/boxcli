using Newtonsoft.Json;

namespace BoxCLI.BoxHome.Models.BoxConfigFile
{
    public class BoxConfigFileModel
    {
        [JsonProperty(PropertyName = "boxAppSettings")]
        public BoxAppSettings appSettings { get; set; }
        [JsonProperty(PropertyName = "enterpriseID")]
        public string EnterpriseId { get; set; }
    }
}