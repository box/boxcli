using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Box.V2.Models;
using Box.V2.Models.Request;
using BoxCLI.BoxHome;
using BoxCLI.BoxPlatform.Service;
using BoxCLI.CommandUtilities;
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
        private CommandOption _type;
        private CommandOption _fileExtenstions;
        private CommandOption _mdFilterScope;
        private CommandOption _mdFilterTemplateKey;
        private CommandOption _mdFilterJson;
        private CommandOption _ancestorFolderIds;
        private CommandOption _contentTypes;
        private CommandOption _createdAtFrom;
        private CommandOption _createdAtTo;
        private CommandOption _updatedAtFrom;
        private CommandOption _updatedAtTo;
        private CommandOption _ownerUserIds;
        private CommandLineApplication _app;
        public override void Configure(CommandLineApplication command)
        {
            _app = command;
            command.Description = "Search for files and folders in your Enterprise.";
            command.ExtendedHelpText = "You can use this command to search for files and folders.";
            _query = command.Argument("query", "The search term");
            _asUser = AsUserOption.ConfigureOption(command);
            _scope = command.Option("--scope", "The scope on which you want search", CommandOptionType.SingleValue);
            _type = command.Option("--type", "The type of objects you want to include in the search results", CommandOptionType.SingleValue);
            _fileExtenstions = command.Option("--file-extensions", "Limit searches to specific file extensions", CommandOptionType.SingleValue);
            _mdFilterScope = command.Option("--md-filter-scope", "Scope for metadata filter, can use multiple times", CommandOptionType.MultipleValue);
            _mdFilterTemplateKey = command.Option("--md-filter-template-key", "Template key for metadata filter, can use multiple times", CommandOptionType.MultipleValue);
            _mdFilterJson = command.Option("--md-filter-json", "JSON string of metadata to filter search, can use multiple times", CommandOptionType.MultipleValue);
            _contentTypes = command.Option("--content-types",
                                                "Search for objects of specified content types. Requires a content type or a set of comma-delimited content types",
                                                CommandOptionType.SingleValue);
            _ancestorFolderIds = command.Option("--ancestor-folder-ids",
                                                "Search for objects by owner. Requires a user ID or a set of comma-delimited user IDs",
                                                CommandOptionType.SingleValue);
            _ownerUserIds = command.Option("--owner-user-ids",
                                                "Search for the contents of specific folders (and folders within them). Requires a folder ID or a set of comma-delimited folder IDs",
                                                CommandOptionType.SingleValue);
            _createdAtFrom = command.Option("--created-at-from",
                                            "The date when the item was created, used with --created-at-to. Use a RFC3339 timestamp or shorthand syntax 00t, like 05w for 5 weeks",
                                            CommandOptionType.SingleValue);
            _createdAtTo = command.Option("--created-at-to",
                                           "The date when the item was created, used with --created-at-from. Use a RFC3339 timestamp or shorthand syntax 00t, like 05w for 5 weeks",
                                           CommandOptionType.SingleValue);
            _updatedAtFrom = command.Option("--updated-at-from",
                                            "The date when the item was updated, used with --updated-at-to. Use a RFC3339 timestamp or shorthand syntax 00t, like 05w for 5 weeks",
                                            CommandOptionType.SingleValue);
            _updatedAtTo = command.Option("--updated-at-to",
                                           "The date when the item was updated, used with --updated-at-from. Use a RFC3339 timestamp or shorthand syntax 00t, like 05w for 5 weeks",
                                           CommandOptionType.SingleValue);
            command.OnExecute(async () =>
            {
                return await this.Execute();
            });
            base.Configure(command);
        }

        protected async override Task<int> Execute()
        {
            if (string.IsNullOrEmpty(this._query.Value) && (string.IsNullOrEmpty(this._mdFilterScope.Value()) && string.IsNullOrEmpty(this._mdFilterTemplateKey.Value())))
            {
                _app.ShowHelp();
                return await base.Execute();
            }
            var fileExtensions = new List<string>();
            var ancestorFolderIds = new List<string>();
            var ownerUserIds = new List<string>();
            var contentTypes = new List<string>();
            var mdFilters = new List<BoxMetadataFilterRequest>();
            DateTime createdAtFrom = DateTime.Now.AddMonths(-6);
            DateTime createdAtTo = DateTime.Now;
            DateTime updatedAtFrom = DateTime.Now.AddMonths(-6);
            DateTime updatedAtTo = DateTime.Now;
            if (this._ownerUserIds.HasValue())
            {
                ownerUserIds = this._ownerUserIds.Value().Split(',').ToList();
            }
            if (this._fileExtenstions.HasValue())
            {
                fileExtensions = this._fileExtenstions.Value().Split(',').ToList();
            }
            if (this._contentTypes.HasValue())
            {
                contentTypes = this._contentTypes.Value().Split(',').ToList();
            }
            if (this._ancestorFolderIds.HasValue())
            {
                ancestorFolderIds = this._ancestorFolderIds.Value().Split(',').ToList();
            }
            if (this._createdAtFrom.HasValue() && this._createdAtTo.HasValue())
            {
                try
                {
                    createdAtFrom = GeneralUtilities.GetDateTimeFromString(this._createdAtFrom.Value(), true);
                }
                catch
                {
                    createdAtFrom = DateTime.Parse(this._createdAtFrom.Value());
                }
                try
                {
                    createdAtTo = GeneralUtilities.GetDateTimeFromString(this._createdAtTo.Value(), true);
                }
                catch
                {
                    createdAtTo = DateTime.Parse(this._createdAtTo.Value());
                }
            }
            if (this._updatedAtTo.HasValue() && this._updatedAtFrom.HasValue())
            {
                try
                {
                    updatedAtFrom = GeneralUtilities.GetDateTimeFromString(this._updatedAtFrom.Value(), true);
                }
                catch
                {
                    updatedAtFrom = DateTime.Parse(this._updatedAtFrom.Value());
                }
                try
                {
                    updatedAtTo = GeneralUtilities.GetDateTimeFromString(this._updatedAtTo.Value(), true);
                }
                catch
                {
                    updatedAtTo = DateTime.Parse(this._updatedAtTo.Value());
                }
            }
            if (this._mdFilterTemplateKey.HasValue() && this._mdFilterScope.HasValue() && this._mdFilterJson.HasValue())
            {
                var mdTempKeyCount = this._mdFilterTemplateKey.Values.Count();
                var mdScopeCount = this._mdFilterScope.Values.Count();
                var mdJsonCount = this._mdFilterJson.Values.Count();
                if (mdTempKeyCount != mdScopeCount && mdTempKeyCount != mdJsonCount)
                {
                    throw new Exception("Mismatch on metadata filtering. Can't perform search.");
                }
                for (var i = 0; i < mdTempKeyCount; i++)
                {
                    var mdRequest = new BoxMetadataFilterRequest();
                    mdRequest.TemplateKey = this._mdFilterTemplateKey.Values[i];
                    mdRequest.Scope = this._mdFilterScope.Values[i];
                    mdRequest.Filters = this._mdFilterJson.Values[i];
                    mdFilters.Add(mdRequest);
                }
            }
            var boxClient = base.ConfigureBoxClient(oneCallAsUserId: this._asUser.Value(), oneCallWithToken: base._oneUseToken.Value());
            BoxCollection<BoxItem> result;
            if (mdFilters.Count() > 0)
            {
				result = await boxClient.SearchManager.SearchAsync(this._query.Value, scope: this._scope.Value(),
															fileExtensions: fileExtensions, ancestorFolderIds: ancestorFolderIds,
															ownerUserIds: ownerUserIds, type: this._type.Value(), contentTypes: contentTypes,
															createdAtRangeFromDate: createdAtFrom, createdAtRangeToDate: createdAtTo,
															updatedAtRangeFromDate: updatedAtFrom, updatedAtRangeToDate: updatedAtTo, mdFilters: mdFilters);
            }
            else
            {
                result = await boxClient.SearchManager.SearchAsync(this._query.Value, scope: this._scope.Value(),
                                                            fileExtensions: fileExtensions, ancestorFolderIds: ancestorFolderIds,
                                                            ownerUserIds: ownerUserIds, type: this._type.Value(), contentTypes: contentTypes,
                                                            createdAtRangeFromDate: createdAtFrom, createdAtRangeToDate: createdAtTo,
                                                            updatedAtRangeFromDate: updatedAtFrom, updatedAtRangeToDate: updatedAtTo);
            }

            foreach (var item in result.Entries)
            {
                base.PrintItem(item);
            }
            return await base.Execute();
        }
    }
}
