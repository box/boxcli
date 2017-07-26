using System;
using System.Threading.Tasks;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands
{
    public abstract class CommandBase : ISubCommand
    {
        public virtual void Configure(CommandLineApplication command)
        {
            var noColor = command.Option("--no-color", "Turn off colors for logging", CommandOptionType.NoValue);
            var prefixOutput = command.Option("--prefix-output", "Show prefix information for logging.", CommandOptionType.NoValue);

            command.OnExecute(
                () =>
                {
                    Reporter.NoColor = noColor.HasValue();
                    Reporter.PrefixOutput = prefixOutput.HasValue();

                    Validate();

                    return Execute();
                });
        }

        protected virtual void Validate()
        {
        }

        protected virtual int Execute()
            => 0;

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