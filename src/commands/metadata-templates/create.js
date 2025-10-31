'use strict';

const BoxCommand = require('../../box-command');
const { Flags } = require('@oclif/core');
const BoxCLIError = require('../../cli-error');

const FLAG_HANDLERS = Object.freeze({
	string(value, currentField, template) {
		template.fields.push(currentField);

		return {
			type: 'string',
			displayName: value.input,
		};
	},
	date(value, currentField, template) {
		template.fields.push(currentField);

		return {
			type: 'date',
			displayName: value.input,
		};
	},
	number(value, currentField, template) {
		template.fields.push(currentField);

		return {
			type: 'float',
			displayName: value.input,
		};
	},
	enum(value, currentField, template) {
		template.fields.push(currentField);

		return {
			type: 'enum',
			displayName: value.input,
			options: [],
		};
	},
	'multi-select': (value, currentField, template) => {
		template.fields.push(currentField);

		return {
			type: 'multiSelect',
			displayName: value.input,
			options: [],
		};
	},
	hidden(value, currentField, template) {
		let isHidden = !value.input.startsWith('--no-');

		if (!currentField) {
			template.hidden = isHidden;
			return null;
		}

		currentField.hidden = isHidden;
		return currentField;
	},
	'field-key': (value, currentField /* , template*/) => {
		if (!currentField) {
			throw new BoxCLIError(
				'Unexpected --field-key flag outside of field definition'
			);
		}

		currentField.key = value.input;
		return currentField;
	},
	description(value, currentField /* , template*/) {
		if (!currentField) {
			throw new BoxCLIError(
				'Unexpected --description flag outside of field definition'
			);
		}

		currentField.description = value.input;
		return currentField;
	},
	option(value, currentField /* , template*/) {
		if (!currentField) {
			throw new BoxCLIError(
				'Unexpected --option flag outside of field definition'
			);
		}

		if (
			currentField.type !== 'enum' &&
			currentField.type !== 'multiSelect'
		) {
			throw new BoxCLIError(
				'--option flag can only be specified for enum and multi-select fields'
			);
		}

		currentField.options.push({ key: value.input });
		return currentField;
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
function _parseFlags(preparsedArgv) {
	let template = {
		fields: [],
	};

	let currentField = null;

	for (const value of preparsedArgv.filter((v) => v.type === 'flag')) {
		let handler =
			FLAG_HANDLERS[value.flag] ||
			((value_, currentField_) => currentField_);
		currentField = handler(value, currentField, template);
	}

	// Add the last field if necessary and return
	template.fields = template.fields
		.concat(currentField)
		.filter((op) => op !== null);
	return template;
}

class MetadataTemplatesCreateCommand extends BoxCommand {
	async run() {
		const { flags, raw } = await this.parse(MetadataTemplatesCreateCommand);

		let options = _parseFlags(raw);

		let fields = options.fields;
		delete options.fields;

		options.scope = flags.scope;

		if (flags['template-key']) {
			options.templateKey = flags['template-key'];
		}

		if (flags['copy-instance-on-item-copy']) {
			options.copyInstanceOnItemCopy =
				flags['copy-instance-on-item-copy'];
		}

		let template = await this.client.metadata.createTemplate(
			flags['display-name'],
			fields,
			options
		);
		await this.output(template);
	}
}

MetadataTemplatesCreateCommand.description = 'Create a new metadata template';
MetadataTemplatesCreateCommand.examples = [
	'box metadata-templates:create --display-name "Employee Record" --string Name --enum Department --option Sales',
];
MetadataTemplatesCreateCommand._endpoint = 'post_metadata_templates_schema';

MetadataTemplatesCreateCommand.flags = {
	...BoxCommand.flags,
	'display-name': Flags.string({
		description: 'The display name of the metadata template',
		required: true,
	}),
	scope: Flags.string({
		description: 'The scope of the metadata template',
		default: 'enterprise',
	}),
	'template-key': Flags.string({
		description:
			'A unique identifier for the template.  If not specified, will be derived from the display name',
	}),
	hidden: Flags.boolean({
		description: 'Whether this template or field is hidden in the UI',
		allowNo: true,
	}),
	string: Flags.string({
		description: 'Add a string field with the provided name',
		multiple: true,
	}),
	enum: Flags.string({
		description: 'Add an enum field with the provided display name',
		multiple: true,
	}),
	date: Flags.string({
		description: 'Add a date field with the provided display name',
		multiple: true,
	}),
	number: Flags.string({
		description: 'Add a numeric field with the provided display name',
		multiple: true,
	}),
	'multi-select': Flags.string({
		description: 'Add a multi-select field with the provided display name',
		multiple: true,
	}),
	'field-key': Flags.string({
		description: 'Set the key of a field',
		multiple: true,
	}),
	description: Flags.string({
		description: 'Set the description of a field',
		multiple: true,
	}),
	option: Flags.string({
		description: 'Add an option to a field',
		multiple: true,
	}),
	'id-only': Flags.boolean({
		description: 'Return only an ID to output from this command',
	}),
	'copy-instance-on-item-copy': Flags.boolean({
		description:
			'Whether to include the metadata when a file or folder is copied',
	}),
};

module.exports = MetadataTemplatesCreateCommand;
