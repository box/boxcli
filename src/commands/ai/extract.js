'use strict';

const BoxCommand = require('../../box-command');
const { Flags } = require('@oclif/core');
const utils = require('../../util');

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
	'box ai:extract --prompt "firstName, lastName, location, yearOfBirth, company" --items "id=12345,type=file" --ai-agent \'{"type":"ai_agent_extract","basicText":{"llmEndpointParams":{"type":"openai_params","frequencyPenalty": 1.5,"presencePenalty": 1.5,"stop": "<|im_end|>","temperature": 0,"topP": 1},"model": "azure__openai__gpt_4o_mini","numTokensForCompletion": 8400,"promptTemplate": "It is, consider these travel options and answer the.","systemMessage": "You are a helpful travel assistant specialized in budget travel"}}}\'',
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
		description: 'The items that LLM will process.',
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
			'The AI agent to be used for the extraction, provided as a JSON string. Example: {"type": "ai_agent_extract", "basicText": {"model": "azure__openai__gpt_4o_mini", "promptTemplate": "Answer the question based on {content}"}}',
		parse(input) {
			try {
				return JSON.parse(input);
			} catch (error) {
				throw ('Error parsing AI agent ', error);
			}
		},
	}),
};

module.exports = AiExtractCommand;
