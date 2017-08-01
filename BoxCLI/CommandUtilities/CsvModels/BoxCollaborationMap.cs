using System;
using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxCollaborationMap : CsvClassMap<BoxCollaboration>
    {
        public BoxCollaborationMap()
        {
            Map(m => m.Id);
            Map(m => m.Role);
            Map(m => m.CreatedAt);
            References<BoxCollaborationItemMap>(m => m.Item);
        }
    }

    public class BoxCollaborationItemMap : CsvClassMap<BoxItem>
    {
        public BoxCollaborationItemMap()
        {
            Map(m => m.Id).Name("ItemId");
            Map(m => m.Name);
            Map(m => m.Type).Name("ItemType");
        }
    }
}
