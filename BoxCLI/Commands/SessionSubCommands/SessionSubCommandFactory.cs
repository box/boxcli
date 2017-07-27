using System;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.SessionSubCommands
{
    public class SessionSubCommandFactory : AbstractBoxSubCommandFactory
    {
        public SessionSubCommandFactory(IBoxPlatformServiceBuilder builder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(builder, boxHome, names)
        {
        }

        public override ISubCommand CreateSubCommand(string commandName)
        {

            if (commandName == _names.SubCommandNames.StartUserSession)
            {
                return new SessionStartUserSessionCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (commandName == _names.SubCommandNames.EndUserSession)
            {
                return new SessionEndUserSessionCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (commandName == _names.SubCommandNames.GetSessionExpiration)
            {
                return new SessionGetSessionExpirationCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else if (commandName == _names.SubCommandNames.BustCache)
            {
                return new SessionBustCacheCommand(_boxPlatformBuilder, _boxHome, _names);
            }
            else
            {
                throw new Exception("Command not registered.");
            }
        }
    }
}