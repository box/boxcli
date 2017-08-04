using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.CommandUtilities.CommandOptions
{
    public static class SuppressDeletePromptOption
    {
        public static CommandOption ConfigureOption(CommandLineApplication command)
            => command.Option("-y|--yes", "Automatically acknowledge delete prompts with 'yes'", CommandOptionType.NoValue);
    }
}