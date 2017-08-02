using System;
using System.Collections.Generic;
using System.Linq;
using Box.V2.Models;
using BoxCLI.CommandUtilities.CommandModels;
using CsvHelper.Configuration;
using CsvHelper.TypeConversion;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxMetadataTemplateFieldMap : CsvClassMap<BoxMetadataTemplateFieldForCsv>
    {
        public BoxMetadataTemplateFieldMap()
        {
            Map(m => m.DisplayName);
            Map(m => m.Key);
            Map(m => m.Type);
            Map(m => m.Hidden).Default(false);
            Map(m => m.TemplateKey);
            Map(m => m.OptionsFromCsv).TypeConverter<BoxMetadataTemplateFieldOptionsConverter>().Name(("Options"));
			Map(m => m.OptionsFromCsv).ConvertUsing(row =>
			{
				var list = new List<string>();
				var options = row.GetField<string>("Options").Split(',');
				foreach (var option in options)
				{
					list.Add(option);
				}
				return list;
			}).Default(new List<string>()).Name("Options");
        }
    }

	public class BoxMetadataTemplateFieldOptionsConverter : DefaultTypeConverter
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
