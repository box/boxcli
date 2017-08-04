﻿using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace BoxCLI.CommandUtilities.CommandModels
{
    public class BoxMetadataForCsv
    {
        [JsonProperty(PropertyName = "scope")]
        public string Scope { get; set; }
        [JsonProperty(PropertyName = "template_key")]
        public string TemplateKey { get; set; }
        [JsonProperty(PropertyName = "item_id")]
        public string ItemId { get; set; }
        [JsonProperty(PropertyName = "item_type")]
        public string ItemType { get; set; }
        [JsonProperty(PropertyName = "metadata")]
        public Dictionary<string, object> Metadata { get; set; }
    }
}
