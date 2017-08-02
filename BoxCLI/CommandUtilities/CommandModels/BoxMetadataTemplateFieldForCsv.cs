using System;
using System.Collections.Generic;
using Box.V2.Models;

namespace BoxCLI.CommandUtilities.CommandModels
{
    public class BoxMetadataTemplateFieldForCsv : BoxMetadataTemplateField
    {
        public List<string> OptionsFromCsv { get; set; }

        public string TemplateKey { get; set; }

        public BoxMetadataTemplateFieldForCsv()
         : base()
        {
            
        }
    }
}
