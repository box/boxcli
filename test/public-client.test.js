'use strict';

const { assert } = require('chai');
const sinon = require('sinon');
const BoxTSSDK = require('box-node-sdk/sdk-gen');
const { createPublicClientTsClient } = require('../src/public-client');
const pkg = require('../package.json');

// Stands in for a BoxCommand: only _configureTsSdk is used.
function createCommand() {
	return { _configureTsSdk: sinon.stub().callsFake((client) => client) };
}

describe('createPublicClientTsClient', function () {
	it('builds a TS client that authenticates with the public client auth', function () {
		const tokenStorage = { get: sinon.stub(), store: sinon.stub() };

		const { auth, client } = createPublicClientTsClient(createCommand(), {
			clientId: 'public-client-id',
			tokenStorage,
		});

		assert.instanceOf(auth, BoxTSSDK.BoxPublicClientOAuth);
		assert.equal(auth.config.clientId, 'public-client-id');
		assert.strictEqual(auth.tokenStorage, tokenStorage);
		assert.instanceOf(client, BoxTSSDK.BoxClient);
		assert.strictEqual(client.auth, auth);
	});

	it('configures the client with the CLI settings and User-Agent, using a fresh config each time', function () {
		const command = createCommand();

		createPublicClientTsClient(command, { clientId: 'public-client-id' });
		createPublicClientTsClient(command, { clientId: 'public-client-id' });

		const [firstConfig, secondConfig] = command._configureTsSdk.args.map(
			(args) => args[1]
		);
		assert.deepEqual(firstConfig.request.headers, {
			'User-Agent': `Box CLI v${pkg.version}`,
		});
		// _configureTsSdk adds headers to the config it gets, so calls must not share one
		assert.notStrictEqual(
			firstConfig.request.headers,
			secondConfig.request.headers
		);
	});
});
