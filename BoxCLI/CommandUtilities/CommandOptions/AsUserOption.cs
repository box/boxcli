using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.CommandUtilities.CommandOptions
{
    public static class AsUserOption
    {
        public static CommandOption ConfigureOption(CommandLineApplication command)
            => command.Option("--as-user <ID>", "Provide an ID for a user", CommandOptionType.SingleValue);
    }
}