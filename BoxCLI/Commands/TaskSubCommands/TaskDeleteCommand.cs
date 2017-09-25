using System;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.TaskSubCommands
{
    public class TaskDeleteCommand : TaskSubCommandBase
    {
        private CommandArgument _taskId;
        private CommandOption _dontPrompt;
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
            _dontPrompt = SuppressDeletePromptOption.ConfigureOption(command);
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
                if (this._dontPrompt.HasValue())
                {
                    deleted = await boxClient.TasksManager.DeleteTaskAsync(this._taskId.Value);
                }
                else
                {
                    Reporter.WriteWarningNoNewLine("Are you sure you want to delete this task? y/N ");
                    var yNKey = "n";
                    yNKey = Console.ReadLine().ToLower();
                    if (yNKey != "y")
                    {
                        Reporter.WriteInformation("Aborted task deletion.");
                        return;
                    }
                    else
                    {
                        deleted = await boxClient.TasksManager.DeleteTaskAsync(this._taskId.Value);
                    }
                }

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
                Reporter.WriteError(GeneralUtilities.FormatErrorResponseFromAPI(e));
            }
        }
    }
}
