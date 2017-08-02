using System;
using System.Collections.Generic;
using Box.V2.Models;
using BoxCLI.CommandUtilities.CommandModels;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxMetadataTemplateFieldRequestMap : CsvClassMap<BoxMetadataTemplateFieldForCsv>
    {
        public BoxMetadataTemplateFieldRequestMap()
        {
            Map(m => m.DisplayName);
            Map(m => m.Key);
            Map(m => m.Hidden).Default(false);
            Map(m => m.TemplateKey);
            Map(m => m.Type);
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

}
