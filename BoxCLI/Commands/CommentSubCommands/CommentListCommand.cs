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

namespace BoxCLI.Commands.CommentSubCommands
{
    public class CommentListCommand : CommentSubCommandBase
    {
        private CommandArgument _fileId;
		private CommandOption _save;
		private CommandOption _path;
		private CommandOption _fileFormat;
		private CommandLineApplication _app;
        private IBoxHome _home;

        public CommentListCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
			_home = home;
		}

		public override void Configure(CommandLineApplication command)
		{
			_app = command;
			command.Description = "List all comments on a file.";
			_fileId = command.Argument("fileId",
								   "Id of file");
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
			base.CheckForValue(this._fileId.Value, this._app, "A file ID is required for this command");
			try
			{
				var boxClient = base.ConfigureBoxClient(base._asUser.Value());
				var BoxCollectionsIterators = base.GetIterators();
                var comments = await boxClient.FilesManager.GetCommentsAsync(this._fileId.Value);
				if (_save.HasValue())
				{
					var fileName = $"{base._names.CommandNames.Comment}-{base._names.SubCommandNames.List}-{DateTime.Now.ToString(GeneralUtilities.GetDateFormatString())}";
					var saved = base.WriteListResultsToReport<BoxComment, BoxCommentMap>(comments.Entries, fileName, _path.Value(), _fileFormat.Value());
					Reporter.WriteSuccess($"File saved: {saved}");
				}
				else if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
				{
					base.OutputJson(comments);
					return;
				}
				else
				{
					var showNext = "";
					while (comments.Entries.Count > 0 && showNext != "q")
					{
						showNext = BoxCollectionsIterators.PageInConsole<BoxComment>(base.PrintComment, comments);
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
