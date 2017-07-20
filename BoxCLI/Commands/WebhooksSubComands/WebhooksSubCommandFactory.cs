using System;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.WebhooksSubComands
{
    public class WebhooksSubCommandFactory : AbstractBoxSubCommandFactory
    {
        public WebhooksSubCommandFactory(IBoxPlatformServiceBuilder builder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(builder, boxHome, names)
        {
        }

        public override ISubCommand CreateSubCommand(string commandName)
        {
            if (commandName == base._names.SubCommandNames.Get)
            {
                return new WebhooksGetCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (commandName == base._names.SubCommandNames.List)
            {
                return new WebhooksListCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (commandName == base._names.SubCommandNames.Update)
            {
                return new WebhooksUpdateCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (commandName == base._names.SubCommandNames.Create)
            {
                return new WebhooksCreateCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (commandName == base._names.SubCommandNames.Delete)
            {
                return new WebhooksDeleteCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else
            {
                throw new Exception("Command not registered.");
            }
        }
    }
}