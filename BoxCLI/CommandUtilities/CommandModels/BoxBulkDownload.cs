using Box.V2.Models;
using Newtonsoft.Json;

namespace BoxCLI.CommandUtilities.CommandModels
{
    public class BoxBulkDownload
    {
        [JsonProperty(PropertyName = "id")]
        public string Id { get; set; }
        [JsonProperty(PropertyName = "versionId")]
        public string VersionId { get; set; } = "";
    }
}