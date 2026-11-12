'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const { SHUTTLE_PERMISSIONS } = require('../../../modules/shuttle');

class ShuttleSubjectMappingsGetCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(ShuttleSubjectMappingsGetCommand);
		const mapping = await this.tsClient.shuttle.getShuttleSubjectMappingByIdV2026R0(
			args.id
		);
		await this.output(mapping.rawData ?? mapping);
	}
}

ShuttleSubjectMappingsGetCommand.description =
	`Get a shuttle subject mapping by ID ${SHUTTLE_PERMISSIONS}`;
ShuttleSubjectMappingsGetCommand.examples = [
	'box shuttle:subject-mappings:get 6a315c0754833bfc5df067bf',
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
