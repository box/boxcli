using System;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands.CommentSubCommands
{
    public class CommentGetCommand : CommentSubCommandBase
    {
        private CommandArgument _id;
        private CommandLineApplication _app;
        private IBoxHome _home;

        public CommentGetCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome home, LocalizedStringsResource names)
            : base(boxPlatformBuilder, home, names)
        {
            _home = home;
        }


        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Get information about a comment.";
            _id = command.Argument("commentId",
                                   "Id of comment");

            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            await this.RunGet();
            return await base.Execute();
        }

        private async Task RunGet()
        {
            base.CheckForValue(this._id.Value, this._app, "A comment ID is required for this call.");
            var boxClient = base.ConfigureBoxClient(base._asUser.Value());
            try
            {
                var comment = await boxClient.CommentsManager.GetInformationAsync(this._id.Value);
                if (base._json.HasValue() || this._home.GetBoxHomeSettings().GetOutputJsonSetting())
                {
                    base.OutputJson(comment);
                    return;
                }
                base.PrintComment(comment);
            }
            catch (Exception e)
            {
                Reporter.WriteError(e.Message);
            }
        }
    }
}
