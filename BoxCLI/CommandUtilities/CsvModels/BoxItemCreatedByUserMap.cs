using System;
using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{

    public class BoxItemCreatedByUserMap : CsvClassMap<BoxUser>
    {
        public BoxItemCreatedByUserMap()
        {
            Map(m => m.Id).Name("BoxItemUserId");
        }
    }
}
