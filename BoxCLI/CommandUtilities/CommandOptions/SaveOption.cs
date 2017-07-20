using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.CommandUtilities.CommandOptions
{
    public static class SaveOption
    {
        public static CommandOption ConfigureOption(CommandLineApplication command)
            => command.Option("-s|--save <save>", "Save report to disk", CommandOptionType.NoValue);
    }
}