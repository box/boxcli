using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.CommandUtilities.CommandOptions
{
    public static class FilePathOption
    {
        public static CommandOption ConfigureOption(CommandLineApplication command)
            => command.Option("--save-to-file-path <FILEPATH>", "Override default file path", CommandOptionType.SingleValue);
    }
}