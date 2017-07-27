using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.GroupSubCommands
{
    public class GroupDeleteCommand : GroupSubCommandBase
    {
        private CommandArgument _groupId;
        private CommandLineApplication _app;
        public GroupDeleteCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names) 
            : base(boxPlatformBuilder, home, names)
        {
        }
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Delete a group.";
            _groupId = command.Argument("groupId",
                                   "Id of group");

            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunDelete();
            return await base.Execute();
        }

        private async Task RunDelete()
        {
            base.CheckForValue(this._groupId.Value, this._app, "A group ID is required for this command");
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            var result = await boxClient.GroupsManager.DeleteAsync(this._groupId.Value);
            if(result)
            {
                Reporter.WriteSuccess($"Deleted group {this._groupId.Value}");
            }
            else
            {
                Reporter.WriteError($"Couldn't delete group {this._groupId.Value}");
            }
        }
    }
}