'use strict';

const { Flags } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const {
	jobIdFlag,
	subjectMappingFlags,
	buildSubjectTarget,
} = require('../../../modules/shuttle');

class ShuttleSubjectMappingsCreateCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(ShuttleSubjectMappingsCreateCommand);
		const requestBody = {
			jobId: flags['job-id'],
			discoveredSubjectId: flags['discovered-subject-id'],
		};

		if (Object.hasOwn(flags, 'revision')) {
			requestBody.revision = flags.revision;
		}
		if (Object.hasOwn(flags, 'subject-skipped')) {
			requestBody.isSubjectSkipped = flags['subject-skipped'];
		}
		const target = buildSubjectTarget(flags);
		if (target) {
			requestBody.target = target;
		}

		const mapping =
			await this.tsClient.shuttle.createShuttleSubjectMappingV2026R0(
				requestBody
			);
		await this.output(mapping.rawData ?? mapping);
	}
}

ShuttleSubjectMappingsCreateCommand.description =
	'Create a subject mapping that connects a discovered source subject of a Box Shuttle job to a Box user or group. Leave out --target-type and --target-id when the subject is skipped. Discovered subjects are listed by shuttle:discovered-subjects';
ShuttleSubjectMappingsCreateCommand.examples = [
	'box shuttle:subject-mappings:create --job-id 6a3ba68e810d9156194530a1 --discovered-subject-id 6a3ba7a24ea17bc9461eeacf --target-type user --target-id 11111',
	'box shuttle:subject-mappings:create --job-id 6a3ba68e810d9156194530a1 --discovered-subject-id 6a3ba7a24ea17bc9461eeacf --subject-skipped',
];
ShuttleSubjectMappingsCreateCommand._endpoint = 'post_shuttle_subject_mappings';

ShuttleSubjectMappingsCreateCommand.flags = {
	...BoxCommand.flags,
	'job-id': jobIdFlag('ID of the shuttle job this mapping belongs to'),
	'discovered-subject-id': Flags.string({
		description:
			'ID of the discovered subject to map, as listed by shuttle:discovered-subjects',
		required: true,
	}),
	revision: Flags.integer({
		description:
			'Discovery revision to resolve the subject against. The API uses the latest revision when omitted',
	}),
	...subjectMappingFlags(),
};

module.exports = ShuttleSubjectMappingsCreateCommand;
