using System;
using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxItemMap : CsvClassMap<BoxItem>
    {
        public BoxItemMap()
        {
            Map(m => m.Id);
            Map(m => m.Name);
            Map(m => m.Type);
            Map(m => m.ETag);
        }
    }
}
