using System;
using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxFileMap : CsvClassMap<BoxFile>
    {
        public BoxFileMap()
        {
            Map(m => m.Id);
            Map(m => m.Name);
            Map(m => m.Sha1);
            Map(m => m.CommentCount);
            Map(m => m.Type);
        }
    }
}
