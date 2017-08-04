using System;
using System.Collections.Generic;
using System.Linq;
using Box.V2.Models;
using BoxCLI.CommandUtilities.CommandModels;
using CsvHelper.Configuration;
using CsvHelper.TypeConversion;
using Newtonsoft.Json;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxMetadataMap : CsvClassMap<BoxMetadataForCsv>
    {
        public BoxMetadataMap()
        {
            Map(m => m.ItemId);
            Map(m => m.ItemType);
            Map(m => m.Scope);
            Map(m => m.TemplateKey);
            Map(m => m.Metadata).TypeConverter<MetadataConverter>();
        }
    }

    public class MetadataConverter : ITypeConverter
    {
        public bool CanConvertFrom(Type type)
        {
            return typeof(Dictionary<string, object>) == type;
        }

        public bool CanConvertTo(Type type)
        {
            return typeof(string) == type;
        }

        public object ConvertFromString(TypeConverterOptions options, string text)
        {
            System.Console.WriteLine("Text from file...");
            System.Console.WriteLine(text);
            return JsonConvert.DeserializeObject<Dictionary<string, object>>(text);
        }

        public string ConvertToString(TypeConverterOptions options, object value)
        {
            var valDict = value as Dictionary<string, object>;
           return JsonConvert.SerializeObject(valDict);
        }
    }
}
