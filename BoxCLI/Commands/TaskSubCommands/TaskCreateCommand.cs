using System;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.Globalization;
using Box.V2.Models;
using Microsoft.Extensions.CommandLineUtils;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;

namespace BoxCLI.Commands.TaskSubCommands
{
    public class TaskCreateCommand : TaskSubCommandBase
    {
        private CommandArgument _fileId;
        private CommandOption _message;
        private CommandOption _due;
        private CommandOption _idOnly;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public TaskCreateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Create a task on a file.";
            _fileId = command.Argument("fileId",
                                   "Id of file");
            _message = command.Option("--message", "Message for task.", CommandOptionType.SingleValue);
            _due = command.Option("--due-at", "When this task is due, use format 05h for 5 hours for example.", CommandOptionType.SingleValue);
            _idOnly = IdOnlyOption.ConfigureOption(command);
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
            base.CheckForValue(this._fileId.Value, this._app, "A file ID is required for this command");
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: base._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            var taskRequest = new BoxTaskCreateRequest();
            taskRequest.Item = new BoxRequestEntity()
            {
                Id = this._fileId.Value,
                Type = BoxType.file
            };

            if (this._message.HasValue())
            {
                taskRequest.Message = this._message.Value();
            }
            if (this._due.HasValue())
            {
                taskRequest.DueAt = GeneralUtilities.GetDateTimeFromString(this._due.Value());
            }
            var createdTask = await boxClient.TasksManager.CreateTaskAsync(taskRequest);
            if (this._idOnly.HasValue())
            {
                Reporter.WriteInformation(createdTask.Id);
                return;
            }
            if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
            {
                base.OutputJson(createdTask);
                return;
            }
            base.PrintTask(createdTask);
        }
    }
}
