using Box.V2.Models;
using Newtonsoft.Json;

namespace BoxCLI.CommandUtilities.CommandModels
{
    public class BoxFileUpload : BoxFileRequest
    {
        [JsonProperty(PropertyName = "path")]
        public string Path { get; set; }
    }
}