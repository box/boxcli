using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.CommandUtilities.CommandOptions
{
    public static class ManagedUsersOnlyOption
    {
        public static CommandOption ConfigureOption(CommandLineApplication command)
            => command.Option("-m|--managed-users", "Limit results to managed users only", CommandOptionType.NoValue);
    }
}