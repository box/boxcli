using System;
using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxGroupMap : CsvClassMap<BoxGroup>
    {
        public BoxGroupMap()
        {
			Map(m => m.Id);
            Map(m => m.Name);
            Map(m => m.CreatedAt);
            Map(m => m.ModifiedAt);
        }
    }
}
