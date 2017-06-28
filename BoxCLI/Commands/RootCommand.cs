using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands
{
    public class RootCommand
    {

        private readonly UserCommand _user;
        private readonly ConfigCommand _config;

        public RootCommand(UserCommand user, ConfigCommand config)
        {
            _user = user;
            _config = config;
        }

        public void Configure(CommandLineApplication app)
        {
            app.HelpOption("-?|-h|--help");

            // Register commands
            app.Command("configure", _config.Configure);
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