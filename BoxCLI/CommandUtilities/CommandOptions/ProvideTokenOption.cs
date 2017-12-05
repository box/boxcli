using System;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.CommandUtilities.CommandOptions
{
    public static class ProvideTokenOption
    {
        public static CommandOption ConfigureOption(CommandLineApplication command)
            => command.Option("--token <TOKEN>", "Provide a token to perform this call", CommandOptionType.SingleValue);
    }
}
