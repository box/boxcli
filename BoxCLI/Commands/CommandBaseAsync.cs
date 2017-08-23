using System;
using System.Threading.Tasks;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands
{
    public abstract class CommandBaseAsync : ISubCommand
    {
        public virtual void Configure(CommandLineApplication command)
        {
            var noColor = command.Option("--no-color", "Turn off colors for logging", CommandOptionType.NoValue);
            var prefixOutput = command.Option("--prefix-output", "Show prefix information for logging.", CommandOptionType.NoValue);
            
            command.OnExecute(
                async () =>
                {
                    Reporter.NoColor = noColor.HasValue();
                    Reporter.PrefixOutput = prefixOutput.HasValue();

                    Validate();

                    return await Execute();
                });
        }

        protected virtual void Validate()
        {
        }

        protected async virtual Task<int> Execute()
            => await Task.FromResult(0);

        protected virtual void CheckForValue(string value, CommandLineApplication app, string message)
        {
            if (string.IsNullOrEmpty(value))
            {
                app.ShowHelp();
                throw new Exception(message);
            }
        }
    }
}