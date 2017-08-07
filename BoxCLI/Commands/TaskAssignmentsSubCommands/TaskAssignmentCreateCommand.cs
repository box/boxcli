using System;
using System.Threading.Tasks;
using Box.V2.Models;
using Box.V2.Models.Request;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;
namespace BoxCLI.Commands.TaskAssignmentsSubCommands
{
    public class TaskAssignmentCreateCommand : TaskAssignmentSubCommandBase
    {
        private CommandArgument _taskId;
        private CommandOption _assignToUserId;
        private CommandOption _assignToUserLogin;

        private CommandLineApplication _app;
        public TaskAssignmentCreateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Create a task assignment.";
            _taskId = command.Argument("taskId",
                                   "Id of task to assign");
            _assignToUserId = command.Option("--assign-to-user-id", "Assign task by user ID", CommandOptionType.SingleValue);
            _assignToUserLogin = command.Option("--assign-to-user-login", "Assign task by user login", CommandOptionType.SingleValue);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunCreate();
            return await base.Execute();
        }

        private async Task RunCreate()
        {
            try
            {
                base.CheckForValue(this._taskId.Value, this._app, "A task ID is required for this command");
                if (!this._assignToUserId.HasValue() && !this._assignToUserLogin.HasValue())
                {
                    this._app.ShowHelp();
                    Reporter.WriteError("You must include a user ID or login for this command.");
                    return;
                }
                var boxClient = base.ConfigureBoxClient(base._asUser.Value());
                var taskAssignmentCreate = new BoxTaskAssignmentRequest();
                taskAssignmentCreate.Task = new BoxTaskRequest();
                taskAssignmentCreate.Task.Id = this._taskId.Value;
                taskAssignmentCreate.AssignTo = new BoxAssignmentRequest();
                if (this._assignToUserId.HasValue())
                {
                    taskAssignmentCreate.AssignTo.Id = this._assignToUserId.Value();
                }
                else if (this._assignToUserLogin.HasValue())
                {
                    taskAssignmentCreate.AssignTo.Login = this._assignToUserLogin.Value();
                }

                Reporter.WriteSuccess("Created task assignment.");
                base.PrintTaskAssignment(await boxClient.TasksManager.CreateTaskAssignmentAsync(taskAssignmentCreate));
            }
            catch (Exception e)
            {
                Reporter.WriteError("Couldn't create task assignment.");
                Reporter.WriteError(e.Message);
            }
        }
    }
}
