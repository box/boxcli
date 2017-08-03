using System;
using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxTaskAssignmentMap : CsvClassMap<BoxTaskAssignment>
    {
        public BoxTaskAssignmentMap()
        {
            Map(m => m.Id);
            Map(m => m.AssignedAt);
            Map(m => m.Message);
            Map(m => m.ResolutionState);
            Map(m => m.RemindedAt);
            References<BoxItemOnObjectMap>(m => m.Item);
        }
    }

}
