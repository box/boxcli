using System;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.TaskSubCommands
{
    public class TaskDeleteCommand : TaskSubCommandBase
    {
        private CommandArgument _taskId;
        private CommandLineApplication _app;
        public TaskDeleteCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Delete a task.";
            _taskId = command.Argument("taskId",
                                   "Id of task");

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
            base.CheckForValue(this._taskId.Value, this._app, "A task ID is required for this command");
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            bool deleted;
            try
            {
                deleted = await boxClient.TasksManager.DeleteTaskAsync(this._taskId.Value);
                if (deleted)
                {
                    Reporter.WriteSuccess($"Successfully deleted task {this._taskId.Value}.");
                }
                else
                {
                    Reporter.WriteError("Couldn't delete task.");
                }
            }
            catch (Exception e)
            {
                Reporter.WriteError("Couldn't delete task.");
                Reporter.WriteError(e.Message);
            }
        }
    }
}
