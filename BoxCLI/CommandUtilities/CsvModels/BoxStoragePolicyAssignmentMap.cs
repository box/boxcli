using System;
using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxStoragePolicyAssignmentMap : CsvClassMap<BoxStoragePolicyAssignment>
    {
        public BoxStoragePolicyAssignmentMap()
        {
            Map(m => m.Id);
            References<BoxUserOnObjectMap>(m => m.AssignedTo);
            References<BoxStoragePolicyMap>(m => m.BoxStoragePolicy);
        }
    }
}
