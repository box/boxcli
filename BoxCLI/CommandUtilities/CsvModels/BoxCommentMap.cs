using System;
using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxCommentMap : CsvClassMap<BoxComment>
    {
        public BoxCommentMap()
        {
            Map(m => m.Id);
            Map(m => m.CreatedAt);
            Map(m => m.IsReplyComment);
            Map(m => m.Message);
            Map(m => m.ModifiedAt);
            Map(m => m.TaggedMessage);
            Map(m => m.Type);
            References<BoxUserOnObjectMap>(m => m.CreatedBy);
            References<BoxEntityOnObjectMap>(m => m.Item);
        }
    }
}
