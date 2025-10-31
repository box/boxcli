'use strict';

const BoxCommand = require('../../box-command');
const { Flags } = require('@oclif/core');
const utilities = require('../../util');

class AiExtractStructuredCommand extends BoxCommand {
	async run() {
		const { flags } = await this.parse(AiExtractStructuredCommand);
		let options = {};

		if (flags.items) {
			options.items = flags.items;
		}

		if (flags.fields && flags['metadata-template']) {
			throw new Error(
				'Only one of fields or metadata_template can be provided'
			);
		}

		if (flags.fields) {
			options.fields = flags.fields;
			delete this.flags.fields;
		} else if (flags['metadata-template']) {
			options.metadataTemplate = flags['metadata-template'];
		} else {
			throw new Error(
				'Either fields or metadata_template must be provided'
			);
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
			const object = utilities.parseStringToObject(input, [
				'type',
				'scope',
				'template_key',
			]);
			for (const key in object) {
				switch (key) {
					case 'type': {
						metadataTemplate.type = object[key];

						break;
					}
					case 'scope': {
						metadataTemplate.scope = object[key];

						break;
					}
					case 'template_key': {
						metadataTemplate.templateKey = object[key];

						break;
					}
					default: {
						throw new Error(`Invalid item key ${key}`);
					}
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
			const object = utilities.parseStringToObject(input, [
				'key',
				'type',
				'description',
				'prompt',
				'displayName',
				'options',
			]);
			for (const key in object) {
				switch (key) {
					case 'key': {
						fields.key = object[key];

						break;
					}
					case 'type': {
						fields.type = object[key];

						break;
					}
					case 'description': {
						fields.description = object[key];

						break;
					}
					case 'prompt': {
						fields.prompt = object[key];

						break;
					}
					case 'displayName': {
						fields.displayName = object[key];

						break;
					}
					case 'options': {
						try {
							const parsedOptions = object[key]
								.split(';')
								.filter(Boolean)
								.map((item) => ({ key: item.trim() }));
							if (parsedOptions.length === 0) {
								throw new Error(
									'Options field must contain at least one value'
								);
							}
							fields.options = parsedOptions;
						} catch (error) {
							throw new Error(
								`Error parsing options: ${error.message}`
							);
						}

						break;
					}
					default: {
						throw new Error(`Invalid item key ${key}`);
					}
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
