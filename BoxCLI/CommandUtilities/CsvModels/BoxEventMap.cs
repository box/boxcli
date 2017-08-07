using System;
using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxEventMap : CsvClassMap<BoxEnterpriseEvent>
    {
        public BoxEventMap()
        {
            Map(m => m.EventId);
            Map(m => m.EventType);
            Map(m => m.IPAddress);
            Map(m => m.SessionId);
            References<BoxEntityOnObjectMap>(m => m.Source).Prefix("Source");
            References<BoxUserOnObjectMap>(m => m.CreatedBy).Prefix("CreatedBy");
        }
    }
}
