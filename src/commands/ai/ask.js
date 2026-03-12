'use strict';

const BoxCommand = require('../../box-command');
const { Flags } = require('@oclif/core');
const utilities = require('../../util');

class AiAskCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(AiAskCommand);
		let options = {
			mode:
				flags.items.length > 1 ? 'multiple_item_qa' : 'single_item_qa',
		};

		if (flags.prompt) {
			options.prompt = flags.prompt;
		}
		if (flags.items) {
			options.items = flags.items;
		}
		if (flags['ai-agent']) {
			options.aiAgent = flags['ai-agent'];
		}

		let answer = await this.tsClient.ai.createAiAsk(options);
		delete answer.rawData;
		await this.output(answer);
	}
}

AiAskCommand.description =
	'Sends an AI request to supported LLMs and returns an answer';
AiAskCommand.examples = [
	'box ai:ask --items=id=12345,type=file --prompt "What is the status of this document?"',
];
AiAskCommand._endpoint = 'post_ai_ask';

AiAskCommand.flags = {
	...BoxCommand.flags,
	prompt: Flags.string({
		required: true,
		description: 'The prompt for the AI request',
	}),
	items: Flags.string({
		required: true,
		description:
			'Items for the AI request. Format: id=FILE_ID,type=file (or content=TEXT,type=file). Supported keys: id, type, content.',
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
			'AI agent configuration as JSON. Example: {"type":"ai_agent_ask","basic_text":{"model":"azure__openai__gpt_4o_mini"}}',
		parse(input) {
			try {
				return JSON.parse(input);
			} catch (error) {
				throw new Error(`Error parsing AI agent JSON: ${error.message}`);
			}
		},
	}),
};

module.exports = AiAskCommand;
