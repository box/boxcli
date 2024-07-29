'use strict';

const BoxCommand = require('../../box-command');
const { flags } = require('@oclif/command');
const utils = require('../../util');

class AiAskCommand extends BoxCommand {
	async run() {
		const { flags, args } = this.parse(AiAskCommand);
		let options = {};

        if (flags.mode) {
            options.mode = flags.mode;
        } else {
            options.mode = flags.items.length > 1 ? 'multi_item_qa' : 'single_item_qa';
        }
        if (flags.prompt) {
            options.prompt = flags.prompt;
        }
        if (flags.items) {
            options.items = flags.items;
        }

        let answer = await this.client.ai.ask({
            prompt: options.prompt,
            items: options.items,
            mode: options.mode
        });
        await this.output(answer);
	}
}

AiAskCommand.description = 'Sends an AI request to supported LLMs and returns an answer';
AiAskCommand.examples = ['box ai:ask --mode single_item_qa --items=id=12345,type=file --prompt "What is the status of this document?"'];
AiAskCommand._endpoint = 'post_ai_ask';

AiAskCommand.flags = {
	...BoxCommand.flags,
    mode: flags.string({
        required: false,
        description: 'The mode of the AI request, should be \'single_item_qa\' for one item or \'multi_item_qa\' for multiple items',
    }),
    prompt: flags.string({
        required: true,
        description: 'The prompt for the AI request',
    }),
    items: flags.string({
        required: true,
        description: 'The items for the AI request',
        multiple: true,
        parse(input) {
            const item = {
                id: '',
                type: 'file'
            };
            const obj = utils.parseStringToObject(input);
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
};

module.exports = AiAskCommand;
