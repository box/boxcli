using System;
using Microsoft.Extensions.CommandLineUtils;
using Microsoft.Extensions.Logging;

namespace BoxCLI.Commands
{
    public class RootCommand
    {

        private readonly UserCommand _user;
        private readonly ConfigCommand _config;
        private readonly ILogger _logger;

        public RootCommand(UserCommand user, ConfigCommand config, ILogger<RootCommand> logger)
        {
            _user = user;
            _config = config;
            _logger = logger;
        }

        public void Configure(CommandLineApplication app)
        {
            app.HelpOption("-?|-h|--help");

            // Register commands
            app.Command("configure", _config.Configure);
            app.Command("users", _user.Configure);

            app.OnExecute(() =>
            {
                try
                {
                    this.Run(app);
                    return 0;
                }
                catch(Exception e) 
                {
                    _logger.LogDebug(e.Message);
                    return 1;
                }
            });
        }

        public void Run(CommandLineApplication app)
        {
            app.ShowHelp();
        }
    }
}