using System;
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
    public class UserListCommand : UserSubCommandBase
    {
        private CommandOption _save;
        private CommandOption _path;
        private CommandOption _fileFormat;
        private CommandOption _fieldsOption;
        private CommandOption _managedUsers;
        private CommandOption _appUsers;
        private CommandOption _limit;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public UserListCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "List all Box users.";
            _managedUsers = ManagedUsersOnlyOption.ConfigureOption(command);
            _appUsers = AppUsersOnlyOption.ConfigureOption(command);
            _save = SaveOption.ConfigureOption(command);
            _path = FilePathOption.ConfigureOption(command);
            _fileFormat = FileFormatOption.ConfigureOption(command);
            _fieldsOption = FieldsOption.ConfigureOption(command);
            _limit = LimitOption.ConfigureOption(command);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunList();
            return await base.Execute();
        }

        public async Task RunList()
        {
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var BoxCollectionsIterators = base.GetIterators(!String.IsNullOrEmpty(base._oneUseToken.Value()));
            var fileName = $"{base._names.CommandNames.Users}-{base._names.SubCommandNames.List}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
            var fields = base.ProcessFields(this._fieldsOption.Value(), base._fields);
            if (this._save.HasValue())
            {
                Reporter.WriteInformation("Saving file...");
                BoxCollection<BoxUser> users;
                if (this._appUsers.HasValue())
                {
                    users = await boxClient.UsersManager.GetEnterpriseUsersAsync(fields: fields, autoPaginate: true, filterTerm: "AppUser");
                }
                else if (this._managedUsers.HasValue())
                {
                    users = await boxClient.UsersManager.GetEnterpriseUsersAsync(fields: fields, autoPaginate: true);
                    users.Entries.RemoveAll(user =>
                    {
                        return user.Login.Contains("AppUser");
                    });
                    users.TotalCount = users.Entries.Count;
                }
                else
                {
                    users = await boxClient.UsersManager.GetEnterpriseUsersAsync(fields: fields, autoPaginate: true);
                }

                var saved = base.WriteOffsetCollectionResultsToReport<BoxUser, BoxUserMap>(users, fileName, this._path.Value(), this._fileFormat.Value());
                if (saved)
                {
                    Reporter.WriteSuccess("File saved.");
                }
                else
                {
                    Reporter.WriteError("Error while saving file.");
                }
                return;
            }
            if (this._managedUsers.HasValue())
            {
                var users = await boxClient.UsersManager.GetEnterpriseUsersAsync(fields: fields, autoPaginate: true);
                users.Entries.RemoveAll(user =>
                {
                    return user.Login.Contains("AppUser");
                });
                users.TotalCount = users.Entries.Count;
                if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
                {
                    base.OutputJson(users);
                    return;
                }
                var showNext = "";
                while (users.Entries.Count > 0 && showNext != "q")
                {
                    showNext = BoxCollectionsIterators.PageInConsole<BoxUser>(PrintUserInfo, users);
                }
                Reporter.WriteInformation("Finished...");
                return;
            }
            else if (this._appUsers.HasValue())
            {
                var users = await boxClient.UsersManager.GetEnterpriseUsersAsync(fields: fields, autoPaginate: true, filterTerm: "AppUser");
                if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
                {
                    base.OutputJson(users);
                    return;
                }
                var showNext = "";
                while (users.Entries.Count > 0 && showNext != "q")
                {
                    showNext = BoxCollectionsIterators.PageInConsole<BoxUser>(PrintUserInfo, users);
                }
                Reporter.WriteInformation("Finished...");
                return;
            }
            else
            {
                if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
                {
                    var users = await boxClient.UsersManager.GetEnterpriseUsersAsync(fields: fields, autoPaginate: true);
                    base.OutputJson(users);
                    return;
                }
                int limit = -1;
                if (this._limit.HasValue())
                {
                    try
                    {
                        limit = Convert.ToInt32(this._limit.Value());
                    }
                    catch { }
                }
                await BoxCollectionsIterators.ListOffsetCollectionToConsole<BoxUser>((offset) =>
                {
                    return boxClient.UsersManager.GetEnterpriseUsersAsync(offset: offset);
                }, PrintUserInfo, limit);
            }
            Reporter.WriteInformation("Finished...");
        }
    }
}