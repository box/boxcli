using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxPermissionsRequestMap : CsvClassMap<BoxPermissionsRequest>
    {
        public BoxPermissionsRequestMap()
        {
            Map(m => m.Download).Name("CanDownload");
        }
    }
}