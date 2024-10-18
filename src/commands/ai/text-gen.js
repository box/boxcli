'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');
const utils = require('../../util');

class AiTextGenCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(AiTextGenCommand);
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

AiTextGenCommand.description = 'Sends an AI request to supported LLMs and returns an answer specifically focused on the creation of new text.';
AiTextGenCommand.examples = ['box ai:text-gen --dialogue-history=prompt="What is the status of this document?",answer="It is in review",created-at="2024-07-09T11:29:46.835Z" --items=id=12345,type=file --prompt="What is the status of this document?"'];
AiTextGenCommand._endpoint = 'post_ai_text_gen';

AiTextGenCommand.flags = {
	...BoxCommand.flags,

    'dialogue-history': flags.string({
        required: false,
        description: 'The history of prompts and answers previously passed to the LLM.',
        multiple: true,
        parse(input) {
            const record = {};
            const obj = utils.parseStringToObject(input, ['prompt', 'answer', 'created-at']);
            for (const key in obj) {
                if (key === 'prompt') {
                    record.prompt = obj[key];
                } else if (key === 'answer') {
                    record.answer = obj[key];
                } else if (key === 'created-at') {
                    record.created_at = BoxCommand.normalizeDateString(obj[key]);
                } else {
                    throw new Error(`Invalid record key ${key}`);
                }
            }

            return record;
        },
    }),
    items: flags.string({
        required: true,
        description: 'The items to be processed by the LLM, often files. The array can include exactly one element.',
        multiple: true,
        parse(input) {
            const item = {
                id: '',
                type: 'file'
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
        }
    }),
    prompt: flags.string({
        required: true,
        description: 'The prompt for the AI request',
    })
};

module.exports = AiTextGenCommand;
