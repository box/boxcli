using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.CommandUtilities.CommandOptions
{
    public static class FilePathOption
    {
        public static CommandOption ConfigureOption(CommandLineApplication command)
            => command.Option("--save-to-file-path <file-path>", "Override default file path to save report", CommandOptionType.SingleValue);
    }
}