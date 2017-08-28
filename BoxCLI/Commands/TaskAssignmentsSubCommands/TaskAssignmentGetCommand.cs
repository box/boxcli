using System;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.TaskAssignmentsSubCommands
{
    public class TaskAssignmentGetCommand : TaskAssignmentSubCommandBase
    {

        private CommandArgument _taskAssignmentId;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public TaskAssignmentGetCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get information about a task assignment.";
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
            await this.RunGet();
            return await base.Execute();
        }

        private async Task RunGet()
        {
            base.CheckForValue(this._taskAssignmentId.Value, this._app, "A task assignment ID is required for this command");
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            var taskAssignment = await boxClient.TasksManager.GetTaskAssignmentAsync(this._taskAssignmentId.Value);
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(taskAssignment);
                return;
            }
            base.PrintTaskAssignment(taskAssignment);
        }
    }
}
