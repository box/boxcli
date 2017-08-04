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
        private CommandOption _path;
        private CommandOption _coAdmin;
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
            _path = BulkFilePathOption.ConfigureOption(command);
            _coAdmin = command.Option("--co-admin", "Set this user as a co-admin", CommandOptionType.NoValue);
            _appUser = command.Option("--app-user", "Set this user as an app user", CommandOptionType.NoValue);
            _idOnly = command.Option("--id-only", "Return only an ID to output from this command", CommandOptionType.NoValue);
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
            var userRequest = new BoxUserRequest();
            userRequest.Name = this._name.Value;
            if(this._appUser.HasValue())
            {
                userRequest.IsPlatformAccessOnly = true;
                var user = await boxClient.UsersManager.CreateEnterpriseUserAsync(userRequest);
                if(this._idOnly.HasValue())
                {
                    Reporter.WriteInformation(user.Id);
                }
                return;
            }
        }
    }
}