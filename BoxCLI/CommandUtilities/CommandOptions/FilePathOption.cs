using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.CommandUtilities.CommandOptions
{
    public static class FilePathOption
    {
        public static CommandOption ConfigureOption(CommandLineApplication command)
            => command.Option("--file-path <file-path>", "File path to save report", CommandOptionType.SingleValue);
    }
}