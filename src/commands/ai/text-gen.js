'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');

class AiTextGenCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(AiTextGenCommand);
		let options = {};

        if (flags.dialogue_history) {
            options.dialogueHistory = flags.dialogue_history;
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
AiTextGenCommand.examples = ['box ai:text-gen --dialogue_history=prompt="What is the status of this document?",answer="It is in review" --items=id=12345,type=file --prompt="What is the status of this document?"'];
AiTextGenCommand._endpoint = 'post_ai_text_gen';

AiTextGenCommand.flags = {
	...BoxCommand.flags,
    dialogue_history: flags.string({
        required: false,
        description: 'The history of prompts and answers previously passed to the LLM.',
        multiple: true,
        parse(input) {
            const record = {};
            for (const part of input.split(',')) {
                const [
                    key,
                    value,
                ] = part.split('=');

                switch (key) {
                    case 'prompt':
                        record.prompt = value;
                        break;
                    case 'answer':
                        record.answer = value;
                        break;
                    case 'created_at':
                    case 'createdAt':
                        record.created_at = value;
                        break;
                    default:
                        throw new Error(`Invalid record key: ${key}`);
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
            for (const part of input.split(',')) {
                const [
                    key,
                    value,
                ] = part.split('=');

                switch (key) {
                    case 'id':
                        item.id = value;
                        break;
                    case 'type':
                        item.type = value;
                        break;
                    case 'content':
                        item.content = value;
                        break;
                    default:
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
