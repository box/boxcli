using BoxCLI.CommandUtilities.CommandModels;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxStoragePolicyAssignmentRequestMap : CsvClassMap<BoxStoragePolicyAssignmentRequest>
    {
        public BoxStoragePolicyAssignmentRequestMap()
        {
            Map(m => m.UserId).Default("");
            Map(m => m.StoragePolicyId).Default("");
        }
    }
}
