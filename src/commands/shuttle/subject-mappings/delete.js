'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../../box-command');

class ShuttleSubjectMappingsDeleteCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(ShuttleSubjectMappingsDeleteCommand);
		await this.tsClient.shuttle.deleteShuttleSubjectMappingByIdV2026R0(
			args.id
		);
		this.info(`Deleted shuttle subject mapping ${args.id}`);
	}
}

ShuttleSubjectMappingsDeleteCommand.description =
	'Permanently delete a Box Shuttle subject mapping';
ShuttleSubjectMappingsDeleteCommand.examples = [
	'box shuttle:subject-mappings:delete 6a3ba7a24ea17bc9461eeace',
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
