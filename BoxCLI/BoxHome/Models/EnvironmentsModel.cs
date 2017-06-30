using System.Collections.Generic;
using Newtonsoft.Json;

namespace BoxCLI.BoxHome.Models
{
    public class EnvironmentsModel
    {
        [JsonProperty(PropertyName = "default")]
        public string DefaultEnvironment { get; set; }
        [JsonProperty(PropertyName = "environments")]
        public Dictionary<string, BoxHomeConfigModel> Environments { get; set; }

        public EnvironmentsModel()
        {
            Environments = new Dictionary<string, BoxHomeConfigModel>();
        }
    }
}