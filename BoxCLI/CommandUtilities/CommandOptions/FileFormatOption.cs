using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.CommandUtilities.CommandOptions
{
    public static class FileFormatOption
    {
        public static CommandOption ConfigureOption(CommandLineApplication command)
            => command.Option("--file-format <file-format>", "File format for report, JSON or CSV", CommandOptionType.SingleValue);
    }
}