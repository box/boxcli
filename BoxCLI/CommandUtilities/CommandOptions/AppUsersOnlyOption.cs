using System;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.CommandUtilities.CommandOptions
{
    public static class AppUsersOnlyOption
    {
		public static CommandOption ConfigureOption(CommandLineApplication command)
			=> command.Option("--app-users", "Limit results to app users only", CommandOptionType.NoValue);
    }
}
