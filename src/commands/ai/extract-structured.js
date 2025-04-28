'use strict'

const BoxCommand = require('../../box-command')
const {Flags} = require('@oclif/core')
const utils = require('../../util')
const BoxCLIError = require('../../cli-error')

class AiExtractStructuredCommand extends BoxCommand {
	async run() {
		const {flags} = await this.parse(AiExtractStructuredCommand)
		let options = {}

		if (flags.items) {
			options.items = flags.items
		}

		if (flags.fields) {
			options.fields = JSON.parse(flags.fields)
		}

		let answer
		let answerData
		try {
			const requestBody = {
				items: options.items,
				fields: options.fields,
			}
			answer = await this.tsClient.ai.createAiExtractStructured(requestBody)
		} catch (error) {
			throw new BoxCLIError(`API request failed: ${error.message}`)
		}

		answerData = {
			answer: answer.rawData.answer,
			createdAt: {
				value: answer.rawData.created_at,
			},
			completionReason: answer.rawData.completion_reason,
		}

		await this.output(answerData)
	}
	async _formatOutputObject(obj) {
		return obj
	}
}

AiExtractStructuredCommand.description = 'Extract structured metadata from a file using Box AI'
AiExtractStructuredCommand.examples = [
	'box ai:extract-structured --items=id=12345,type=file --fields \'[{"key":"firstName","type":"string","description":"Person first name","prompt":"What is the first name?","displayName":"First name"}]\' --json',
]
AiExtractStructuredCommand._endpoint = 'post_ai_extract_structured'

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
			}
			const obj = utils.parseStringToObject(input, ['id', 'type', 'content'])
			for (const key in obj) {
				if (key === 'id') {
					item.id = obj[key]
				} else if (key === 'type') {
					item.type = obj[key]
				} else if (key === 'content') {
					item.content = obj[key]
				} else {
					throw new Error(`Invalid item key ${key}`)
				}
			}
			if (!item.id) {
				throw new Error('Item must include an id')
			}
			return item
		},
	}),
	fields: Flags.string({
		required: true,
		description:
			'JSON string of fields to extract (e.g., [{"key":"firstName","type":"string","description":"Person first name","prompt":"What is the first name?","displayName":"First name"}])',
	}),
}

module.exports = AiExtractStructuredCommand
