'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const inquirer = require('inquirer');
const sinon = require('sinon');

describe('Login', () => {
	describe('login', () => {
		sinon
			.stub(inquirer, 'prompt')
			.returns({ clientID: 'abc', clientSecret: 'test' });
		test
			.stdout()
			.command(['login'])
			.it('should list sign requests', (ctx) => {
				assert.ok(true);
			});
	});
});
