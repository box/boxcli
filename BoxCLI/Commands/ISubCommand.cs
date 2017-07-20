using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands
{
    public interface ISubCommand
    {
         void Configure(CommandLineApplication command);
    }
}