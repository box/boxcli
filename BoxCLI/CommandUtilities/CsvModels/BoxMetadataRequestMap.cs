using System;
using System.Collections.Generic;
using System.Linq;
using Box.V2.Models;
using BoxCLI.CommandUtilities.CommandModels;
using CsvHelper.Configuration;
using CsvHelper.TypeConversion;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxMetadataRequestMap : CsvClassMap<BoxMetadataForCsv>
    {
        public BoxMetadataRequestMap()
        {
            Map(m => m.ItemId);
            Map(m => m.ItemType);
            Map(m => m.Scope);
            Map(m => m.TemplateKey);
            Map(m => m.Metadata).ConvertUsing<Dictionary<string, object>>(row =>
            {
                var metadata = row.GetField("Metadata");
                var metadataDict = new Dictionary<string, object>();
                var val = metadata.Split(',');
                foreach (var line in val)
                {
                    var kv = line.Split(':');
                    metadataDict.Add(kv.ElementAtOrDefault(0), kv.ElementAtOrDefault(1));
                }
                return metadataDict;
            });
        }
    }
}
