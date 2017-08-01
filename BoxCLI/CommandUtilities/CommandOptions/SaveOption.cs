using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.CommandUtilities.CommandOptions
{
    public static class SaveOption
    {
        public static CommandOption ConfigureOption(CommandLineApplication command)
            => command.Option("-s|--save", "Save report to default reports folder on disk", CommandOptionType.NoValue);
    }
}