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

namespace BoxCLI.Commands.TaskSubCommands
{
    public class TaskListCommand : TaskSubCommandBase
    {
        private CommandArgument _fileId;
        private CommandOption _save;
        private CommandOption _path;
        private CommandOption _fileFormat;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public TaskListCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }


        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "List all tasks on this file.";
            _fileId = command.Argument("fileId",
                               "Id of file on which to retrieve tasks");
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

        public async Task RunList()
        {
            base.CheckForId(this._fileId.Value, this._app);
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            var BoxCollectionsIterators = base.GetIterators();
            var tasks = await boxClient.FilesManager.GetFileTasks(this._fileId.Value);
            if (_save.HasValue())
            {
                var fileName = $"{base._names.CommandNames.Task}-{base._names.SubCommandNames.List}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
                var saved = base.WriteListResultsToReport<BoxTask, BoxTaskMap>(tasks.Entries, fileName, _path.Value(), _fileFormat.Value());
                Reporter.WriteSuccess($"File saved: {saved}");
            }
            else if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(tasks);
                return;
            }
            else
            {
                var showNext = "";
                while (tasks.Entries.Count > 0 && showNext != "q")
                {
                    showNext = BoxCollectionsIterators.PageInConsole<BoxTask>(base.PrintTask, tasks);
                }
            }
            Reporter.WriteInformation("Finished...");
        }
    }
}
