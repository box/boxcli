'use strict';

const BoxCommand = require('../box-command');
const { Flags, Args } = require('@oclif/core');
const _ = require('lodash');
const BoxCLIError = require('../cli-error');
const PaginationUtils = require('../pagination-utils');

const RESULTS_LIMIT = 100;

/**
 * Parses a metadata value from the command line into the correct type
 * @param {string} value The value from command line flag
 * @returns {string|number} The parsed value
 * @private
 */
function parseMetadataValue(value) {
	if (value.endsWith('f')) {
		// Attempt to parse as a numeric type
		return parseFloat(value) || value;
	}

	return value;
}

class SearchCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(SearchCommand);

		if (flags.all && (flags.limit || flags['max-items'])) {
			throw new BoxCLIError(
				'--all and --limit(--max-items) flags cannot be used together.'
			);
		}

		if (
			flags.limit &&
			flags['max-items'] &&
			flags.limit !== flags['max-items']
		) {
			throw new BoxCLIError(
				' --limit and --max-items flags cannot be used together.'
			);
		}

		if (!flags.all && !flags['max-items']) {
			flags['max-items'] = flags.limit || RESULTS_LIMIT;
			this.flags['max-items'] = flags['max-items'];
		}

		let options = PaginationUtils.handlePagination(flags);

		if (flags.scope) {
			options.scope = flags.scope;
		}
		if (flags.type) {
			options.type = flags.type;
		}
		if (flags['file-extensions']) {
			options.file_extensions = flags['file-extensions'];
		}
		if (
			flags['md-filter-scope'] &&
			flags['md-filter-template-key'] &&
			flags['md-filter-json']
		) {
			if (
				flags['md-filter-scope'].length ===
					flags['md-filter-template-key'].length &&
				flags['md-filter-scope'].length ===
					flags['md-filter-json'].length
			) {
				options.mdfilters = [];
				for (let i = 0; i < flags['md-filter-scope'].length; i++) {
					let filter = {};
					filter.scope = flags['md-filter-scope'][i];
					filter.templateKey = flags['md-filter-template-key'][i];
					try {
						filter.filters = JSON.parse(flags['md-filter-json'][i]);
					} catch (ex) {
						throw new BoxCLIError(
							'Could not parse metadata filter JSON',
							ex
						);
					}
					options.mdfilters.push(filter);
				}
			} else {
				throw new BoxCLIError(
					"Mismatch on metadata filtering. Can't perform search."
				);
			}
		}
		if (flags.mdfilter) {
			// Transform the array of mdfilter objects into an object of arrays, grouped by template scope/key
			// e.g. { "enterprise.myTemplate": [filter1, filter2], "global.properties": [filter3]}
			let groupedFilters = _.groupBy(
				flags.mdfilter,
				(filter) => `${filter.scope}.${filter.templateKey}`
			);
			options.mdfilters = Object.keys(groupedFilters).map((key) => {
				let [scope, templateKey] = key.split('.');

				let filters = groupedFilters[key],
					filtersObj = {};

				// Build the filters object, e.g {"field1": value1, "field2": {"lt": value2}}
				filters.forEach(({ field, cmp, value }) => {
					if (cmp === '=') {
						if (typeof value === 'number') {
							filtersObj[field] = { lt: value, gt: value };
						} else {
							filtersObj[field] = value;
						}
					} else if (cmp === '<') {
						filtersObj[field] = { lt: value };
					} else if (cmp === '>') {
						filtersObj[field] = { gt: value };
					} else {
						throw new BoxCLIError(
							'Invalid comparator specified in metadata filter'
						);
					}
				});

				return {
					scope,
					templateKey,
					filters: filtersObj,
				};
			});
		}
		if (flags['content-types']) {
			options.content_types = flags['content-types'];
		}
		if (flags['ancestor-folder-ids']) {
			options.ancestor_folder_ids = flags['ancestor-folder-ids'];
		}
		if (flags['owner-user-ids']) {
			options.owner_user_ids = flags['owner-user-ids'];
		}
		if (flags['created-at-from']) {
			options.created_at_range = `${flags['created-at-from']},`;
		}
		if (flags['created-at-to']) {
			if (options.created_at_range) {
				options.created_at_range += flags['created-at-to'];
			} else {
				options.created_at_range = `,${flags['created-at-to']}`;
			}
		}
		if (flags['updated-at-from']) {
			options.updated_at_range = `${flags['updated-at-from']},`;
		}
		if (flags['updated-at-to']) {
			if (options.updated_at_range) {
				options.updated_at_range += flags['updated-at-to'];
			} else {
				options.updated_at_range = `,${flags['updated-at-to']}`;
			}
		}
		if (flags['trash-content']) {
			options.trash_content = flags['trash-content'];
		}
		if (
			flags.hasOwnProperty('size-from') ||
			flags.hasOwnProperty('size-to')
		) {
			options.size_range = `${_.get(flags, 'size-from', '')},${_.get(flags, 'size-to', '')}`;
		}

		if (flags.fields) {
			options.fields = flags.fields;
		}

		if (flags.sort) {
			options.sort = flags.sort;
		}

		if (flags.direction) {
			options.direction = flags.direction;
		}

		if (flags.hasOwnProperty('include-recent-shared-links')) {
			options.include_recent_shared_links =
				flags['include-recent-shared-links'];
		}

		let results = await this.client.search.query(
			args.query || null,
			options
		);

		await this.output(results);
	}
}

SearchCommand.description = 'Search for files and folders in your Enterprise';
SearchCommand.examples = [
	'box search "Q3 OKR"',
	'box search --mdfilter "enterprise.employeeRecord.name=John Doe"',
];
SearchCommand._endpoint = 'get_search';

SearchCommand.flags = {
	...BoxCommand.flags,
	scope: Flags.string({
		description: 'The scope on which you want search',
		options: ['user_content', 'enterprise_content'],
	}),
	type: Flags.string({
		description:
			'The type of objects you want to include in the search results',
		options: ['file', 'folder', 'web_link'],
	}),
	'file-extensions': Flags.string({
		description:
			'Limit searches to specific file extensions i.e. png,md,pdf',
	}),
	'md-filter-scope': Flags.string({
		description: 'Scope for metadata filter, can use multiple times',
		dependsOn: ['md-filter-template-key', 'md-filter-json'],
		hidden: true,
		multiple: true,
	}),
	'md-filter-template-key': Flags.string({
		description: 'Template key for metadata filter, can use multiple times',
		dependsOn: ['md-filter-scope', 'md-filter-json'],
		hidden: true,
		multiple: true,
	}),
	'md-filter-json': Flags.string({
		description:
			'JSON string of metadata to filter search, can use multiple times',
		dependsOn: ['md-filter-scope', 'md-filter-template-key'],
		hidden: true,
		multiple: true,
	}),
	mdfilter: Flags.string({
		description:
			'Metadata value to filter on, in the format <scope>.<templateKey>.<field>=<value>',
		exclusive: [
			'md-filter-scope',
			'md-filter-template-key',
			'md-filter-json',
		],
		multiple: true,
		parse(val) {
			let match = val.match(/^(\w+)\.([\w-]+)\.([\w-]+)([=<>])(.+)$/u);
			if (!match) {
				throw new BoxCLIError(
					`--mdfilter flag must be in scope.templateKey.field=value format; got ${val} instead`
				);
			}
			let [, scope, templateKey, field, cmp, value] = match;
			return {
				scope,
				templateKey,
				field,
				cmp,
				value: parseMetadataValue(value),
			};
		},
	}),
	'content-types': Flags.string({
		description:
			'Search for objects of specified content types. Requires a content type or a set of comma-delimited content types',
	}),
	'ancestor-folder-ids': Flags.string({
		description:
			'Search for the contents of specific folders (and folders within them). Requires a folder ID or a set of comma-delimited folder IDs',
	}),
	'owner-user-ids': Flags.string({
		description:
			'Search for objects by owner. Requires a user ID or a set of comma-delimited user IDs',
	}),
	'created-at-from': Flags.string({
		description:
			'Start of created date range. Use a RFC3339 timestamp or shorthand syntax 0t, like 5w for 5 weeks',
		parse: (input) => BoxCommand.normalizeDateString(input),
	}),
	'created-at-to': Flags.string({
		description:
			'End of created date range. Use a RFC3339 timestamp or shorthand syntax 0t, like 5w for 5 weeks',
		parse: (input) => BoxCommand.normalizeDateString(input),
	}),
	'updated-at-from': Flags.string({
		description:
			'Start of updated date range. Use a RFC3339 timestamp or shorthand syntax 0t, like 5w for 5 weeks',
		parse: (input) => BoxCommand.normalizeDateString(input),
	}),
	'updated-at-to': Flags.string({
		description:
			'End of updated date range. Use a RFC3339 timestamp or shorthand syntax 0t, like 5w for 5 weeks',
		parse: (input) => BoxCommand.normalizeDateString(input),
	}),
	'trash-content': Flags.string({
		description:
			'Controls whether to search in the trash. Defaults to non_trashed_only',
		options: ['trashed_only', 'non_trashed_only'],
	}),
	'size-from': Flags.integer({
		description: 'Lower bound for file size, in bytes',
	}),
	'size-to': Flags.integer({
		description: 'Upper bound for file size, in bytes',
	}),
	sort: Flags.string({
		description: 'The field to sort results by',
	}),
	direction: Flags.string({
		description: 'The direction to sort results (ascending or descending)',
		dependsOn: ['sort'],
		options: ['asc', 'desc'],
	}),
	limit: Flags.integer({
		description:
			'Defines the maximum number of items to return. Default value is 100.',
	}),
	'max-items': Flags.integer({
		description:
			'A value that indicates the maximum number of results to return.',
		hidden: true,
	}),
	all: Flags.boolean({
		description: 'Returns all search results.',
	}),
	'include-recent-shared-links': Flags.boolean({
		description: 'Returns shared links that the user recently accessed',
	}),
};

SearchCommand.args = {
	query: Args.string({
		name: 'query',
		required: false,
		hidden: false,
		description: 'The search term',
		default: '',
	}),
};

module.exports = SearchCommand;
