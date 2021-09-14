'use strict';

const BoxCommand = require('../box-command');
const { flags } = require('@oclif/command');
const { omit, mapKeys, snakeCase } = require('lodash');

class MetadataQueryCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(MetadataQueryCommand);

		const { extra_fields: extraFields, ...rest } = mapKeys(
			omit(flags, Object.keys(BoxCommand.flags)),
			(value, key) => snakeCase(key)
		);

		const items = await this.client.metadata.query(
			args.from,
			args.ancestorFolderId,
			{
				...(extraFields && { fields: extraFields }),
				...rest,
			}
		);
		await this.output(items);
	}
}

MetadataQueryCommand.description =
	'Create a search using SQL-like syntax to return items that match specific metadata';
MetadataQueryCommand.examples = ['box metadata-query enterprise_12345.someTemplate 5555 --query "amount >= :minAmount AND amount <= :maxAmount" --query-params minAmount=100,maxAmount=200 --use-index amountAsc --order-by amount=ASC --extra-fields created_at,metadata.enterprise_1234.contracts'];
MetadataQueryCommand._endpoint = 'post_metadata_queries_execute_read';

MetadataQueryCommand.flags = {
	...BoxCommand.flags,
	query: flags.string({
		description: 'The logical expression of the query',
	}),
	'query-params': flags.string({
		description: 'Required if query present. The arguments for the query.',
		dependsOn: ['query'],
		parse(input) {
			return Object.assign(
				{},
				...input.split(',').map(param => {
					const [
						key,
						value
					] = param.split('=');
					return {
						[key]: value,
					};
				})
			);
		},
	}),
	'use-index': flags.string({
		description: 'The name of the search index to use for this query.',
	}),
	'order-by': flags.string({
		description:
			'A list of template fields and directions to sort the metadata query results by.',
		parse(input) {
			return input.split(',').map(param => {
				const [
					fieldKey,
					direction
				] = param.split('=');
				return { field_key: fieldKey, direction };
			});
		},
	}),
	limit: flags.integer({
		description:
			'A value between 0 and 100 that indicates the maximum number of results to return for a single request. This only specifies a maximum boundary and will not guarantee the minimum number of results returned.',
	}),
	marker: flags.string({
		description: 'Marker to use for requesting the next page.',
	}),
	'extra-fields': flags.string({
		description:
			'A list of additional attributes to return for any item, including its metadata.',
		parse(input) {
			return input.split(',');
		},
	}),
};

MetadataQueryCommand.args = [
	{
		name: 'from',
		required: true,
		description:
			'The template used in the query. Must be in the form scope.templateKey',
	},
	{
		name: 'ancestorFolderId',
		required: true,
		description: 'The folder_id to which to restrain the query',
	},
];

module.exports = MetadataQueryCommand;
