using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities.CommandOptions;
using BoxCLI.CommandUtilities.Globalization;
using Microsoft.Extensions.CommandLineUtils;

namespace BoxCLI.Commands
{
    public class SearchCommand : BoxBaseCommand
    {

        public SearchCommand(IBoxPlatformServiceBuilder boxPlatformBuilder, IBoxHome boxHome, LocalizedStringsResource names) 
            : base(boxPlatformBuilder, boxHome, names)
        {
        }

        private CommandArgument _query;
        private CommandOption _asUser;
        private CommandOption _scope;
        private CommandOption _fileExtenstions;
        private CommandOption _mdFilterScope;
        private CommandOption _mdFilterTemplateKey;
        private CommandOption _mdFilterJson; 
		private CommandLineApplication _app;
		public override void Configure(CommandLineApplication command)
		{
			_app = command;
			command.Description = "Search your Enterprise.";
			command.ExtendedHelpText = "You can use this command to search for files and folders.";
            _query = command.Argument("query", "The search term");
            _asUser = AsUserOption.ConfigureOption(command);
            _scope = command.Option("--scope", "The scope on which you want search", CommandOptionType.SingleValue);
            _fileExtenstions = command.Option("--file-extensions", "Limit searches to specific file extensions", CommandOptionType.SingleValue);
            _mdFilterScope = command.Option("--md-filter-scope", "Scope for metadata filter", CommandOptionType.SingleValue);
            _mdFilterTemplateKey = command.Option("--md-filter-template-key", "Template key for metadata filter", CommandOptionType.SingleValue);
            _mdFilterJson = command.Option("--md-filter-json", "JSON string of metadata to filter search", CommandOptionType.SingleValue);
			command.OnExecute(async () =>
			{
				return await this.Execute();
			});
			base.Configure(command);
		}

		protected async override Task<int> Execute()
		{
            if(string.IsNullOrEmpty(this._query.Value) && (string.IsNullOrEmpty(this._mdFilterScope.Value()) && string.IsNullOrEmpty(this._mdFilterTemplateKey.Value())))
            {
				_app.ShowHelp();
                return await base.Execute();
            }
            var fileExtensions = new List<string>();
            if (this._fileExtenstions.HasValue())
            {
                fileExtensions = this._fileExtenstions.Value().Split(',').ToList();
            }
            var boxClient = base.ConfigureBoxClient(this._asUser.Value());
            var result = await boxClient.SearchManager.SearchAsync(this._query.Value, scope: this._scope.Value(), fileExtensions: fileExtensions);
            foreach(var item in result.Entries)
            {
                base.PrintItem(item);
            }
			return await base.Execute();
		}
    }
}
