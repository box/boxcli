'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');
const BoxCLIError = require('../../cli-error');

const UNESCAPED_COMMA_REGEX = /(?<![^\\](?:\\\\)*\\),/gu;
const UNESCAPED_DOT_REGEX = /(?<![^\\](?:\\\\)*\\)\./gu;

const FLAG_HANDLERS = Object.freeze({
	'add-enum-option': (value, currentOp, ops) => {
		ops.push(currentOp);

		return {
			op: 'addEnumOption',
			fieldKey: value.input,
			data: {},
		};
	},
	'reorder-enum-options': (value, currentOp, ops) => {
		ops.push(currentOp);

		return {
			op: 'reorderEnumOptions',
			fieldKey: value.input,
			enumOptionKeys: [],
		};
	},
	'reorder-fields': (value, currentOp, ops) => {
		ops.push(currentOp);

		return {
			op: 'reorderFields',
			fieldKeys: value.input.split(UNESCAPED_COMMA_REGEX).filter(v => v.length > 0),
		};
	},
	'edit-field': (value, currentOp, ops) => {
		ops.push(currentOp);

		return {
			op: 'editField',
			fieldKey: value.input,
			data: {},
		};
	},
	'edit-enum-option': (value, currentOp, ops) => {
		ops.push(currentOp);

		let keyParts = value.input.split(UNESCAPED_DOT_REGEX).filter(v => v.length > 0);
		if (!keyParts || keyParts.length !== 2) {
			throw new BoxCLIError('Enum option key must be formatted as fieldKey.optionKey');
		}

		return {
			op: 'editEnumOption',
			fieldKey: keyParts[0],
			enumOptionKey: keyParts[1],
			data: {},
		};
	},
	'remove-enum-option': (value, currentOp, ops) => {
		ops.push(currentOp);

		let keyParts = value.input.split(UNESCAPED_DOT_REGEX).filter(v => v.length > 0);
		if (!keyParts || keyParts.length !== 2) {
			throw new BoxCLIError('Enum option key must be formatted as fieldKey.optionKey');
		}

		return {
			op: 'removeEnumOption',
			fieldKey: keyParts[0],
			enumOptionKey: keyParts[1],
		};
	},
	'remove-field': (value, currentOp, ops) => {
		ops.push(currentOp);

		return {
			op: 'removeField',
			fieldKey: value.input,
		};
	},
	option(value, currentOp/* , ops*/) {

		if (!currentOp) {
			throw new BoxCLIError('Unexpected --option flag outside of option-related operation');
		}

		let fieldType;
		switch (currentOp.op) {
		case 'addEnumOption':
		case 'editEnumOption':
		case 'addMultiSelectOption':
			currentOp.data.key = value.input;
			break;
		case 'reorderEnumOptions':
			currentOp.enumOptionKeys.push(value.input);
			break;
		case 'addField':
			fieldType = currentOp.data.type;
			if (fieldType !== 'enum' && fieldType !== 'multiSelect') {
				throw new BoxCLIError(`Unexpected --option flag while specifying ${fieldType} field`);
			}
			currentOp.data.options.push({key: value.input});
			break;
		default:
			throw new BoxCLIError('Unexpected --option flag outside of option-related operation');
		}

		return currentOp;
	},
	'field-key': (value, currentOp/* , ops*/) => {
		if (!currentOp) {
			throw new BoxCLIError('Unexpected --field-key flag outside of field operation');
		}

		switch (currentOp.op) {
		case 'editField':
		case 'addField':
			currentOp.data.key = value.input;
			break;
		default:
			throw new BoxCLIError('Unexpected --field-key flag outside of field add or edit operation');
		}

		return currentOp;
	},
	description(value, currentOp/* , ops*/) {
		if (!currentOp || (currentOp.op !== 'editField' && currentOp.op !== 'addField')) {
			throw new BoxCLIError('Unexpected --description flag outside of field operation');
		}

		currentOp.data.description = value.input;
		return currentOp;
	},
	hidden(value, currentOp/* , ops*/) {
		if (!currentOp) {
			currentOp = {
				op: 'editTemplate',
				data: {},
			};
		}

		switch (currentOp.op) {
		case 'editTemplate':
		case 'editField':
		case 'addField':
			currentOp.data.hidden = (!value.input.startsWith('--no-'));
			break;
		default:
			throw new BoxCLIError('Unexpected --hidden flag outside of template or field edit operation');
		}

		return currentOp;
	},
	'display-name': (value, currentOp/* , ops*/) => {
		if (!currentOp) {
			currentOp = {
				op: 'editTemplate',
				data: {},
			};
		}

		switch (currentOp.op) {
		case 'editTemplate':
		case 'editField':
			currentOp.data.displayName = value.input;
			break;
		default:
			throw new BoxCLIError('Unexpected --display-name flag outside of template or field edit operation');
		}

		return currentOp;
	},
	string(value, currentOp, ops) {
		ops.push(currentOp);

		return {
			op: 'addField',
			data: {
				type: 'string',
				displayName: value.input,
			},
		};
	},
	enum(value, currentOp, ops) {
		ops.push(currentOp);

		return {
			op: 'addField',
			data: {
				type: 'enum',
				displayName: value.input,
				options: [],
			},
		};
	},
	number(value, currentOp, ops) {
		ops.push(currentOp);

		return {
			op: 'addField',
			data: {
				type: 'float',
				displayName: value.input,
			},
		};
	},
	date(value, currentOp, ops) {
		ops.push(currentOp);

		return {
			op: 'addField',
			data: {
				type: 'date',
				displayName: value.input,
			},
		};
	},
	'multi-select': (value, currentOp, ops) => {
		ops.push(currentOp);

		return {
			op: 'addField',
			data: {
				type: 'multiSelect',
				displayName: value.input,
				options: [],
			},
		};
	},
	'add-multi-select-option': (value, currentOp, ops) => {
		ops.push(currentOp);

		return {
			op: 'addMultiSelectOption',
			fieldKey: value.input,
			data: {},
		};
	},
});

/**
 * Parses out field-related flags into the correct array of objects to pass
 * to the API.
 *
 * @param {Object[]} preparsedArgv The "raw" parsed args/flags from oclif
 * @returns {Object[]} The field definition array
 * @private
 */
function _parseOperations(preparsedArgv) {

	let ops = [],
		currentOp = null;

	preparsedArgv.filter(v => v.type === 'flag').forEach(value => {

		let handler = FLAG_HANDLERS[value.flag] || ((val, curOp) => curOp);
		currentOp = handler(value, currentOp, ops);
	});

	// Add the last field if necessary and return
	return ops.concat(currentOp).filter(op => op !== null);
}

class MetadataTemplatesUpdateCommand extends BoxCommand {
	async run() {
		const { flags, args, raw } = this.parse(MetadataTemplatesUpdateCommand);
		let operations = _parseOperations(raw);

		let template = await this.client.metadata.updateTemplate(flags.scope, args.templateKey, operations);
		await this.output(template);
	}
}

MetadataTemplatesUpdateCommand.description = 'Update a metadata template';
MetadataTemplatesUpdateCommand.examples = ['box metadata-templates:update employeeRecord --hidden'];
MetadataTemplatesUpdateCommand._endpoints = 'put_metadata_templates_id_id_schema';

MetadataTemplatesUpdateCommand.flags = {
	...BoxCommand.flags,
	'display-name': flags.string({
		description: 'The display name of the metadata template or field',
		multiple: true,
	}),
	scope: flags.string({
		description: 'The scope of the metadata template',
		default: 'enterprise',
	}),
	hidden: flags.boolean({
		description: 'Whether this template or field is hidden in the UI',
		allowNo: true,
	}),
	string: flags.string({
		description: 'Add a string field with the provided name',
		multiple: true,
	}),
	enum: flags.string({
		description: 'Add an enum field with the provided display name',
		multiple: true,
	}),
	date: flags.string({
		description: 'Add a date field with the provided display name',
		multiple: true,
	}),
	number: flags.string({
		description: 'Add a numeric field with the provided display name',
		multiple: true,
	}),
	'multi-select': flags.string({
		description: 'Add a multi-select field with the provided display name',
		multiple: true,
	}),
	'add-multi-select-option': flags.string({
		description: 'Add an option to a specified multiselect field; must be followed by one or more --option flags',
		multiple: true,
	}),
	'field-key': flags.string({
		description: 'Set the key of a field',
		multiple: true,
	}),
	description: flags.string({
		description: 'Set the description of a field',
		multiple: true,
	}),
	option: flags.string({
		description: 'Specify a field option',
		multiple: true,
	}),
	'add-enum-option': flags.string({
		description: 'Add an enum option to the specified field; must be followed by one or more --option flags',
		multiple: true,
	}),
	'reorder-enum-options': flags.string({
		description: 'Reorder the options for a given field; must be followed by one or more --option flags',
		multiple: true,
	}),
	'reorder-fields': flags.string({
		description: 'Reorder the template fields; must be in the form first_key,second_key,...',
	}),
	'edit-field': flags.string({
		description: 'Edit the specified field; must be followed by flags to apply to the field',
	}),
	'edit-enum-option': flags.string({
		description: 'Edit the specified enum option; must be followed by an --option flag',
	}),
	'remove-enum-option': flags.string({
		description: 'Removes the specified enum field option; must be in the form fieldKey.optionKey',
	}),
	'remove-field': flags.string({
		description: 'Remove the specified field',
	})
};

MetadataTemplatesUpdateCommand.args = [
	{
		name: 'templateKey',
		description: 'The key of the template to update',
		hidden: false,
		required: true,
	}
];

module.exports = MetadataTemplatesUpdateCommand;
