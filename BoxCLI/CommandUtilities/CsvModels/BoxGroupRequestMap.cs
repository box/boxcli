using System;
using Box.V2.Models.Request;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxGroupRequestMap : CsvClassMap<BoxGroupRequest>
    {
        public BoxGroupRequestMap()
        {
            Map(m => m.Name);
            Map(m => m.InvitabilityLevel).Default("");
            Map(m => m.MemberViewabilityLevel).Default("");
        }
    }
}
