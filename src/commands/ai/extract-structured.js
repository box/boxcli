'use strict';

const BoxCommand = require('../../box-command');
const {Flags} = require('@oclif/core');
const utils = require('../../util');

class AiExtractStructuredCommand extends BoxCommand {
	async run() {
		const {flags} = await this.parse(AiExtractStructuredCommand);
		let options = {};

		if (flags.items) {
			options.items = flags.items;
		}

		if (flags.fields) {
			options.fields = flags.fields;
			delete this.flags.fields;
		} else if (flags['metadata-template']) {
			options.metadataTemplate = flags['metadata-template'];
		} else {
			throw new Error('Either fields or metadata_template must be provided');
		}

		if (flags.ai_agent) {
			options.aiAgent = flags.ai_agent;
		}

		let answer = await this.tsClient.ai.createAiExtractStructured(options);

		await this.output(answer.rawData);
	}
}

AiExtractStructuredCommand.description = 'Extract structured metadata from a file using Box AI';
AiExtractStructuredCommand.examples = [
	'box ai:extract-structured --items="id=12345,type=file" --fields "key=firstName,type=string,description=Person first name,prompt=What is the first name?,displayName=First name" --fields "key=lastName,type=string,description=Person last name,prompt=What is the last name?,displayName=Last name" --ai_agent \'{"type":"ai_agent_extract","basicText":{"llmEndpointParams":{"type":"openai_params","frequencyPenalty": 1.5,"presencePenalty": 1.5,"stop": "<|im_end|>","temperature": 0,"topP": 1},"model": "azure__openai__gpt_4o_mini","numTokensForCompletion": 8400,"promptTemplate": "It is, consider these travel options and answer the.","systemMessage": "You are a helpful travel assistant specialized in budget travel"},"longText":{"embeddings":{ "model": "azure__openai__text_embedding_ada_002","strategy":{"id": "basic","numTokensPerChunk": 64}},"llmEndpointParams":{"type":"openai_params","frequencyPenalty": 1.5,"presencePenalty": 1.5,"stop": "<|im_end|>","temperature": 0,"topP": 1},"model":"azure__openai__gpt_4o_mini","numTokensForCompletion":8400,"promptTemplate":"It is , consider these travel options and answer the.","systemMessage":"You are a helpful travel assistant specialized in budget travel"}}\'',
	'box ai:extract-structured --items="id=12345,type=file" --metadata-template="type=metadata_template,scope=enterprise,template_key=test" --ai_agent \'{"type":"ai_agent_extract","basicText":{"llmEndpointParams":{"type":"openai_params","frequencyPenalty": 1.5,"presencePenalty": 1.5,"stop": "<|im_end|>","temperature": 0,"topP": 1},"model": "azure__openai__gpt_4o_mini","numTokensForCompletion": 8400,"promptTemplate": "It is, consider these travel options and answer the.","systemMessage": "You are a helpful travel assistant specialized in budget travel"},"longText":{"embeddings":{ "model": "azure__openai__text_embedding_ada_002","strategy":{"id": "basic","numTokensPerChunk": 64}},"llmEndpointParams":{"type":"openai_params","frequencyPenalty": 1.5,"presencePenalty": 1.5,"stop": "<|im_end|>","temperature": 0,"topP": 1},"model":"azure__openai__gpt_4o_mini","numTokensForCompletion":8400,"promptTemplate":"It is , consider these travel options and answer the.","systemMessage":"You are a helpful travel assistant specialized in budget travel"}}\'',
];
AiExtractStructuredCommand._endpoint = 'post_ai_extract_structured';

AiExtractStructuredCommand.flags = {
	...BoxCommand.flags,
	items: Flags.string({
		required: true,
		description: 'The items for the AI request (id, type, optional content)',
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
		description: 'metadata template to use for the AI request',
		parse(input) {
			const metadataTemplate = {
				type: 'metadata_template',
				scope: '',
				templateKey: '',
			};
			const obj = utils.parseStringToObject(input, ['type', 'scope', 'template_key']);
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
		description:
			'JSON string of fields to extract (e.g., [{"key":"firstName","type":"string","description":"Person first name","prompt":"What is the first name?","displayName":"First name"}])',
		parse(input) {
			const fields = {
				key: '',
				type: '',
				description: '',
				prompt: '',
				displayName: '',
			};

			const obj = utils.parseStringToObject(input, ['key', 'type', 'description', 'prompt', 'displayName']);
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
				} else {
					throw new Error(`Invalid item key ${key}`);
				}
			}

			return fields;
		},
	}),
	ai_agent: Flags.string({
		required: false,
		description: 'The AI agent to be used for extraction (e.g., key=value pairs with semicolons or file:config.json)',
		parse(input) {
			try {
				return JSON.parse(input);
			} catch (error) {
				throw ('Error parsing ai agent ', error);
			}
		},
	}),
};

module.exports = AiExtractStructuredCommand;
