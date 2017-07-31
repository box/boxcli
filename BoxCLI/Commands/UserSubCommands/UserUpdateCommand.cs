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
        public UserUpdateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
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
            _phoneNumber = command.Option("-p|--phone-number","Phone number of the user", CommandOptionType.SingleValue);
            _address = command.Option("-a|--address", "Address of the user", CommandOptionType.SingleValue);
            _spaceAmount = command.Option("-d|--disk-space","User's available storage in bytes. Value of -1 grants unlimited storage", CommandOptionType.SingleValue);
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
            var boxClient = base.ConfigureBoxClient(returnServiceAccount: true);
            var userRequest = CreateUserRequest();

            BoxUser updatedUser = await boxClient.UsersManager.UpdateUserInformationAsync(userRequest);

            if(updatedUser.Id == this._userId.Value)
            {
                Reporter.WriteSuccess($"Updated user {this._userId.Value}");
                base.PrintUserInfo(updatedUser);
            }
            else
            {
                Reporter.WriteError($"Couldn't update user {this._userId.Value}");
            }
        }

        private BoxUserRequest CreateUserRequest()
        {
            if(this._syncDisable.HasValue() && this._syncEnable.HasValue())
            {
                throw new Exception("--sync-disable and --sync-enable cannot be passed in a single call");
            }
            if(this._isExemptFromDeviceLimits.HasValue() && this._notExemptFromDeviceLimits.HasValue())
            {
                throw new Exception("--is-exempt-from-device-limits and --not-exempt-from-device-limits cannot be passed in a single call");
            }
            if(this._isExemptFromLoginVerificaton.HasValue() && this._notExemptFromLoginVerification.HasValue())
            {
                throw new Exception("--is-exempt-login-verification and --not-exempt-login-verification cannot be passed in a single call");
            }

            BoxUserRequest userRequest = new BoxUserRequest()
            {
                Id = this._userId.Value
            };
            if(this._enterprise.HasValue()) { userRequest.Enterprise = "null"; }
            if(this._name.HasValue()) { userRequest.Name = this._name.Value(); }
            if(this._role.HasValue()) { userRequest.Role = this._role.Value(); }
            if(this._language.HasValue()) { userRequest.Language = this._language.Value(); }
            if(this._syncEnable.HasValue()) { userRequest.IsSyncEnabled = true; }
            if(this._syncDisable.HasValue()) { userRequest.IsSyncEnabled = false; }
            if(this._jobTitle.HasValue()) { userRequest.JobTitle = this._jobTitle.Value(); }
            if(this._phoneNumber.HasValue()) { userRequest.Phone = this._phoneNumber.Value(); }
            if(this._address.HasValue()) { userRequest.Address = this._address.Value(); }
            if(this._spaceAmount.HasValue()) { userRequest.SpaceAmount = double.Parse(this._spaceAmount.Value()); }
            if(this._status.HasValue()) { userRequest.Status = this._status.Value(); }
            if(this._isExemptFromDeviceLimits.HasValue()) { userRequest.IsExemptFromDeviceLimits = true; }
            if(this._notExemptFromDeviceLimits.HasValue()) { userRequest.IsExemptFromDeviceLimits = false; }
            if(this._isExemptFromLoginVerificaton.HasValue()) { userRequest.IsExemptFromLoginVerification = true; }
            if(this._notExemptFromLoginVerification.HasValue()) { userRequest.IsExemptFromLoginVerification = false;}
            if(this._isPasswordResetRequired.HasValue()) { userRequest.IsPasswordResetRequired = true; }

            return userRequest;
        }
    }
}