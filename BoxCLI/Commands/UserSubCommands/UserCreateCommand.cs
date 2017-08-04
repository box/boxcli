using System;
using System.Linq;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.CsvModels;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.UserSubCommands
{
    public class UserCreateCommand : UserSubCommandBase
    {
        private CommandArgument _name;
        private CommandArgument _login;
        private CommandOption _path;
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
        private CommandOption _appUser;
        private CommandOption _idOnly;
        private CommandLineApplication _app;
        public UserCreateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names) : base(boxPlatformBuilder, home, names)
        {
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Create a new Box User";
            _name = command.Argument("name", "The user's name");
            _login = command.Argument("name", "The user's email address, not required when creating app users.");
            _path = BulkFilePathOption.ConfigureOption(command);
            _appUser = command.Option("--app-user", "Set this user as an app user", CommandOptionType.NoValue);
            _idOnly = IdOnlyOption.ConfigureOption(command);
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
            await RunCreate();
            return await base.Execute();
        }

        private async Task RunCreate()
        {
            var boxClient = base.ConfigureBoxClient(returnServiceAccount: true);
            if (this._path.HasValue())
            {
                await base.CreateUsersFromFile(this._path.Value());
                return;
            }
            base.CheckForValue(this._name.Value, this._app, "A name is required for this command.");
            if (!this._appUser.HasValue())
            {
                if (string.IsNullOrEmpty(this._login.Value))
                {
                    throw new Exception("A login is required for this command.");
                }
            }
            var userRequest = base.CreateUserRequest(this._name.Value, "", this._role.Value(), false,
            this._language.Value(), this._jobTitle.Value(), this._phoneNumber.Value(), this._address.Value(), this._spaceAmount.Value(),
            this._status.Value(), this._syncDisable.HasValue(), this._syncEnable.HasValue(), this._isExemptFromDeviceLimits.HasValue(),
            this._notExemptFromDeviceLimits.HasValue(), this._isExemptFromLoginVerificaton.HasValue(), this._notExemptFromLoginVerification.HasValue(),
            this._isPasswordResetRequired.HasValue());
            if (this._appUser.HasValue())
            {
                userRequest.IsPlatformAccessOnly = true;
            }
            var user = await boxClient.UsersManager.CreateEnterpriseUserAsync(userRequest);
            if (this._idOnly.HasValue())
            {
                Reporter.WriteInformation(user.Id);
                return;
            }
            Reporter.WriteSuccess("Created user.");
            base.PrintUserInfo(user);
        }
    }
}