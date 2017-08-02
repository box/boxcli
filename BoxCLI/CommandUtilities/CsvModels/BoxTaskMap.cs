using System;
using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxTaskMap : CsvClassMap<BoxTask>
    {
        public BoxTaskMap()
        {
            Map(m => m.Id);
            Map(m => m.Message);
            Map(m => m.Action);
            Map(m => m.DueAt);
        }
    }
}
