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
            Map(m => m.Type);
            Map(m => m.ETag);
            Map(m => m.Size);
        }
    }
}
