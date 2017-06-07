using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands
{
    public class RootCommand
    {

        private readonly GreetCommand _greet;
        private readonly UserCommand _user;

        public RootCommand(GreetCommand greet, UserCommand user)
        {
            _greet = greet;
            _user = user;
        }

        public void Configure(CommandLineApplication app)
        {
            app.HelpOption("-?|-h|--help");

            // Register commands
            app.Command("greet", _greet.Configure);
            app.Command("user", _user.Configure);

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