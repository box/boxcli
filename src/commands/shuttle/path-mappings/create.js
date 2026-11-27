'use strict';

const BoxCommand = require('../../../box-command');
const {
	jobIdFlag,
	pathMappingFlags,
	buildLocation,
} = require('../../../modules/shuttle');

class ShuttlePathMappingsCreateCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(ShuttlePathMappingsCreateCommand);
		const requestBody = {
			jobId: flags['job-id'],
			source: buildLocation(flags, 'source'),
		};

		if (Object.hasOwn(flags, 'path-skipped')) {
			requestBody.isPathSkipped = flags['path-skipped'];
		}
		const target = buildLocation(flags, 'target');
		if (target) {
			requestBody.target = target;
		}

		const mapping =
			await this.tsClient.shuttle.createShuttlePathMappingV2026R0(
				requestBody
			);
		await this.output(mapping.rawData ?? mapping);
	}
}

ShuttlePathMappingsCreateCommand.description =
	'Create a path mapping that connects a source location of a Box Shuttle job to a destination in Box. Leave out the --target-* flags when the source path is skipped. Values for the location flags can be taken from shuttle:path-entries';
ShuttlePathMappingsCreateCommand.examples = [
	'box shuttle:path-mappings:create --job-id 6a3ba68e810d9156194530a1 --source-type account --source-path /finance --source-account-email user@example.com --target-type account --target-path /Finance --target-account-id 11111',
	'box shuttle:path-mappings:create --job-id 6a3ba68e810d9156194530a1 --source-type shared_space --source-space "Team Drive" --source-path /archive --path-skipped',
];
ShuttlePathMappingsCreateCommand._endpoint = 'post_shuttle_path_mappings';

ShuttlePathMappingsCreateCommand.flags = {
	...BoxCommand.flags,
	'job-id': jobIdFlag('ID of the shuttle job this mapping belongs to'),
	...pathMappingFlags(),
};

module.exports = ShuttlePathMappingsCreateCommand;
