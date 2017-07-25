using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxCollaborationRequestMap : CsvClassMap<BoxCollaborationRequest>
    {
        public BoxCollaborationRequestMap()
        {
            Map(m => m.Role);
            Map(m => m.CanViewPath).Default(false);
            References<BoxCollaborationItemRequestMap>(m => m.Item);
            References<BoxCollaborationUserRequestMap>(m => m.AccessibleBy);
        }
    }

    public class BoxCollaborationUserRequestMap : CsvClassMap<BoxCollaborationUserRequest>
    {
        public BoxCollaborationUserRequestMap()
        {
            Map(m => m.Type).Name("UserGroupType");
            Map(m => m.Id).Name("UserGroupId");
            Map(m => m.Login).Default("");
        }
    }

    public class BoxCollaborationItemRequestMap : CsvClassMap<BoxRequestEntity>
    {
        public BoxCollaborationItemRequestMap()
        {
            Map(m => m.Id).Name("ItemId");
            Map(m => m.Type).Name("ItemType").Default("enterprise");
        }
    }
}