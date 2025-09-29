'use strict';

const BoxCommand = require('../../box-command');
const { Flags } = require('@oclif/core');
const utils = require('../../util');

class AiAskCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(AiAskCommand);
		let options = {};
		options.mode =
			flags.items.length > 1 ? 'multiple_item_qa' : 'single_item_qa';

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
		description: 'The items for the AI request',
		multiple: true,
		parse(input) {
			const item = {
				id: '',
				type: 'file',
			};
			const obj = utils.parseStringToObject(input, ['id', 'type', 'content']);
			for (const key in obj) {
				if (key === 'id') {
					item.id = obj[key];
				} else if (key === 'type') {
					item.type = obj[key];
				} else if (key === 'content') {
					item.content = obj[key];
				} else {
					throw new Error(`Invalid item key ${key}`);
				}
			}

			return item;
		},
	}),
	'ai-agent': Flags.string({
		required: false,
		description:
			'The AI agent to be used for the ask, provided as a JSON string. Example: {"type": "ai_agent_ask", "basicText": {"model": "openai__gpt_3_5_turbo"}}',
		parse(input) {
			try {
				return JSON.parse(input);
			} catch (error) {
				throw ('Error parsing AI agent ', error);
			}
		},
	}),
};

module.exports = AiAskCommand;
