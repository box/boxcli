using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.CommandUtilities.CommandOptions
{
    public static class BulkFilePathOption
    {
        public static CommandOption ConfigureOption(CommandLineApplication command)
            => command.Option("--bulk-file-path <PATH>", "File path to bulk .csv or .json objects", CommandOptionType.SingleValue);
    }
}