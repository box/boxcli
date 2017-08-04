using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.CommandUtilities.CommandOptions
{
    public static class IdOnlyOption
    {
        public static CommandOption ConfigureOption(CommandLineApplication command)
            => command.Option("--id-only", "Return only an ID to output from this command", CommandOptionType.NoValue);
    }
}