using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.CommandUtilities.CommandOptions
{
    public static class FieldsOption
    {
        public static CommandOption ConfigureOption(CommandLineApplication command)
            => command.Option("--fields <FIELDS>", "The fields to include in the Box response, separate each field with a comma", CommandOptionType.SingleValue);
    }
}