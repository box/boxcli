'use strict';

const { Args, Flags } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const { pathMappingFlags, buildLocation } = require('../../../modules/shuttle');

class ShuttlePathMappingsUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(
			ShuttlePathMappingsUpdateCommand
		);
		const requestBody = {};

		if (Object.hasOwn(flags, 'path-skipped')) {
			requestBody.isPathSkipped = flags['path-skipped'];
		}
		const source = buildLocation(flags, 'source');
		if (source) {
			requestBody.source = source;
		}
		const target = buildLocation(flags, 'target');
		if (target) {
			requestBody.target = target;
		}
		if (flags['clear-target']) {
			requestBody.target = null;
		}

		if (Object.keys(requestBody).length === 0) {
			this.error('Please provide at least one update flag.');
		}

		const mapping =
			await this.tsClient.shuttle.updateShuttlePathMappingByIdV2026R0(
				args.id,
				requestBody
			);
		await this.output(mapping.rawData ?? mapping);
	}
}

ShuttlePathMappingsUpdateCommand.description =
	'Update a Box Shuttle path mapping. Only the passed fields are changed';
ShuttlePathMappingsUpdateCommand.examples = [
	'box shuttle:path-mappings:update 6a3ba7a24ea17bc9461eeacd --path-skipped --clear-target',
	'box shuttle:path-mappings:update 6a3ba7a24ea17bc9461eeacd --target-type account --target-path /Finance/2026 --target-account-id 11111',
];
ShuttlePathMappingsUpdateCommand._endpoint = 'put_shuttle_path_mappings_id';

ShuttlePathMappingsUpdateCommand.flags = {
	...BoxCommand.flags,
	...pathMappingFlags({ update: true }),
	'clear-target': Flags.boolean({
		description:
			'Remove the destination, for example when skipping the source path (sends null)',
		exclusive: [
			'target-type',
			'target-path',
			'target-path-id',
			'target-account-id',
			'target-account-email',
			'target-space',
		],
	}),
};

ShuttlePathMappingsUpdateCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the shuttle path mapping to update',
	}),
};

module.exports = ShuttlePathMappingsUpdateCommand;
