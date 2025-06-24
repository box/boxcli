'use strict';

const BoxCommand = require('../box-command');
const { Flags, Args } = require('@oclif/core');
const { omit, mapKeys, snakeCase } = require('lodash');

const parseQueryValue = (value) => {
	if (value.endsWith('f') && !isNaN(parseFloat(value))) {
		return parseFloat(value);
	}
	return value;
};

class MetadataQueryCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(MetadataQueryCommand);

		const {
			extra_fields: extraFields,
			query_params: queryParams,
			query_param: queryParam,
			query_param_array: queryParamArray,
			...rest
		} = mapKeys(omit(flags, Object.keys(BoxCommand.flags)), (value, key) =>
			snakeCase(key),
		);

		let combinedQueryParams = queryParams || {};
		if (queryParam) {
			combinedQueryParams = {
				...combinedQueryParams,
				...queryParam.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
			};
		}
		if (queryParamArray) {
			combinedQueryParams = {
				...combinedQueryParams,
				...queryParamArray.reduce((acc, curr) => ({ ...acc, ...curr }), {}),
			};
		}

		const items = await this.client.metadata.query(
			args.from,
			args.ancestorFolderId,
			{
				...(extraFields && { fields: extraFields }),
				...(combinedQueryParams && { query_params: combinedQueryParams }),
				...rest,
			},
		);
		await this.output(items);
	}
}

MetadataQueryCommand.description =
	'Create a search using SQL-like syntax to return items that match specific metadata';
MetadataQueryCommand.examples = [
	'box metadata-query enterprise_12345.someTemplate 5555 --query "amount >= :minAmount AND amount <= :maxAmount" --query-params minAmount=100f,maxAmount=200f --use-index amountAsc --order-by amount=ASC --extra-fields created_at,metadata.enterprise_1234.contracts',
];
MetadataQueryCommand._endpoint = 'post_metadata_queries_execute_read';

MetadataQueryCommand.flags = {
	...BoxCommand.flags,
	query: Flags.string({
		description: 'The logical expression of the query',
	}),
	'query-params': Flags.string({
		description:
			'The arguments for the query. Can be specified as a comma-separated list of key-value pairs. i.e. key1=value1,key2=value2',
		dependsOn: ['query'],
		parse(input) {
			return Object.assign(
				{},
				...input.split(',').map((param) => {
					const [key, value] = param.split('=');
					/* eslint-disable multiline-ternary */
					return {
						[key]:
							parseQueryValue(value),
					};
					/* eslint-enable multiline-ternary */
				}),
			);
		},
	}),
	'query-param': Flags.string({
		description: 'One query param key-value pair, i.e. key=value. If this key duplicates with query-params, this flag will take precedence.',
		dependsOn: ['query'],
		multiple: true,
		parse(input) {
			const key = input.split('=')[0];
			const value = input.substring(key.length + 1);
			return {
				[key]: parseQueryValue(value),
			};
		},
	}),
	'query-param-array': Flags.string({
		description:
			'One query param key-multiple-value pair, use for multiple-values fields, i.e. key=value1,value2,value3. If this key duplicates with query-params or query-param, this flag will take precedence.',
		dependsOn: ['query'],
		multiple: true,
		parse(input) {
			const key = input.split('=')[0];
			const value = input.substring(key.length + 1).split(',');
			return {
				[key]: value.map(x => parseQueryValue(x)),
			};
		},
	}),
	'use-index': Flags.string({
		description: 'The name of the search index to use for this query.',
	}),
	'order-by': Flags.string({
		description:
			'A list of template fields and directions to sort the metadata query results by.',
		parse(input) {
			return input.split(',').map((param) => {
				const [fieldKey, direction] = param.split('=');
				return { field_key: fieldKey, direction };
			});
		},
	}),
	limit: Flags.integer({
		description:
			'A value between 0 and 100 that indicates the maximum number of results to return for a single request. This only specifies a maximum boundary and will not guarantee the minimum number of results returned.',
	}),
	marker: Flags.string({
		description: 'Marker to use for requesting the next page.',
	}),
	'extra-fields': Flags.string({
		description:
			'A list of additional attributes to return for any item, including its metadata.',
		parse(input) {
			return input.split(',');
		},
	}),
};

MetadataQueryCommand.args = {
	from: Args.string({
		name: 'from',
		required: true,
		description:
			'The template used in the query. Must be in the form scope.templateKey',
	}),
	ancestorFolderId: Args.string({
		name: 'ancestorFolderId',
		required: true,
		description: 'The folder_id to which to restrain the query',
	}),
};

module.exports = MetadataQueryCommand;
