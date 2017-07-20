using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.CommandUtilities.CommandOptions
{
    public class OutputJsonOption
    {
        public static CommandOption ConfigureOption(CommandLineApplication command)
            => command.Option("--json", "Output JSON string", CommandOptionType.NoValue);
    }
}