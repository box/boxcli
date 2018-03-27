using System;
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
            Map(m => m.Id).Name("AccessibleById");
            Map(m => m.Type).Name("AccessibleByType").ConvertUsing<BoxType>(row =>
            {
                var field = row.GetField("AccessibleByType");
                if (field.ToLower() == "user")
                {
                    return BoxType.user;
                }
                else if (field.ToLower() == "group")
                {
                    return BoxType.group;
                }
                else
                {
                    throw new Exception("Must provide user or group as AccessibleByType.");
                }
            });
            Map(m => m.Login).Name("AccessibleByLogin");
        }
    }

    public class BoxCollaborationItemRequestMap : CsvClassMap<BoxRequestEntity>
    {
        public BoxCollaborationItemRequestMap()
        {
            Map(m => m.Id).Name("ItemId");
            Map(m => m.Type).Name("ItemType").ConvertUsing<BoxType>(row =>
            {
                var field = row.GetField("ItemType");
                if (field.ToLower() == "file")
                {
                    return BoxType.file;
                }
                else if (field.ToLower() == "folder")
                {
                    return BoxType.folder;
                }
                else
                {
                    throw new Exception("Must provide file or folder as ItemType.");
                }
            });
        }
    }
}