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
namespace BoxCLI.Commands.TaskAssignmentsSubCommands
{
	public class TaskAssignmentListCommand : TaskAssignmentSubCommandBase
	{

		private CommandArgument _taskId;
        private CommandOption _save;
        private CommandOption _path;
        private CommandOption _fileFormat;
		private CommandLineApplication _app;
		public TaskAssignmentListCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
		}

		public override void Configure(CommandLineApplication command)
		{
			_app = command;
			command.Description = "List all task assignments on a task.";
			_taskId = command.Argument("taskId",
								   "Id of task");
            _save = SaveOption.ConfigureOption(command);
            _path = FilePathOption.ConfigureOption(command);
            _fileFormat = FileFormatOption.ConfigureOption(command);

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

        private async Task RunList()
        {
            base.CheckForValue(this._taskId.Value, this._app, "A task ID is required for this command");
            try
            {
                var boxClient = base.ConfigureBoxClient(base._asUser.Value());
                var BoxCollectionsIterators = base.GetIterators();
                var taskAssignments = await boxClient.TasksManager.GetAssignmentsAsync(this._taskId.Value);
                if (_save.HasValue())
                {
                    var fileName = $"{base._names.CommandNames.TaskAssignment}-{base._names.SubCommandNames.List}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
                    var saved = base.WriteListResultsToReport<BoxTaskAssignment, BoxTaskAssignmentMap>(taskAssignments.Entries, fileName, _path.Value(), _fileFormat.Value());
                    Reporter.WriteSuccess($"File saved: {saved}");
                }
                else if (base._json.HasValue())
                {
                    base.OutputJson(taskAssignments);
                    return;
                }
                else
                {
                    var showNext = "";
                    while (taskAssignments.Entries.Count > 0 && showNext != "q")
                    {
                        showNext = BoxCollectionsIterators.PageInConsole<BoxTaskAssignment>(base.PrintTaskAssignment, taskAssignments);
                    }
                }
                Reporter.WriteInformation("Finished...");
            }
            catch (Exception e)
            {
                Reporter.WriteError(e.Message);
            }
        }
    }
}
