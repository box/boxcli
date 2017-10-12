using System.Collections.Generic;
using System.Linq;
using Box.V2.Models;
using CsvHelper.Configuration;
using CsvHelper.TypeConversion;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxWebhookMap : CsvClassMap<BoxWebhook>
    {
        public BoxWebhookMap()
        {
            Map(m => m.Id);
            Map(m => m.Triggers).TypeConverter<BoxWebhookTriggersConverter>();
            References<BoxWebhookTargetMap>(m => m.Target);
        }

    }

    public sealed class BoxWebhookTargetMap : CsvClassMap<BoxEntity>
    {
        public BoxWebhookTargetMap()
        {
            Map(m => m.Id).Name("TargetId");
            Map(m => m.Type).Name("TargetType");
        }
    }

    public class BoxWebhookTriggersConverter : DefaultTypeConverter
    {
        public override string ConvertToString(TypeConverterOptions options, object value)
        {
            var list = (List<string>)value;
            if (list == null)
            {
                list = new List<string>();
            }
            return string.Join(",", list).ToUpper();
        }

        public override object ConvertFromString(TypeConverterOptions options, string text)
        {
            if (string.IsNullOrEmpty(text))
            {
                return new List<string>();
            }

            return text.Split(',').ToList();
        }
    }
}