using System;
using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxGroupMembershipMap : CsvClassMap<BoxGroupMembership>
    {
        public BoxGroupMembershipMap()
        {
			Map(m => m.Id);
            References<BoxUserOnObjectMap>(m => m.User);
            References<BoxGroupMap>(m => m.Group);
            Map(m => m.CreatedAt);
            Map(m => m.ModifiedAt);
            Map(m => m.Role);
        }
    }
}
