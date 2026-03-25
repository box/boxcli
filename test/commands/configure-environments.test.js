'use strict';

const { test } = require('@oclif/test');
const { assert } = require('chai');
const sinon = require('sinon');
const BoxCommand = require('../../src/box-command');

describe('Configure environments masking', function () {
	let sandbox;
	let getEnvironmentsStub;
	let updateEnvironmentsStub;

	const RAW_SECRET = 'abcdefghijklmnopqrstuvwxyz123456';
	const MASKED_SECRET = `${'*'.repeat(RAW_SECRET.length - 3)}${RAW_SECRET.slice(-3)}`;

	beforeEach(function () {
		sandbox = sinon.createSandbox();
		getEnvironmentsStub = sandbox.stub(BoxCommand.prototype, 'getEnvironments');
		updateEnvironmentsStub = sandbox.stub(
			BoxCommand.prototype,
			'updateEnvironments'
		);
		updateEnvironmentsStub.resolves();
	});

	afterEach(function () {
		sandbox.restore();
	});

	it('configure:environments:get should not print raw client secrets', function () {
		getEnvironmentsStub.resolves({
			default: 'dev',
			environments: {
				dev: {
					name: 'dev',
					clientSecret: RAW_SECRET,
				},
			},
		});

		return test
			.stub(BoxCommand.prototype, 'getEnvironments', getEnvironmentsStub)
			.stdout()
			.command(['configure:environments:get'])
			.it('masks clientSecret in output', (ctx) => {
				assert.notInclude(ctx.stdout, RAW_SECRET);
				assert.include(ctx.stdout, MASKED_SECRET);
			});
	});

	it(
		'configure:environments:update should not print raw client secrets',
		function () {
			getEnvironmentsStub.resolves({
				default: 'dev',
				environments: {
					dev: {
						name: 'dev',
						clientSecret: RAW_SECRET,
					},
				},
			});

			return test
				.stub(BoxCommand.prototype, 'getEnvironments', getEnvironmentsStub)
				.stub(
					BoxCommand.prototype,
					'updateEnvironments',
					updateEnvironmentsStub
				)
				.stdout()
				.command(['configure:environments:update'])
				.it('masks clientSecret in output', (ctx) => {
					assert.notInclude(ctx.stdout, RAW_SECRET);
					assert.include(ctx.stdout, MASKED_SECRET);
				});
		}
	);
});
