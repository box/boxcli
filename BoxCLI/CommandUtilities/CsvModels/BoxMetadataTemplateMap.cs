using System;
using System.Collections.Generic;
using Box.V2.Models;
using CsvHelper.Configuration;

namespace BoxCLI.CommandUtilities.CsvModels
{
    public class BoxMetadataTemplateMap : CsvClassMap<BoxMetadataTemplate>
    {
        public BoxMetadataTemplateMap()
        {
            Map(m => m.Scope).Default("enterprise");
            Map(m => m.DisplayName);
            Map(m => m.Hidden).Default(false);
            Map(m => m.TemplateKey);
            Map(m => m.Fields).Ignore();
        }
    }
}
