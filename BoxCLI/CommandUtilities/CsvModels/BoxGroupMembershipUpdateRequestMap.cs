using System;
using Box.V2.Models;
using Box.V2.Models.Request;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxGroupMembershipUpdateRequestMap : CsvClassMap<BoxGroupMembership>
    {
        public BoxGroupMembershipUpdateRequestMap()
        {
            Map(m => m.Id);
            Map(m => m.Role);
        }
    }
}
