'use strict';

const BoxCommand = require('../../../box-command');
const { Flags } = require('@oclif/core');
const {
	resolveBody,
	bodyFlags,
	pathLocationFlags,
	buildPathLocation,
	SHUTTLE_PERMISSIONS,
} = require('../../../modules/shuttle');

class ShuttlePathMappingsCreateCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(ShuttlePathMappingsCreateCommand);
		const requestBody = resolveBody(flags, () => {
			if (!flags['job-id']) {
				this.error(
					'--job-id is required unless --body / --body-file is set.'
				);
			}
			const source = buildPathLocation(flags, 'source', {
				required: true,
				allowIsDirectory: true,
				command: this,
			});
			const body = {
				jobId: flags['job-id'],
				source,
			};
			if (Object.hasOwn(flags, 'is-path-skipped')) {
				body.isPathSkipped = flags['is-path-skipped'];
			}
			if (flags['clear-target']) {
				body.target = null;
			} else {
				const target = buildPathLocation(flags, 'target', {
					allowIsDirectory: false,
					command: this,
				});
				if (target !== undefined) {
					body.target = target;
				}
			}
			return body;
		});

		const mapping =
			await this.tsClient.shuttle.createShuttlePathMappingV2026R0(requestBody);
		await this.output(mapping.rawData ?? mapping);
	}
}

ShuttlePathMappingsCreateCommand.description = `Create a shuttle path mapping ${SHUTTLE_PERMISSIONS}`;
ShuttlePathMappingsCreateCommand.examples = [
	'box shuttle:path-mappings:create --job-id 6a315c0754833bfc5df067bf --source-type account --source-path "/Finance" --source-account-email admin@company.com --target-type account --target-path "/HR Migration" --target-account-email admin@company.box.com',
];
ShuttlePathMappingsCreateCommand._endpoint = 'post_shuttle_path_mappings';

ShuttlePathMappingsCreateCommand.flags = {
	...BoxCommand.flags,
	...bodyFlags,
	'job-id': Flags.string({
		description: 'Shuttle job ID (required unless --body / --body-file)',
	}),
	'is-path-skipped': Flags.boolean({
		description: 'Skip this source path during migration',
		allowNo: true,
	}),
	'clear-target': Flags.boolean({
		description: 'Set target to null (e.g. when skipping the path)',
		default: false,
	}),
	...pathLocationFlags('source', { allowIsDirectory: true }),
	...pathLocationFlags('target', { allowIsDirectory: false }),
};

module.exports = ShuttlePathMappingsCreateCommand;
