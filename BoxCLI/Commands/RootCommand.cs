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
        private readonly WebhooksCommand _webhooks;
        private readonly GroupCommand _group;
        private readonly MetadataTemplateCommand _mdt;
        private readonly CollaborationCommand _collab;
        private readonly EventCommand _evt;
        private readonly SharedItemCommand _si;
        private readonly LocalizedStringsResource _names;
        private CommandLineApplication _app;

        public RootCommand(UserCommand user, ConfigureCommand config, 
            FolderCommand folder, FileCommand file, WebhooksCommand webhooks, 
            GroupCommand group,  MetadataTemplateCommand mdt, EventCommand evt,
            CollaborationCommand collab, SharedItemCommand si, LocalizedStringsResource names)
        {
            _user = user;
            _config = config;
            _folder = folder;
            _file = file;
            _webhooks = webhooks;
            _group = group;
            _mdt = mdt;
            _evt = evt;
            _collab = collab;
            _si = si;
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
            app.Command(_names.CommandNames.Webhooks, _webhooks.Configure);
            app.Command(_names.CommandNames.Groups, _group.Configure);
            app.Command(_names.CommandNames.MetadataTemplates, _mdt.Configure);
            app.Command(_names.CommandNames.Events, _evt.Configure);
            app.Command(_names.CommandNames.Collaborations, _collab.Configure);
            app.Command(_names.CommandNames.SharedItems, _si.Configure);

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