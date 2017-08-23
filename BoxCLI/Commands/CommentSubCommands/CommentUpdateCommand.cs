using System;
using System.Threading.Tasks;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.CommentSubCommands
{
    public class CommentUpdateCommand : CommentSubCommandBase
    {
        private CommandArgument _commentId;
        private CommandOption _message;
        private CommandLineApplication _app;
        public CommentUpdateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }


        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Update a comment.";
            _commentId = command.Argument("commentId",
                                   "Id of comment");
            _message = command.Option("--message", "The text of the comment", CommandOptionType.SingleValue);
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
            try
            {
                base.CheckForValue(this._commentId.Value, this._app, "A comment ID is required for this command");
                var boxClient = base.ConfigureBoxClient(base._asUser.Value());
                var commentUpdate = new BoxCommentRequest();

                if (this._message.HasValue())
                {
                    commentUpdate.Message = this._message.Value();
                }
                var updatedComment = await boxClient.CommentsManager.UpdateAsync(this._commentId.Value, commentUpdate);
                if (base._json.HasValue())
                {
                    base.OutputJson(updatedComment);
                    return;
                }
                Reporter.WriteSuccess("Updated comment.");
                base.PrintComment(updatedComment);
            }
            catch (Exception e)
            {
                Reporter.WriteError("Couldn't update comment.");
                Reporter.WriteError(e.Message);
            }
        }
    }
}
