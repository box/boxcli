'use strict'

const {test} = require('@oclif/test')
const assert = require('chai').assert
const {TEST_API_ROOT, getFixture} = require('../helpers/test-helper')
const fs = require('fs')

describe('AI', () => {
	describe('ai:ask', () => {
		const expectedRequestBody = {
			items: [
				{
					id: '12345',
					type: 'file',
					content: 'one,two,three',
				},
			],
			mode: 'single_item_qa',
			prompt: 'What is the status of this document?',
		}
		const expectedResponseBody = {
			answer: 'This document is currently in progress and being actively worked on.',
			created_at: '2024-07-09T11:29:46.835Z',
			completion_reason: 'done',
		}
		const fixture = getFixture('ai/post_ai_ask_response')
		const yamlFixture = getFixture('ai/post_ai_ask_response_yaml.txt')

		test
			.nock(TEST_API_ROOT, (api) => api.post('/2.0/ai/ask', expectedRequestBody).reply(200, expectedResponseBody))
			.stdout()
			.command([
				'ai:ask',
				'--items=content=one,two,three,id=12345,type=file',
				'--prompt',
				'What is the status of this document?',
				'--json',
				'--token=test',
			])
			.it('should send the correct request and output the response (JSON Output)', (ctx) => {
				assert.equal(ctx.stdout, fixture)
			})

		test
			.nock(TEST_API_ROOT, (api) => api.post('/2.0/ai/ask', expectedRequestBody).reply(200, expectedResponseBody))
			.stdout()
			.command([
				'ai:ask',
				'--items=content=one,two,three,id=12345,type=file',
				'--prompt',
				'What is the status of this document?',
				'--token=test',
			])
			.it('should send the correct request and output the response (YAML Output)', (ctx) => {
				assert.equal(ctx.stdout, yamlFixture)
			})
	})

	describe('ai:text-gen', () => {
		const expectedRequestBody = {
			prompt: 'What is the status of this document?',
			items: [{id: '12345', type: 'file', content: 'one,two,three'}],
			dialogue_history: [
				{
					prompt: 'What is the status of this document, signatures?',
					answer: 'It is in review, waiting for signatures.',
					created_at: '2024-07-09T11:29:46+00:00',
				},
			],
		}
		const expectedResponseBody = {
			answer: 'The document is currently in review and awaiting approval.',
			created_at: '2024-07-09T11:29:46.835Z',
			completion_reason: 'done',
		}
		const fixture = getFixture('ai/post_ai_text_gen_response')
		const yamlFixture = getFixture('ai/post_ai_text_gen_response_yaml.txt')

		test
			.nock(TEST_API_ROOT, (api) => api.post('/2.0/ai/text_gen', expectedRequestBody).reply(200, expectedResponseBody))
			.stdout()
			.command([
				'ai:text-gen',
				'--dialogue-history',
				'prompt=What is the status of this document, signatures?,answer=It is in review, waiting for signatures.,created-at=2024-07-09T11:29:46.835Z',
				'--items=content=one,two,three,id=12345,type=file',
				'--prompt',
				'What is the status of this document?',
				'--json',
				'--token=test',
			])
			.it('should send the correct request and output the response (JSON Output)', (ctx) => {
				assert.equal(ctx.stdout, fixture)
			})

		test
			.nock(TEST_API_ROOT, (api) => api.post('/2.0/ai/text_gen', expectedRequestBody).reply(200, expectedResponseBody))
			.stdout()
			.command([
				'ai:text-gen',
				'--dialogue-history',
				'prompt=What is the status of this document, signatures?,answer=It is in review, waiting for signatures.,created-at=2024-07-09T11:29:46.835Z',
				'--items=content=one,two,three,id=12345,type=file',
				'--prompt',
				'What is the status of this document?',
				'--token=test',
			])
			.it('should send the correct request and output the response (YAML Output)', (ctx) => {
				assert.equal(ctx.stdout, yamlFixture)
			})
	})

	//test to check if ai:extract command is working
	describe('ai:extract', () => {
		const expectedRequestBody = {
			prompt: 'firstName, lastName, location, yearOfBirth, company',
			items: [
				{
					id: '12345',
					type: 'file',
					content: 'one,two,three',
				},
			],
		}
		const expectedResponseBody = {
            answer: '{"firstName": "John", "lastName": "Doe", "location": "San Francisco", "yearOfBirth": "1990", "company": "Box"}',
            created_at: '2024-07-09T11:29:46.835Z',
            completion_reason: 'done',
        };
		
		const fixture = getFixture('ai/post_ai_extract_response') //This is the response we are expecting from the server

		//Calling the test API
		test
			.nock(TEST_API_ROOT, (api) => {
				api.post('/2.0/ai/extract', expectedRequestBody).reply(200, expectedResponseBody)
			})
			.stdout()
			.command([
				'ai:extract',
				'--items=content=one,two,three,id=12345,type=file',
				'--prompt',
				'firstName, lastName, location, yearOfBirth, company',
				'--json',
				'--token=test',
			])
			
			.it('should send the correct request and output the response (JSON Output)', (ctx) => {
				fs.writeFileSync('test/commands/test_output.json', ctx.stdout)
				fs.writeFileSync('test/commands/expected_output.json', fixture)
				assert.equal(ctx.stdout, fixture);
			})
	})
})
