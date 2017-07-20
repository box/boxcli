namespace BoxCLI.Commands
{
    public interface ISubCommandFactory
    {
         ISubCommand CreateSubCommand(string commandName);
    }
}