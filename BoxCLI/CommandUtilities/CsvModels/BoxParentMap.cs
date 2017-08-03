using System;
using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxParentMap : CsvClassMap<BoxFolder>
    {
        public BoxParentMap()
        {
            Map(m => m.Id).Name("ParentId");
            Map(m => m.Name).Name("ParentName");
            Map(m => m.Type).Name("ParentType");
            Map(m => m.ETag).Name("ParentEtag");
            Map(m => m.SequenceId).Name("ParentSequenceId");
        }
    }
}
