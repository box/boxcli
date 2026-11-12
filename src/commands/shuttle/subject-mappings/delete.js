'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');
const { SHUTTLE_PERMISSIONS } = require('../../../modules/shuttle');

class ShuttleSubjectMappingsDeleteCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(ShuttleSubjectMappingsDeleteCommand);
		await this.tsClient.shuttle.deleteShuttleSubjectMappingByIdV2026R0(args.id);
		this.info(`Deleted shuttle subject mapping ${args.id}`);
	}
}

ShuttleSubjectMappingsDeleteCommand.description =
	`Delete a shuttle subject mapping ${SHUTTLE_PERMISSIONS}`;
ShuttleSubjectMappingsDeleteCommand.examples = [
	'box shuttle:subject-mappings:delete 6a315c0754833bfc5df067bf',
];
ShuttleSubjectMappingsDeleteCommand._endpoint =
	'delete_shuttle_subject_mappings_id';

ShuttleSubjectMappingsDeleteCommand.flags = {
	...BoxCommand.flags,
};

ShuttleSubjectMappingsDeleteCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the shuttle subject mapping to delete',
	}),
};

module.exports = ShuttleSubjectMappingsDeleteCommand;
