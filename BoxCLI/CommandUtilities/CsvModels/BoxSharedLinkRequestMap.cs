using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxSharedLinkRequestMap : CsvClassMap<BoxSharedLinkRequest>
    {
        public BoxSharedLinkRequestMap()
        {
            Map(m => m.Access);
            Map(m => m.Password);
            Map(m => m.UnsharedAt);
            References<BoxPermissionsRequestMap>(m => m.Permissions);
        }
    }
}