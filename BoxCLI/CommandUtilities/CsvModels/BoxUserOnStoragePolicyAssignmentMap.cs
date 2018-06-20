using System;
using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxUserOnStoragePolicyAssignmentMap : CsvClassMap<BoxUser>
    {
        public BoxUserOnStoragePolicyAssignmentMap()
        {
            Map(m => m.Id).Name("BoxUserId");
        }
    }
}
