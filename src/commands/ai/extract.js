'use strict';

const BoxCommand = require('../../box-command');
const { Flags } = require('@oclif/core');
const utils = require('../../util');
const fs = require('fs').promises;

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
    if (flags.ai_agent) {
      options.ai_agent = flags.ai_agent;
    }

    let answer = await this.tsClient.ai.createAiExtract({
      prompt: options.prompt,
      items: options.items,
      ai_agent: options.ai_agent,
    });
    
	delete answer.rawData;
    await this.output(answer);
  }
}

AiExtractCommand.description =
  'Sends an AI request to supported LLMs and extracts metadata in the form of key value pairs';
AiExtractCommand.examples = [
  'box ai:extract --items=id=12345,type=file --prompt "firstName, lastName, location, yearOfBirth, company"',
  'box ai:extract --items=id=12345,type=file --prompt "firstName, lastName" --ai_agent="id=14031;type=ai_agent_extract;basic_text.llm_endpoint_params.type=openai_params;basic_text.llm_endpoint_params.frequency_penalty=1.5;basic_text.llm_endpoint_params.presence_penalty=1.5;basic_text.llm_endpoint_params.stop=<|im_end|>;basic_text.llm_endpoint_params.temperature=0;basic_text.llm_endpoint_params.top_p=1;basic_text.model=azure__openai__gpt_4o_mini;basic_text.num_tokens_for_completion=8400;basic_text.prompt_template=It is {current_date}, consider these travel options {content} and answer the {user_question}.;basic_text.system_message=You are a helpful travel assistant specialized in budget travel;long_text.embeddings.model=azure__openai__text_embedding_ada_002;long_text.embeddings.strategy.id=basic;long_text.embeddings.strategy.num_tokens_per_chunk=64;long_text.llm_endpoint_params.type=openai_params;long_text.llm_endpoint_params.frequency_penalty=1.5;long_text.llm_endpoint_params.presence_penalty=1.5;long_text.llm_endpoint_params.stop=<|im_end|>;long_text.llm_endpoint_params.temperature=0;long_text.llm_endpoint_params.top_p=1;long_text.model=azure__openai__gpt_4o_mini;long_text.num_tokens_for_completion=8400;long_text.prompt_template=It is {current_date}, consider these travel options {content} and answer the {user_question}.;long_text.system_message=You are a helpful travel assistant specialized in budget travel"',
  'box ai:extract --items=id=12345,type=file --prompt "firstName, lastName" --ai_agent=file:ai_agent_config.json',
];
AiExtractCommand._endpoint = 'post_ai_extract';

// Flags definition
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
  ai_agent: Flags.string({
    required: false,
    description: 'The AI agent to be used for extraction (e.g., key=value pairs with semicolons or file:config.json)',
	parse(input) {
     JSON.parse(input);
	}
  })
};

module.exports = AiExtractCommand;