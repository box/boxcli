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
        private CommandOption _limit;
        private CommandLineApplication _app;
        public UserListCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "List all Box users.";
            _managedUsers = ManagedUsersOnlyOption.ConfigureOption(command);
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
            await this.RunList(_managedUsers.HasValue(), _save.HasValue(),
                        _path.Value(), _fileFormat.Value(), _fieldsOption.Value());
            return await base.Execute();
        }

        public async Task RunList(bool managedOnly = false, bool save = false, string path = "", string fileFormat = "", string rawFields = "")
        {
            var boxClient = base.ConfigureBoxClient(returnServiceAccount: true);
            var BoxCollectionsIterators = base.GetIterators();
            var fileName = $"{base._names.CommandNames.Users}-{base._names.SubCommandNames.List}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
            var fields = base.ProcessFields(rawFields, base._fields);
            try
            {
                if (managedOnly)
                {
                    var users = await boxClient.UsersManager.GetEnterpriseUsersAsync(fields: fields, autoPaginate: true);
                    users.Entries.RemoveAll(user =>
                    {
                        return user.Login.Contains("AppUser");
                    });
                    if (save == true)
                    {
                        base.WriteOffsetCollectionResultsToReport<BoxUser, BoxUserMap>(users, fileName, path, fileFormat.ToLower());
                    }
                    else
                    {
                        var showNext = "";
                        while (users.Entries.Count > 0 && showNext != "q")
                        {
                            showNext = BoxCollectionsIterators.PageInConsole<BoxUser>(PrintUserInfo, users);
                        }
                    }
                    System.Console.WriteLine("Finished...");
                    return;
                }
                if (save == true)
                {
                    System.Console.WriteLine("Saving file...");
                    System.Console.WriteLine(fileFormat);
                    var users = await boxClient.UsersManager.GetEnterpriseUsersAsync(fields: fields, autoPaginate: true);
                    System.Console.WriteLine(users.TotalCount);
                    var saved = base.WriteOffsetCollectionResultsToReport<BoxUser, BoxUserMap>(users, fileName, path, fileFormat);
                    System.Console.WriteLine($"File saved: {saved}");
                }
                else
                {
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
                System.Console.WriteLine("Finished...");
            }
            catch (Exception e)
            {
                Reporter.WriteError(e.Message);
            }
        }
    }
}