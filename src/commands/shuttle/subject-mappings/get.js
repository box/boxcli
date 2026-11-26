'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class ShuttleSubjectMappingsGetCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(ShuttleSubjectMappingsGetCommand);
		const mapping =
			await this.tsClient.shuttle.getShuttleSubjectMappingByIdV2026R0(
				args.id
			);
		await this.output(mapping.rawData ?? mapping);
	}
}

ShuttleSubjectMappingsGetCommand.description =
	'Get a Box Shuttle subject mapping, including its source subject and Box target, if any';
ShuttleSubjectMappingsGetCommand.examples = [
	'box shuttle:subject-mappings:get 6a3ba7a24ea17bc9461eeace',
];
ShuttleSubjectMappingsGetCommand._endpoint = 'get_shuttle_subject_mappings_id';

ShuttleSubjectMappingsGetCommand.flags = {
	...BoxCommand.flags,
};

ShuttleSubjectMappingsGetCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the shuttle subject mapping',
	}),
};

module.exports = ShuttleSubjectMappingsGetCommand;
