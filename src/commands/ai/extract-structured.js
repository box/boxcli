'use strict';

const BoxCommand = require('../../box-command');
const { Flags } = require('@oclif/core');
const utils = require('../../util');

class AiExtractStructuredCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(AiExtractStructuredCommand);
		let options = {};

		if (flags.items) {
			options.items = flags.items;
		}

		if (flags.fields && flags['metadata-template']) {
			throw new Error(
				'Only one of fields or metadata_template can be provided',
			);
		}

		if (flags.fields) {
			options.fields = flags.fields;
			delete this.flags.fields;
		} else if (flags['metadata-template']) {
			options.metadataTemplate = flags['metadata-template'];
		} else {
			throw new Error('Either fields or metadata_template must be provided');
		}

		if (flags['ai-agent']) {
			options.aiAgent = flags['ai-agent'];
		}

		let answer = await this.tsClient.ai.createAiExtractStructured(options);

		await this.output(answer.rawData);
	}
}

AiExtractStructuredCommand.description =
	'Sends an AI request to supported Large Language Models (LLMs) and returns extracted metadata as a set of key-value pairs. For this request, you either need a metadata template or a list of fields you want to extract. Input is either a metadata template or a list of fields to ensure the structure.';
AiExtractStructuredCommand.examples = [
	'box ai:extract-structured --items="id=12345,type=file" --fields "key=hobby,type=multiSelect,description=Person hobby,prompt=What is your hobby?,displayName=Hobby,options=Guitar;Books"',
	'box ai:extract-structured --items="id=12345,type=file" --metadata-template="type=metadata_template,scope=enterprise,template_key=test" --ai-agent \'{"type":"ai_agent_extract_structured","basicText":{"llmEndpointParams":{"type":"openai_params","frequencyPenalty": 1.5,"presencePenalty": 1.5,"stop": "<|im_end|>","temperature": 0,"topP": 1},"model": "azure__openai__gpt_4o_mini","numTokensForCompletion": 8400,"promptTemplate": "It is, consider these travel options and answer the.","systemMessage": "You are a helpful travel assistant specialized in budget travel"}}}\'',
];
AiExtractStructuredCommand._endpoint = 'post_ai_extract_structured';

AiExtractStructuredCommand.flags = {
	...BoxCommand.flags,
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
			if (!item.id) {
				throw new Error('Item must include an id');
			}
			return item;
		},
	}),
	'metadata-template': Flags.string({
		description: 'The metadata template containing the fields to extract.',
		parse(input) {
			const metadataTemplate = {
				type: 'metadata_template',
				scope: '',
				templateKey: '',
			};
			const obj = utils.parseStringToObject(input, [
				'type',
				'scope',
				'template_key',
			]);
			for (const key in obj) {
				if (key === 'type') {
					metadataTemplate.type = obj[key];
				} else if (key === 'scope') {
					metadataTemplate.scope = obj[key];
				} else if (key === 'template_key') {
					metadataTemplate.templateKey = obj[key];
				} else {
					throw new Error(`Invalid item key ${key}`);
				}
			}
			return metadataTemplate;
		},
	}),
	fields: Flags.string({
		multiple: true,
		description: 'The fields to be extracted from the provided items.',
		parse(input) {
			const fields = {};
			const obj = utils.parseStringToObject(input, [
				'key',
				'type',
				'description',
				'prompt',
				'displayName',
				'options',
			]);
			for (const key in obj) {
				if (key === 'key') {
					fields.key = obj[key];
				} else if (key === 'type') {
					fields.type = obj[key];
				} else if (key === 'description') {
					fields.description = obj[key];
				} else if (key === 'prompt') {
					fields.prompt = obj[key];
				} else if (key === 'displayName') {
					fields.displayName = obj[key];
				} else if (key === 'options') {
					try {
						const parsedOptions = obj[key]
							.split(';')
							.filter((item) => item)
							.map((item) => ({ key: item.trim() }));
						if (parsedOptions.length === 0) {
							throw new Error('Options field must contain at least one value');
						}
						fields.options = parsedOptions;
					} catch (error) {
						throw new Error(`Error parsing options: ${error.message}`);
					}
				} else {
					throw new Error(`Invalid item key ${key}`);
				}
			}

			return fields;
		},
	}),
	'ai-agent': Flags.string({
		required: false,
		description:
			'The AI agent to be used for the structured extraction, provided as a JSON string. Example: {"type": "ai_agent_extract_structured", "basicText": {"model": "azure__openai__gpt_4o_mini", "promptTemplate": "Answer the question based on {content}"}}',
		parse(input) {
			try {
				return JSON.parse(input);
			} catch (error) {
				throw ('Error parsing AI agent ', error);
			}
		},
	}),
};

module.exports = AiExtractStructuredCommand;
