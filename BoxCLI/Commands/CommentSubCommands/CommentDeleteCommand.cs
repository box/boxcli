using System;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.CommentSubCommands
{
    public class CommentDeleteCommand : CommentSubCommandBase
    {
		private CommandArgument _commentId;
		private CommandLineApplication _app;
        public CommentDeleteCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names) 
            : base(boxPlatformBuilder, boxHome, names)
        {
        }

		public override void Configure(CommandLineApplication command)
		{
			_app = command;
			command.Description = "Delete a comment.";
			_commentId = command.Argument("commentId",
								   "Id of comment");

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
			base.CheckForValue(this._commentId.Value, this._app, "A comment ID is required for this command");
			var boxClient = base.ConfigureBoxClient(base._asUser.Value());
			bool deleted;
			try
			{
				deleted = await boxClient.CommentsManager.DeleteAsync(this._commentId.Value);
				if (deleted)
				{
					Reporter.WriteSuccess($"Successfully deleted comment {this._commentId.Value}.");
				}
				else
				{
					Reporter.WriteError("Couldn't delete comment.");
				}
			}
			catch (Exception e)
			{
				Reporter.WriteError("Couldn't delete comment.");
				Reporter.WriteError(e.Message);
			}
		}
    }
}
