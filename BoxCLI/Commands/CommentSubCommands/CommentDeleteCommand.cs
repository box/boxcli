using System;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.CommentSubCommands
{
    public class CommentDeleteCommand : CommentSubCommandBase
    {
        private CommandArgument _commentId;
        private CommandOption _dontPrompt;
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
            base.CheckForValue(this._commentId.Value, this._app, "A comment ID is required for this command");

            bool deleted;
            try
            {
                if (this._dontPrompt.HasValue())
                {
                    deleted = await this.DeleteComment();
                }
                else
                {
                    Reporter.WriteWarningNoNewLine("Are you sure you want to delete this comment? y/N ");
                    var yNKey = "n";
                    yNKey = Console.ReadLine().ToLower();
                    if (yNKey != "y")
                    {
                        Reporter.WriteInformation("Aborted comment deletion.");
                        return;
                    }
                    else
                    {
                        deleted = await this.DeleteComment();
                    }
                }
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
                Reporter.WriteError(GeneralUtilities.FormatErrorResponseFromAPI(e));
            }
        }

        private async Task<bool> DeleteComment()
        {
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            return await boxClient.CommentsManager.DeleteAsync(this._commentId.Value);
        }
    }
}
