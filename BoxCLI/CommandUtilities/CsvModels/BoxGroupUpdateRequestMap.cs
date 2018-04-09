using System;
using Box.V2.Models.Request;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxGroupUpdateRequestMap : CsvClassMap<BoxGroupRequest>
    {
        public BoxGroupUpdateRequestMap()
        {
            Map(m => m.Id);
            Map(m => m.Name).Default("");
            Map(m => m.InvitabilityLevel).Default("");
            Map(m => m.MemberViewabilityLevel).Default("");
        }
    }
}
