using Box.V2.Models;
using BoxCLI.CommandUtilities.CommandModels;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxFileUploadMap : CsvClassMap<BoxFileUpload>
    {
        public BoxFileUploadMap()
        {
            Map(m => m.Id).Default("");
            Map(m => m.Path);
            Map(m => m.Name).Default("");
            Map(m => m.Parent).ConvertUsing(row =>
            {
                var parentId = row.GetField<string>("ParentId");
                return new BoxItemRequest()
                {
                    Id = parentId
                };

            }); ;
        }
    }
}