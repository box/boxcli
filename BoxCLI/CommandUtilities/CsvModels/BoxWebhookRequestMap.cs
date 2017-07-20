using System.Collections.Generic;
using System.Linq;
using Box.V2.Models;
using CsvHelper.Configuration;
using CsvHelper.TypeConversion;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxWebhookRequestMap : CsvClassMap<BoxWebhookRequest>
    {
        public BoxWebhookRequestMap()
        {
            Map(m => m.Address);
            Map(m => m.Triggers).ConvertUsing(row =>
            {
                var list = new List<string>();
                var triggers = row.GetField<string>("Triggers").Split(',');
                foreach (var trigger in triggers)
                {
                    list.Add(trigger.ToUpper());
                }
                return list;
            });
            References<BoxWebhookRequesTargetMap>(m => m.Target);
        }
    }

    public sealed class BoxWebhookRequesTargetMap : CsvClassMap<BoxRequestEntity>
    {
        public BoxWebhookRequesTargetMap()
        {
            Map(m => m.Id).Name("TargetId");
            Map(m => m.Type).Name("TargetType");
        }
    }

}