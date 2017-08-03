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
    public class CommentCreateCommand : CommentSubCommandBase
    {
        private CommandArgument _itemId;
        private CommandArgument _itemType;
        private CommandOption _message;
        private CommandOption _taggedMessage;
        private CommandLineApplication _app;
        public CommentCreateCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names)
            : base(boxPlatformBuilder, boxHome, names)
        {
        }

        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Create a task assignment.";
            _itemId = command.Argument("itemId",
                                       "Id of item on which to comment");
            _itemType = command.Argument("itemType",
                                         "The type of item on which to comment, either file or comment");
            _message = command.Option("--message", "Message of comment", CommandOptionType.SingleValue);
            _taggedMessage = command.Option("--tagged-message",
                                    "The text of the comment, including @[userid:Username] somewhere in the message to mention the user",
                                    CommandOptionType.SingleValue);
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
            try
            {
                base.CheckForValue(this._itemId.Value, this._app, "An item ID is required for this command");
                var type = this._itemType.Value.ToLower();
                if (!string.IsNullOrEmpty(this._itemType.Value))
                {
                    type = "file";
                }
                if (type != "file" || type != "comment")
                {
                    throw new Exception("The type must be either file or comment for this command.");
                }
                var boxClient = base.ConfigureBoxClient(base._asUser.Value());
                var commentCreate = new BoxCommentRequest();
                commentCreate.Item = new BoxRequestEntity()
                {
                    Id = this._itemId.Value
                };
                if (type == "file")
                {
                    commentCreate.Item.Type = BoxType.file;
                }
                else if (type == "comment")
                {
                    commentCreate.Item.Type = BoxType.comment;
                }
                if (this._message.HasValue())
                {
                    commentCreate.Message = this._message.Value();
                }
                if (this._taggedMessage.HasValue())
                {
                    commentCreate.TaggedMessage = this._taggedMessage.Value();
                }

                Reporter.WriteSuccess("Created comment.");
                base.PrintComment(await boxClient.CommentsManager.AddCommentAsync(commentCreate));
            }
            catch (Exception e)
            {
                Reporter.WriteError("Couldn't create comment.");
                Reporter.WriteError(e.Message);
            }
        }
    }
}
