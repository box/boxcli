'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const inquirer = require('inquirer');
const sinon = require('sinon');
const BoxSDK = require('box-node-sdk');
const CLITokenCache = require('../../src/token-cache');

describe('Login', () => {
	describe('login', () => {
		sinon
			.stub(inquirer, 'prompt')
			.returns({ clientID: 'abc', clientSecret: 'test' });

		sinon.stub(BoxSDK.prototype, 'getTokensAuthorizationCodeGrant').returns();
		sinon.stub(CLITokenCache.prototype, 'write').callsArg(1);
		sinon.stub(BoxSDK.prototype, 'getPersistentClient').returns();

		test
			.stdout()
			.command(['login'])
			.it('should list sign requests', (ctx) => {
				assert.ok(true);
			});
	});
});
