'use strict';

const BoxCommand = require('../../box-command');
const { Flags } = require('@oclif/core');
const utils = require('../../util');

class AiExtractCommand extends BoxCommand {

    async run() {
        const { flags } = await this.parse(AiExtractCommand);  //It will return an object flag with all the flags as key value paisr : flags = {prompt:"",items:""}
        let options = {};
        //options.mode = flags.items.length > 1 ? 'multi_item_qa' : 'single_item_qa' //depending on the number of items passes

        if(flags.prompt) {
            options.prompt = flags.prompt;
        }
        if(flags.items) {
            options.items = flags.items;   //items is an array of objects : items = [{id:"",type:"file"}] right now only supports file type
        }
        //Now calling the endpoint
        let answer = await this.tsClient.ai.createAiExtract({
            prompt: options.prompt,
            items: options.items,
        })
        delete answer.rawData;
        delete answer.aiAgentInfo;

        await this.output(answer);
        
    }
}

AiExtractCommand.description = 'Sends an AI request to supported LLMs and extracts metadata in the form of key value pairs';
AiExtractCommand.examples = ['box ai:extract --items=id=12345,type=file --prompt "firstName, lastName, location, yearOfBirth, company"'];
AiExtractCommand._endpoint = 'post_ai_extract';

//Flags definition
AiExtractCommand.flags = {
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
            }

            const obj = utils.parseStringToObject(input,['id','type','content']);
            for (const key in obj) {
                if(key === 'id') {
                    item.id = obj[key];
                }
                else if(key === 'type') {
                    item.type = obj[key];
                }
                else if(key === 'content') {
                    item.content = obj[key];
                } else {
                    throw new Error(`Invalid item key ${key}`);
                }
            }
            return item;
        }
    })
}

module.exports = AiExtractCommand;






