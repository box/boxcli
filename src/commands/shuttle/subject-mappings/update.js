'use strict';

const BoxCommand = require('../../../box-command');
const { Flags, Args } = require('@oclif/core');
const {
	resolveBody,
	bodyFlags,
	subjectTargetFlags,
	buildSubjectTarget,
	SHUTTLE_PERMISSIONS,
} = require('../../../modules/shuttle');

class ShuttleSubjectMappingsUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(
			ShuttleSubjectMappingsUpdateCommand
		);
		const requestBody = resolveBody(flags, () => {
			const body = {};
			if (Object.hasOwn(flags, 'is-subject-skipped')) {
				body.isSubjectSkipped = flags['is-subject-skipped'];
			}
			const target = buildSubjectTarget(flags, { command: this });
			if (target !== undefined) {
				body.target = target;
			}
			if (Object.keys(body).length === 0) {
				this.error(
					'Provide at least one update flag, or use --body / --body-file.'
				);
			}
			return body;
		});

		const mapping = await this.tsClient.shuttle.updateShuttleSubjectMappingByIdV2026R0(
			args.id,
			requestBody
		);
		await this.output(mapping.rawData ?? mapping);
	}
}

ShuttleSubjectMappingsUpdateCommand.description =
	`Update a shuttle subject mapping ${SHUTTLE_PERMISSIONS}`;
ShuttleSubjectMappingsUpdateCommand.examples = [
	'box shuttle:subject-mappings:update 6a315c0754833bfc5df067bf --target-type user --target-id 12345678',
	'box shuttle:subject-mappings:update 6a315c0754833bfc5df067bf --is-subject-skipped --clear-target',
];
ShuttleSubjectMappingsUpdateCommand._endpoint =
	'put_shuttle_subject_mappings_id';

ShuttleSubjectMappingsUpdateCommand.flags = {
	...BoxCommand.flags,
	...bodyFlags,
	'is-subject-skipped': Flags.boolean({
		description: 'Skip this subject during migration',
		allowNo: true,
	}),
	...subjectTargetFlags,
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
