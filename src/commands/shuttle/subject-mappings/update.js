'use strict';

const { Args, Flags } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const {
	subjectMappingFlags,
	buildSubjectTarget,
} = require('../../../modules/shuttle');

class ShuttleSubjectMappingsUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(
			ShuttleSubjectMappingsUpdateCommand
		);
		const requestBody = {};

		if (Object.hasOwn(flags, 'subject-skipped')) {
			requestBody.isSubjectSkipped = flags['subject-skipped'];
		}
		const target = buildSubjectTarget(flags);
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
			await this.tsClient.shuttle.updateShuttleSubjectMappingByIdV2026R0(
				args.id,
				requestBody
			);
		await this.output(mapping.rawData ?? mapping);
	}
}

ShuttleSubjectMappingsUpdateCommand.description =
	'Update a Box Shuttle subject mapping. Only the passed fields are changed';
ShuttleSubjectMappingsUpdateCommand.examples = [
	'box shuttle:subject-mappings:update 6a3ba7a24ea17bc9461eeace --target-type group --target-id 22222',
	'box shuttle:subject-mappings:update 6a3ba7a24ea17bc9461eeace --subject-skipped --clear-target',
];
ShuttleSubjectMappingsUpdateCommand._endpoint =
	'put_shuttle_subject_mappings_id';

ShuttleSubjectMappingsUpdateCommand.flags = {
	...BoxCommand.flags,
	...subjectMappingFlags({ update: true }),
	'clear-target': Flags.boolean({
		description:
			'Remove the Box target (sends null). Allowed only for a skipped subject; the API rejects it while the mapping is active',
		exclusive: ['target-type', 'target-id'],
	}),
};

ShuttleSubjectMappingsUpdateCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the shuttle subject mapping to update',
	}),
};

module.exports = ShuttleSubjectMappingsUpdateCommand;
