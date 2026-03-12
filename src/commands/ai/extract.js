'use strict';

const BoxCommand = require('../../box-command');
const { Flags } = require('@oclif/core');
const utilities = require('../../util');

class AiExtractCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(AiExtractCommand);
		let options = {};

		if (flags.prompt) {
			options.prompt = flags.prompt;
		}
		if (flags.items) {
			options.items = flags.items;
		}
		if (flags['ai-agent']) {
			options.aiAgent = flags['ai-agent'];
		}

		let answer = await this.tsClient.ai.createAiExtract(options);

		delete answer.rawData;
		await this.output(answer);
	}
}

AiExtractCommand.description =
	'Sends an AI request to supported Large Language Models (LLMs) and extracts metadata in form of key-value pairs';
AiExtractCommand.examples = [
	'box ai:extract --items=id=12345,type=file --prompt "firstName, lastName, location, yearOfBirth, company"',
	'box ai:extract --prompt "firstName, lastName, location, yearOfBirth, company" --items "id=12345,type=file" --ai-agent \'{"type":"ai_agent_extract","basic_text":{"model":"azure__openai__gpt_4o_mini"}}\'',
];
AiExtractCommand._endpoint = 'post_ai_extract';

// Flags definition
AiExtractCommand.flags = {
	...BoxCommand.flags,
	prompt: Flags.string({
		required: true,
		description:
			'The prompt provided to a Large Language Model (LLM) in the request.',
	}),
	items: Flags.string({
		required: true,
		description:
			'Items for extraction. Format: id=FILE_ID,type=file (or content=TEXT,type=file). Supported keys: id, type, content.',
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
	'ai-agent': Flags.string({
		required: false,
		description:
			'AI agent configuration as JSON. Example: {"type":"ai_agent_extract","basic_text":{"model":"azure__openai__gpt_4o_mini","prompt_template":"Answer the question based on {content}"}}',
		parse(input) {
			try {
				return JSON.parse(input);
			} catch (error) {
				throw new Error(`Error parsing AI agent JSON: ${error.message}`);
			}
		},
	}),
};

module.exports = AiExtractCommand;
