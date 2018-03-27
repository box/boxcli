using System;
using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxCollaborationUpdateRequestMap : CsvClassMap<BoxCollaborationRequest>
    {
        public BoxCollaborationUpdateRequestMap()
        {
            Map(m => m.Id);
            Map(m => m.Role).Default(null);
            Map(m => m.Status).Default(null);
            Map(m => m.CanViewPath).Default(null);
        }
    }
}