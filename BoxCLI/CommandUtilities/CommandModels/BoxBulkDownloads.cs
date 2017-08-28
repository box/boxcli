using System.Collections.Generic;
using Box.V2.Models;
using Newtonsoft.Json;

namespace BoxCLI.CommandUtilities.CommandModels
{
    public class BoxBulkDownloads
    {
        [JsonProperty(PropertyName = "entries")]
        public List<BoxBulkDownload> Entries { get; set; }
    }
}