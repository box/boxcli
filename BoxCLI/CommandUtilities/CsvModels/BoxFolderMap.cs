using System;
using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxFolderMap : CsvClassMap<BoxFolder>
    {
        public BoxFolderMap()
        {
            Map(m => m.Id);
            Map(m => m.Name);
            Map(m => m.Description);
            Map(m => m.Type);
			Map(m => m.SequenceId);
            Map(m => m.ETag);
            Map(m => m.Size);
            Map(m => m.HasCollaborations);
            Map(m => m.ItemStatus);
            References<BoxParentMap>(m => m.Parent);
			Map(m => m.CreatedAt);
            References<BoxUserOnObjectMap>(m => m.CreatedBy).Data.Prefix = "CreatedBy";
            Map(m => m.ModifiedAt);
            References<BoxUserOnObjectMap>(m => m.ModifiedBy).Data.Prefix = "ModifiedBy";
            References<BoxUserOnObjectMap>(m => m.OwnedBy).Data.Prefix = "OwnedBy";
            References<BoxEmailMap>(m => m.FolderUploadEmail);
        }
    }

}
