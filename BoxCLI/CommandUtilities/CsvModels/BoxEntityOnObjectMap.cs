using System;
using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxEntityOnObjectMap : CsvClassMap<BoxEntity>
    {
        public BoxEntityOnObjectMap()
        {
            Map(m => m.Id).Name("BoxItemName");
            Map(m => m.Type).Name("BoxItemType");
        }
    }
}
