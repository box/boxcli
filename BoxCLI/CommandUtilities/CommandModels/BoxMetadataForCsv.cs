using System;
using System.Collections.Generic;

namespace BoxCLI.CommandUtilities.CommandModels
{
    public class BoxMetadataForCsv
    {
        public string Scope { get; set; }
        public string TemplateKey { get; set; }
        public string ItemId { get; set; }
        public BoxType? ItemType { get; set; }
        public Dictionary<string, object> Metadata { get; set; }
    }
}
