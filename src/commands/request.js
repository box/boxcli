'use strict';

const BoxCommand = require('../box-command');
const { Flags, Args } = require('@oclif/core');
const querystring = require('querystring');

class ManualRequestCommand extends BoxCommand {
	async run() {
		const { flags, args } = await this.parse(ManualRequestCommand);

		let url = args.resource;
		let params = {};

		try {
			params.qs = JSON.parse(flags.query);
		} catch (ex) {
			params.qs = querystring.parse(flags.query);
		}

		if (flags.hasOwnProperty('body') && flags.body !== '') {
			try {
				params.body = JSON.parse(flags.body);
				params.json = true;
			} catch (ex) {
				params.body = flags.body;
				params.headers = { 'Content-Type': 'application/octet-stream' };
			}
		}

		// Split the array of headers into an object like {header: value, header2: value2}
		if (flags.header) {
			params.headers = flags.header
				.map((h) => h.split(/:\s*/u))
				.reduce((o, kv) => ({ ...o, [kv[0]]: kv[1] }), {});
		}

		let response;

		switch (flags.method) {
			case 'GET':
				response = await this.client.get(url, params);
				break;
			case 'POST':
				response = await this.client.post(url, params);
				break;
			case 'PUT':
				response = await this.client.put(url, params);
				break;
			case 'DELETE':
				response = await this.client.del(url, params);
				break;
			case 'OPTIONS':
				response = await this.client.options(url, params);
				break;
			default:
				this.error(`Invalid method: ${flags.method}`);
		}

		await this.output({
			statusCode: response.statusCode,
			headers: response.headers,
			body: response.body,
		});
	}
}

ManualRequestCommand.description = 'Manually specify a Box API request';

ManualRequestCommand.flags = {
	...BoxCommand.flags,
	method: Flags.string({
		description: 'The HTTP method for the request',
		options: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
		default: 'GET',
		char: 'X',
	}),
	query: Flags.string({
		description:
			'Query params to use for the request, either as k1=v1&k2=v2 or as JSON',
		default: '',
	}),
	body: Flags.string({
		description: 'Body of the request',
		default: '',
	}),
	header: Flags.string({
		description: 'HTTP header to add to the request, e.g. "Header: value"',
		multiple: true,
		char: 'H',
	}),
};

ManualRequestCommand.args = {
	resource: Args.string({
		name: 'resource',
		required: true,
		hidden: false,
		description:
			'The Box API resource to make a request against, e.g. /search or https://api.box.com/2.0/search',
	}),
};

module.exports = ManualRequestCommand;
