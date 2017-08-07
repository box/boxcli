using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.CommandUtilities.CommandOptions
{
    public static class LimitOption
    {
        public static CommandOption ConfigureOption(CommandLineApplication command)
            => command.Option("--limit <LIMIT>", "Limit the number of items returned", CommandOptionType.SingleValue);
    }
}