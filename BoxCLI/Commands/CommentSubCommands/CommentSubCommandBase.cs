using System;
using Box.V2.Models;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;

namespace BoxCLI.Commands.CommentSubCommands
{
    public class CommentSubCommandBase : BoxItemCommandBase
    {
        public CommentSubCommandBase(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names) 
            : base(boxPlatformBuilder, boxHome, names)
        {
        }

        protected virtual void PrintComment(BoxComment comment)
        {
            Reporter.WriteInformation($"Comment ID: {comment.Id}");
            Reporter.WriteInformation($"Comment Message: {comment.Message}");
            Reporter.WriteInformation($"Comment Created at: {comment.CreatedAt}");
            Reporter.WriteInformation($"Comment Modified at: {comment.ModifiedAt}");
            Reporter.WriteInformation($"Comment Tagged Message: {comment.TaggedMessage}");
            Reporter.WriteInformation($"Is a reply?: {comment.IsReplyComment}");
            Reporter.WriteInformation("Comment Created by:");
            base.PrintMiniUser(comment.CreatedBy);
            Reporter.WriteInformation("Comment on item: ");
            base.PrintEntity(comment.Item);
        }
    }
}
