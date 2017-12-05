using System;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.TaskAssignmentsSubCommands
{
    public class TaskAssignmentDeleteCommand : TaskAssignmentSubCommandBase
    {
        private CommandArgument _taskAssignmentId;
        private CommandLineApplication _app;
        public TaskAssignmentDeleteCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Delete a task assignment.";
            _taskAssignmentId = command.Argument("taskAssignmentId",
                                   "Id of task assignment");

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
            base.CheckForValue(this._taskAssignmentId.Value, this._app, "A task assignment ID is required for this command");
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            bool deleted;
            try
            {
                deleted = await boxClient.TasksManager.DeleteTaskAssignmentAsync(this._taskAssignmentId.Value);
                if (deleted)
                {
                    Reporter.WriteSuccess($"Successfully deleted task {this._taskAssignmentId.Value}.");
                }
                else
                {
                    Reporter.WriteError("Couldn't delete task.");
                }
            }
            catch (Exception e)
            {
                Reporter.WriteError("Couldn't delete task.");
                Reporter.WriteError(GeneralUtilities.FormatErrorResponseFromAPI(e));
            }
        }
    }
}
