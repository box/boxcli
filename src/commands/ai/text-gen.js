'use strict';

const BoxCommand = require('../../box-command');
const { Flags } = require('@oclif/core');
const utilities = require('../../util');

class AiTextGenCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(AiTextGenCommand);
		let options = {};

		if (flags['dialogue-history']) {
			options.dialogueHistory = flags['dialogue-history'];
		}
		options.prompt = flags.prompt;
		options.items = flags.items;

		let answer = await this.client.ai.textGen({
			prompt: options.prompt,
			items: options.items,
			dialogue_history: options.dialogueHistory,
		});

		await this.output(answer);
	}
}

AiTextGenCommand.description =
	'Sends an AI request to supported LLMs and returns an answer specifically focused on the creation of new text.';
AiTextGenCommand.examples = [
	'box ai:text-gen --dialogue-history=prompt="What is the status of this document?",answer="It is in review",created-at="2024-07-09T11:29:46.835Z" --items=id=12345,type=file --prompt="What is the status of this document?"',
];
AiTextGenCommand._endpoint = 'post_ai_text_gen';

AiTextGenCommand.flags = {
	...BoxCommand.flags,

	'dialogue-history': Flags.string({
		required: false,
		description:
			'The history of prompts and answers previously passed to the LLM.',
		multiple: true,
		parse(input) {
			const record = {};
			const object = utilities.parseStringToObject(input, [
				'prompt',
				'answer',
				'created-at',
			]);
			for (const key in object) {
				switch (key) {
					case 'prompt': {
						record.prompt = object[key];

						break;
					}
					case 'answer': {
						record.answer = object[key];

						break;
					}
					case 'created-at': {
						record.created_at = BoxCommand.normalizeDateString(
							object[key]
						);

						break;
					}
					default: {
						throw new Error(`Invalid record key ${key}`);
					}
				}
			}

			return record;
		},
	}),
	items: Flags.string({
		required: true,
		description:
			'The items to be processed by the LLM, often files. The array can include exactly one element.',
		multiple: true,
		parse(input) {
			const item = {
				id: '',
				type: 'file',
			};
			const object = utilities.parseStringToObject(input, [
				'id',
				'type',
				'content',
			]);
			for (const key in object) {
				switch (key) {
					case 'id': {
						item.id = object[key];

						break;
					}
					case 'type': {
						item.type = object[key];

						break;
					}
					case 'content': {
						item.content = object[key];

						break;
					}
					default: {
						throw new Error(`Invalid item key ${key}`);
					}
				}
			}
			return item;
		},
	}),
	prompt: Flags.string({
		required: true,
		description: 'The prompt for the AI request',
	}),
};

module.exports = AiTextGenCommand;
