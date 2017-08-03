using System;
using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxItemOnObjectMap : CsvClassMap<BoxItem>
    {
        public BoxItemOnObjectMap()
        {
            Map(m => m.Id).Name("BoxItemId");
            Map(m => m.Name).Name("BoxItemName");
            Map(m => m.CreatedAt).Name("BoxItemCreatedAt");
            Map(m => m.Description).Name("Description");
            References<BoxUserOnObjectMap>(m => m.CreatedBy).Data.Prefix = "CreatedBy";
        }
    }


}