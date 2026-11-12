'use strict';

const BoxCommand = require('../../../box-command');
const { Flags, Args } = require('@oclif/core');
const {
	resolveBody,
	bodyFlags,
	pathLocationFlags,
	buildPathLocation,
	SHUTTLE_PERMISSIONS,
} = require('../../../modules/shuttle');

class ShuttlePathMappingsUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(ShuttlePathMappingsUpdateCommand);
		const requestBody = resolveBody(flags, () => {
			const body = {};
			if (Object.hasOwn(flags, 'is-path-skipped')) {
				body.isPathSkipped = flags['is-path-skipped'];
			}
			const source = buildPathLocation(flags, 'source', {
				allowIsDirectory: true,
				command: this,
			});
			if (source !== undefined) {
				body.source = source;
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
			if (Object.keys(body).length === 0) {
				this.error(
					'Provide at least one update flag, or use --body / --body-file.'
				);
			}
			return body;
		});

		const mapping = await this.tsClient.shuttle.updateShuttlePathMappingByIdV2026R0(
			args.id,
			requestBody
		);
		await this.output(mapping.rawData ?? mapping);
	}
}

ShuttlePathMappingsUpdateCommand.description = `Update a shuttle path mapping ${SHUTTLE_PERMISSIONS}`;
ShuttlePathMappingsUpdateCommand.examples = [
	'box shuttle:path-mappings:update 6a315c0754833bfc5df067bf --is-path-skipped --clear-target',
	'box shuttle:path-mappings:update 6a315c0754833bfc5df067bf --target-type account --target-path "/HR" --target-account-email admin@company.box.com',
];
ShuttlePathMappingsUpdateCommand._endpoint = 'put_shuttle_path_mappings_id';

ShuttlePathMappingsUpdateCommand.flags = {
	...BoxCommand.flags,
	...bodyFlags,
	'is-path-skipped': Flags.boolean({
		description: 'Skip this source path during migration',
		allowNo: true,
	}),
	'clear-target': Flags.boolean({
		description: 'Set target to null',
		default: false,
	}),
	...pathLocationFlags('source', { allowIsDirectory: true }),
	...pathLocationFlags('target', { allowIsDirectory: false }),
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
