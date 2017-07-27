using System;
using BoxCLI.BoxHome;
using BoxCLI.CommandUtilities;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.ConfigureSubCommands.ConfigureEnvironmentsSubCommands
{
    public class ConfigureEnvironmentsStartUserSessionCommand : ConfigureEnvironmentsSubCommandBase
    {
        private CommandOption _userId;
        private CommandOption _expires;
        private CommandLineApplication _app;
        public ConfigureEnvironmentsStartUserSessionCommand(IBoxHome boxHome) : base(boxHome)
        {
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Start a user session.";
            _userId = command.Option("--user-id",
                                "Provide a user ID for this session. If not set, the session uses your Default User for the current environment.",
                                CommandOptionType.SingleValue);
            _expires = command.Option("--expires",
                               "Make the session expire from a timespan set from now. If not set, the session expires in 8 hours. Use s for seconds, m for minutes, h for hours, d for days, w for weeks, M for months. For example, 30 seconds is 30s.",
                                CommandOptionType.SingleValue);
            command.OnExecute(() =>
            {
                return this.Execute();
            });
            base.Configure(command);
        }

        protected override int Execute()
        {
            this.RunStartSession();
            return base.Execute();
        }

        private void RunStartSession()
        {
            string id;
            if (this._userId.HasValue())
            {
                id = this._userId.Value();
                base._environments.SetTempAsUserIdSetting(id);
                base._environments.ToggleUseTempUserSetting(turnOn: true);
                base._environments.ToggleUseDefaultUserSetting(turnOff: true);
                base._environments.ToggleUserSessionEnabledSetting(turnOn: true);
            }
            else
            {
                id = base._environments.GetDefaultAsUserIdSetting();
                base._environments.ToggleUseDefaultUserSetting(turnOn: true);
                base._environments.ToggleUseTempUserSetting(turnOff: true);
                base._environments.ToggleUserSessionEnabledSetting(turnOn: true);
            }
            if (string.IsNullOrEmpty(id))
            {
                Reporter.WriteError("No user set and cannot start a user session.");
                base._environments.ExpireUserSession();
            }
            else
            {
                DateTime expiresAt;
                if (this._expires.HasValue())
                {
                    expiresAt = GeneralUtilities.GetDateTimeFromString(this._expires.Value());
                }
                else
                {
                    expiresAt = GeneralUtilities.GetDateTimeFromString("08h");
                }
                base._environments.SetUserSessionExpirationSetting(expiresAt);
                Reporter.WriteInformation($"Session started for User {id}. Session expires at {expiresAt}");
            }
        }
    }
}