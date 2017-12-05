using System;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.TaskAssignmentsSubCommands
{
    public class TaskAssignmentUpdateCommand : TaskAssignmentSubCommandBase
    {
        private CommandArgument _taskAssignmentId;
        private CommandOption _message;
        private CommandOption _completed;
        private CommandOption _incomplete;
        private CommandOption _approved;
        private CommandOption _rejected;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public TaskAssignmentUpdateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Update a task assignment.";
            _taskAssignmentId = command.Argument("taskAssignmentId",
                                   "Id of task assignment");
            _message = command.Option("--message", "A message from the assignee about this task", CommandOptionType.SingleValue);
            _completed = command.Option("--completed", "Change resolution state to completed.", CommandOptionType.NoValue);
            _incomplete = command.Option("--incomplete", "Change resolution state to incomplete.", CommandOptionType.NoValue);
            _approved = command.Option("--approved", "Change resolution state to approved.", CommandOptionType.NoValue);
            _rejected = command.Option("--rejected", "Change resolution state to rejected.", CommandOptionType.NoValue);
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
            base.CheckForValue(this._taskAssignmentId.Value, this._app, "A task assignment ID is required for this command");
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var taskAssignmentUpdate = new BoxTaskAssignmentUpdateRequest();
            taskAssignmentUpdate.Id = this._taskAssignmentId.Value;
            if (this._completed.HasValue())
            {
                taskAssignmentUpdate.ResolutionState = ResolutionStateType.completed;
            }
            else if (this._incomplete.HasValue())
            {
                taskAssignmentUpdate.ResolutionState = ResolutionStateType.incomplete;
            }
            else if (this._approved.HasValue())
            {
                taskAssignmentUpdate.ResolutionState = ResolutionStateType.approved;
            }
            else if (this._rejected.HasValue())
            {
                taskAssignmentUpdate.ResolutionState = ResolutionStateType.rejected;
            }

            if (this._message.HasValue())
            {
                taskAssignmentUpdate.Message = this._message.Value();
            }
            var taskAssignment = await boxClient.TasksManager.UpdateTaskAssignmentAsync(taskAssignmentUpdate);
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(taskAssignment);
                return;
            }
            Reporter.WriteSuccess("Updated task assignment.");
            base.PrintTaskAssignment(taskAssignment);
        }
    }
}
