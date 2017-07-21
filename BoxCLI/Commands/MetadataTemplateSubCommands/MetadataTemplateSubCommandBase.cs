using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.MetadataTemplateSubCommands
{
    public class MetadataTemplateSubCommandBase : BoxBaseCommand
    {
        public MetadataTemplateSubCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }

        protected virtual void PrintMetadataTemplate(BoxMetadataTemplate mdt)
        {
            Reporter.WriteInformation($"Template Name: {mdt.DisplayName}");
            Reporter.WriteInformation($"Template Key: {mdt.TemplateKey}");
            Reporter.WriteInformation($"Template Scope: {mdt.Scope}");
            if (mdt.Fields != null && mdt.Fields.Count > 0)
            {
                foreach (var field in mdt.Fields)
                {
                    Reporter.WriteInformation($"Field Type: {field.Type}");
                    Reporter.WriteInformation($"Field Name: {field.DisplayName}");
                    Reporter.WriteInformation($"Field Key: {field.Key}");
                    if (field.Options != null && field.Options.Count > 0)
                    {
                        foreach (var option in field.Options)
                        {
                            Reporter.WriteInformation($"Option Key: {option.Key}");
                        }
                    }
                }
            }
        }
    }
}