using System;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.UserSubCommands
{
    public class UserUpdateCommand : UserSubCommandBase
    {
        private CommandArgument _userId;
        private CommandOption _enterprise;
        private CommandOption _name;
        private CommandOption _role;
        private CommandOption _language;
        private CommandOption _syncEnable;
        private CommandOption _syncDisable;
        private CommandOption _jobTitle;
        private CommandOption _phoneNumber;
        private CommandOption _address;
        private CommandOption _spaceAmount;
        private CommandOption _status;
        private CommandOption _isExemptFromDeviceLimits;
        private CommandOption _notExemptFromDeviceLimits;
        private CommandOption _isExemptFromLoginVerificaton;
        private CommandOption _notExemptFromLoginVerification;
        private CommandOption _isPasswordResetRequired;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public UserUpdateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Update a Box User";
            _userId = command.Argument("userId",
                                   "User ID to Update");
            _enterprise = command.Option("--remove", "Remove the user from the enterprise, convert to free account", CommandOptionType.NoValue);
            _name = command.Option("-n|--name", "New name of user", CommandOptionType.SingleValue);
            _role = command.Option("-r|--role", "Role of user. Enter user or coadmin", CommandOptionType.SingleValue);
            _language = command.Option("-l|--language", "Language of the user (ISO 639-1 Language Code)", CommandOptionType.SingleValue);
            _syncEnable = command.Option("--sync-enable", "Enable Sync for this user", CommandOptionType.NoValue);
            _syncDisable = command.Option("--sync-disable", "Disable Box Sync for this user", CommandOptionType.NoValue);
            _jobTitle = command.Option("-j|--job-title", "Job title of the user", CommandOptionType.SingleValue);
            _phoneNumber = command.Option("-p|--phone-number", "Phone number of the user", CommandOptionType.SingleValue);
            _address = command.Option("-a|--address", "Address of the user", CommandOptionType.SingleValue);
            _spaceAmount = command.Option("-d|--disk-space", "User's available storage in bytes. Value of -1 grants unlimited storage", CommandOptionType.SingleValue);
            _status = command.Option("-s|--status", "User status. Enter active, inactive, cannot_delete_edit, or cannot_delete_edit_upload", CommandOptionType.SingleValue);
            _isExemptFromDeviceLimits = command.Option("--is-exempt-from-device-limits", "Exempt user from device limits", CommandOptionType.NoValue);
            _notExemptFromDeviceLimits = command.Option("--not-exempt-from-device-limits", "User is not exempt from device limits", CommandOptionType.NoValue);
            _isExemptFromLoginVerificaton = command.Option("--is-exempt-login-verification", "Exempt user from two-factor auth", CommandOptionType.NoValue);
            _notExemptFromLoginVerification = command.Option("--not-exempt-login-verification", "User is not exempt from two-factor auth", CommandOptionType.NoValue);
            _isPasswordResetRequired = command.Option("--password-reset", "Force the user to reset password", CommandOptionType.NoValue);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunUpdate();
            return await base.Execute();
        }

        private async Task RunUpdate()
        {
            base.CheckForUserId(this._userId.Value, this._app);
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var userRequest = base.CreateUserRequest(this._name.Value(), this._userId.Value, this._role.Value(), this._enterprise.HasValue(),
            this._language.Value(), this._jobTitle.Value(), this._phoneNumber.Value(), this._address.Value(), this._spaceAmount.Value(),
            this._status.Value(), this._syncDisable.HasValue(), this._syncEnable.HasValue(), this._isExemptFromDeviceLimits.HasValue(),
            this._notExemptFromDeviceLimits.HasValue(), this._isExemptFromLoginVerificaton.HasValue(), this._notExemptFromLoginVerification.HasValue(),
            this._isPasswordResetRequired.HasValue());

            BoxUser updatedUser = await boxClient.UsersManager.UpdateUserInformationAsync(userRequest);

            if (updatedUser.Id == this._userId.Value)
            {
                if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
                {
                    base.OutputJson(updatedUser);
                    return;
                }
                Reporter.WriteSuccess($"Updated user {this._userId.Value}");
                base.PrintUserInfo(updatedUser);
            }
            else
            {
                Reporter.WriteError($"Couldn't update user {this._userId.Value}");
            }
        }

    }
}