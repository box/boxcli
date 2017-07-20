using System;
using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;
using Microsoft.Extensions.Logging;

namespace BoxCLI.Commands
{
    public class RootCommand : HelpCommandBase
    {

        private readonly UserCommand _user;
        private readonly ConfigureCommand _config;
        private readonly FolderCommand _folder;
        private readonly FileCommand _file;
        private readonly LocalizedStringsResource _names;
        private CommandLineApplication _app;

        public RootCommand(UserCommand user, ConfigureCommand config, FolderCommand folder, FileCommand file, LocalizedStringsResource names)
        {
            _user = user;
            _config = config;
            _folder = folder;
            _file = file;
            _names = names;
        }

        public override void Configure(CommandLineApplication app)
        {
            // Register commands
            _app = app;
            app.Command(_names.CommandNames.Configure, _config.Configure);
            app.Command(_names.CommandNames.Users, _user.Configure);
            app.Command(_names.CommandNames.Folders, _folder.Configure);
            app.Command(_names.CommandNames.Files, _file.Configure);

            app.OnExecute(() =>
            {
                try
                {
                    return this.Execute();
                }
                catch (Exception e)
                {
                    Reporter.WriteError(e.Message);
                    return 1;
                }
            });
            base.Configure(app);
        }

        protected override int Execute()
        {
            _app.ShowHelp();
            return base.Execute();
        }
    }
}