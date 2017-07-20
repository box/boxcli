using BoxCLI.CommandUtilities.Globalization.Models;
using Microsoft.Extensions.Options;

namespace BoxCLI.CommandUtilities.Globalization
{
    public class LocalizedStringsResource
    {
        public readonly CommandNames CommandNames;
        public readonly SubCommandNames SubCommandNames;

        public LocalizedStringsResource(IOptions<LocalizedStrings> names)
        {
            CommandNames = names.Value.CommandNames;
            SubCommandNames = names.Value.SubCommandNames;
        }

    }
}