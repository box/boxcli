using System;
using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxFolderCreateRequestMap : CsvClassMap<BoxFolderRequest>
    {
        public BoxFolderCreateRequestMap()
        {
            Map(m => m.Name);
            Map(m => m.Description);
            Map(m => m.SyncState);
            References<BoxFolderRequestParentMap>(m => m.Parent);
        }
    }

    public class BoxFolderRequestParentMap : CsvClassMap<BoxRequestEntity>
    {
        public BoxFolderRequestParentMap()
        {
            Map(m => m.Id).Name("ParentId");
        }
    }
}
