using System;
using BoxCLI.BoxHome;
using Microsoft.Extensions.CommandLineUtils;
using Microsoft.Extensions.Logging;

namespace BoxCLI.Commands
{
    public class RootCommand
    {

        private readonly UserCommand _user;
        private readonly ConfigCommand _config;
        private readonly FolderCommand _folder;
        private readonly FileCommand _file;
        private readonly IBoxHome _boxHome;
        private readonly ILogger _logger;

        public RootCommand(UserCommand user, ConfigCommand config, FolderCommand folder, FileCommand file,
            IBoxHome boxHome, ILogger<RootCommand> logger)
        {
            _user = user;
            _config = config;
            _folder = folder;
            _file = file;
            _boxHome = boxHome;
            _logger = logger;
        }

        public virtual void Configure(CommandLineApplication app)
        {
            app.HelpOption("-?|-h|--help");

            // Register commands
            app.Command("configure", _config.Configure);
            app.Command("users", _user.Configure);
            app.Command("folders", _folder.Configure);
            app.Command("files", _file.Configure);

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