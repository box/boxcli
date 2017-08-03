using System;
using System.Collections.Generic;
using System.Linq;
using Box.V2.Models;
using BoxCLI.CommandUtilities.CommandModels;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxMetadataMap : CsvClassMap<BoxMetadataForCsv>
    {
        public BoxMetadataMap(IEnumerable<string> metadataHeaders)
        {
            Map(m => m.ItemId);
            Map(m => m.ItemType);
            Map(m => m.Scope);
            Map(m => m.TemplateKey);
            Map(m => m.Metadata).ConvertUsing<Dictionary<string, object>>(row => 
            {
                var metadata = row.CurrentRecord.Skip(4);
                var metadataDict = new Dictionary<string, object>();
                for (var i = 0; i < metadata.Count(); i++) 
                {
                    metadataDict.Add(metadata.ElementAt(i), metadata.ElementAt(i + 1));
                }
                return metadataDict;
            });
        }
    }
}
