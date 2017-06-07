using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands
{
    public class RootCommand
    {

        private readonly GreetCommand _greet;

        public RootCommand(GreetCommand greet)
        {
            _greet = greet;
        }

        public void Configure(CommandLineApplication app)
        {
            app.HelpOption("-?|-h|--help");

            // Register commands
            app.Command("greet", _greet.Configure);

            app.OnExecute(() =>
            {
                this.Run(app);
                return 0;
            });
        }

        public void Run(CommandLineApplication app)
        {
            app.ShowHelp();
        }
    }
}