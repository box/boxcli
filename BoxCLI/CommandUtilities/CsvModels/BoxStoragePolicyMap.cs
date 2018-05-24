using System;
using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxStoragePolicyMap : CsvClassMap<BoxStoragePolicy>
    {
        public BoxStoragePolicyMap()
        {
            Map(m => m.Id);
            Map(m => m.Name);
        }
    }
}
