'use strict';

const { assert } = require('chai');
const sinon = require('sinon');

describe('SecureStorage', function () {
	const sandbox = sinon.createSandbox();
	let secureStorage;

	afterEach(function () {
		sandbox.verifyAndRestore();
		delete require.cache[require.resolve('../src/secure-storage')];
	});

	describe('on macOS (darwin)', function () {
		let keychainStub;

		beforeEach(function () {
			if (process.platform !== 'darwin') {
				this.skip();
			}
			secureStorage = require('../src/secure-storage');
		});

		it('should use keychain backend on macOS', function () {
			assert.equal(secureStorage.backend, 'keychain');
			assert.isTrue(secureStorage.available);
		});

		it('getPassword should delegate to keychain module', async function () {
			const kc = require('keychain');
			const stub = sandbox
				.stub(kc, 'getPassword')
				.callsFake((opts, fn) => fn(null, 'stored-value'));

			const password = await secureStorage.getPassword('boxcli', 'Box');

			assert.equal(password, 'stored-value');
			assert.isTrue(stub.calledOnce);
			assert.deepEqual(stub.firstCall.args[0], {
				account: 'Box',
				service: 'boxcli',
			});
		});

		it('getPassword should return null when not found', async function () {
			const kc = require('keychain');
			sandbox
				.stub(kc, 'getPassword')
				.callsFake((opts, fn) => fn(new Error('not found'), null));

			const password = await secureStorage.getPassword('boxcli', 'Box');

			assert.isNull(password);
		});

		it('setPassword should delegate to keychain module', async function () {
			const kc = require('keychain');
			const stub = sandbox
				.stub(kc, 'setPassword')
				.callsFake((opts, fn) => fn(null));

			await secureStorage.setPassword('boxcli', 'Box', 'secret');

			assert.isTrue(stub.calledOnce);
			assert.deepEqual(stub.firstCall.args[0], {
				account: 'Box',
				service: 'boxcli',
				password: 'secret',
			});
		});

		it('deletePassword should delegate to keychain module', async function () {
			const kc = require('keychain');
			const stub = sandbox
				.stub(kc, 'deletePassword')
				.callsFake((opts, fn) => fn(null));

			const result = await secureStorage.deletePassword('boxcli', 'Box');

			assert.isTrue(result);
			assert.isTrue(stub.calledOnce);
			assert.deepEqual(stub.firstCall.args[0], {
				account: 'Box',
				service: 'boxcli',
			});
		});

		it('deletePassword should return false when not found', async function () {
			const kc = require('keychain');
			sandbox
				.stub(kc, 'deletePassword')
				.callsFake((opts, fn) =>
					fn(new Error('Could not find password'))
				);

			const result = await secureStorage.deletePassword('boxcli', 'Box');

			assert.isFalse(result);
		});
	});

	describe('availability checks', function () {
		it('should report available=true on supported platform with backend', function () {
			secureStorage = require('../src/secure-storage');
			if (secureStorage.backend) {
				assert.isTrue(secureStorage.available);
			}
		});

		it('getPassword should return null when not available', async function () {
			secureStorage = require('../src/secure-storage');
			const storageInstance = Object.create(secureStorage);
			storageInstance.available = false;

			const password = await storageInstance.getPassword(
				'boxcli',
				'Box'
			);
			assert.isNull(password);
		});

		it('setPassword should throw when not available', async function () {
			secureStorage = require('../src/secure-storage');
			const storageInstance = Object.create(secureStorage);
			storageInstance.available = false;

			try {
				await storageInstance.setPassword('boxcli', 'Box', 'secret');
				assert.fail('Should have thrown');
			} catch (error) {
				assert.include(error.message, 'not available');
			}
		});

		it('deletePassword should return false when not available', async function () {
			secureStorage = require('../src/secure-storage');
			const storageInstance = Object.create(secureStorage);
			storageInstance.available = false;

			const result = await storageInstance.deletePassword(
				'boxcli',
				'Box'
			);
			assert.isFalse(result);
		});
	});
});
