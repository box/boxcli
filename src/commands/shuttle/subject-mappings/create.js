'use strict';

const BoxCommand = require('../../../box-command');
const { Flags } = require('@oclif/core');
const {
	resolveBody,
	bodyFlags,
	subjectTargetFlags,
	buildSubjectTarget,
	SHUTTLE_PERMISSIONS,
} = require('../../../modules/shuttle');

class ShuttleSubjectMappingsCreateCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(ShuttleSubjectMappingsCreateCommand);
		const requestBody = resolveBody(flags, () => {
			if (!flags['job-id'] || !flags['discovered-subject-id']) {
				this.error(
					'--job-id and --discovered-subject-id are required unless --body / --body-file is set.'
				);
			}
			const body = {
				jobId: flags['job-id'],
				discoveredSubjectId: flags['discovered-subject-id'],
			};
			if (flags.revision !== undefined) {
				body.revision = flags.revision;
			}
			if (Object.hasOwn(flags, 'is-subject-skipped')) {
				body.isSubjectSkipped = flags['is-subject-skipped'];
			}
			const target = buildSubjectTarget(flags, { command: this });
			if (target !== undefined) {
				body.target = target;
			}
			return body;
		});

		const mapping =
			await this.tsClient.shuttle.createShuttleSubjectMappingV2026R0(requestBody);
		await this.output(mapping.rawData ?? mapping);
	}
}

ShuttleSubjectMappingsCreateCommand.description =
	`Create a shuttle subject mapping ${SHUTTLE_PERMISSIONS}`;
ShuttleSubjectMappingsCreateCommand.examples = [
	'box shuttle:subject-mappings:create --job-id 6a315c0754833bfc5df067bf --discovered-subject-id 6a3ba7c02ea17bc9461eeacf --target-type user --target-id 12345678',
	'box shuttle:subject-mappings:create --job-id 6a315c0754833bfc5df067bf --discovered-subject-id 6a3ba7c02ea17bc9461eeacf --is-subject-skipped --clear-target',
];
ShuttleSubjectMappingsCreateCommand._endpoint = 'post_shuttle_subject_mappings';

ShuttleSubjectMappingsCreateCommand.flags = {
	...BoxCommand.flags,
	...bodyFlags,
	'job-id': Flags.string({
		description: 'Shuttle job ID (required unless --body / --body-file)',
	}),
	'discovered-subject-id': Flags.string({
		description:
			'Discovered subject ID (required unless --body / --body-file)',
	}),
	revision: Flags.integer({
		description: 'Discovery-requirements revision to resolve against',
	}),
	'is-subject-skipped': Flags.boolean({
		description: 'Skip this subject during migration',
		allowNo: true,
	}),
	...subjectTargetFlags,
};

module.exports = ShuttleSubjectMappingsCreateCommand;
