using Newtonsoft.Json;

namespace BoxCLI.BoxHome.Models
{
    public class BoxHomeDefaultSettings
    {
        [JsonProperty(PropertyName = "boxReportsFolderPath")]
        public string BoxReportsFolderPath { get; set; }
        [JsonProperty(PropertyName = "boxReportsFolderName")]
        public string BoxReportsFolderName { get; set; } = "Box-Reports";
        [JsonProperty(PropertyName = "boxReportsFileFormat")]
        public string BoxReportsFileFormat { get; set; } = "json";
        [JsonProperty(PropertyName = "boxDownloadsFolderPath")]
        public string BoxDownloadsFolderPath { get; set; }
        [JsonProperty(PropertyName = "boxDownloadsFolderName")]
        public string BoxDownloadsFolderName { get; set; } = "Box-Downloads";
        [JsonProperty(PropertyName = "defaultAsUserId")]
        public string DefaultAsUserId { get; set; }
        [JsonProperty(PropertyName = "tempAsUserId")]
        public string TempAsUserId { get; set; }
        [JsonProperty(PropertyName = "useDefaultAsUser")]
        public bool UseDefaultAsUser { get; set; } = false;
        [JsonProperty(PropertyName = "useTempAsUser")]
        public bool UseTempAsUser { get; set; } = false;
    }
}