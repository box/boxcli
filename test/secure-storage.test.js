'use strict';

const { assert } = require('chai');
const sinon = require('sinon');
const fs = require('node:fs');
const path = require('node:path');

describe('ensureKeytarBinary', function () {
	const keytarDir = path.dirname(
		require.resolve('@github/keytar/package.json')
	);
	const releaseDir = path.join(keytarDir, 'build', 'Release');
	const targetBinary = path.join(releaseDir, 'keytar.node');
	const prebuildDir = path.join(
		keytarDir,
		'prebuilds',
		`${process.platform}-${process.arch}`
	);
	const sourceBinary = path.join(prebuildDir, 'keytar.node');

	beforeEach(function () {
		delete require.cache[require.resolve('../src/secure-storage')];
	});

	afterEach(function () {
		delete require.cache[require.resolve('../src/secure-storage')];
	});

	it('should copy prebuild to build/Release when binary is missing', function () {
		if (!fs.existsSync(sourceBinary)) {
			this.skip();
		}

		// Remove build/Release to simulate shipped state
		if (fs.existsSync(releaseDir)) {
			fs.rmSync(releaseDir, { recursive: true });
		}
		assert.isFalse(fs.existsSync(targetBinary));

		// Re-require triggers ensureKeytarBinary
		require('../src/secure-storage');

		assert.isTrue(fs.existsSync(targetBinary));

		// Verify it's the same content as the prebuild
		const source = fs.readFileSync(sourceBinary);
		const target = fs.readFileSync(targetBinary);
		assert.isTrue(source.equals(target));
	});

	it('should not overwrite existing build/Release binary', function () {
		if (!fs.existsSync(sourceBinary)) {
			this.skip();
		}

		// Ensure build/Release exists with a known file
		fs.mkdirSync(releaseDir, { recursive: true });
		fs.writeFileSync(targetBinary, 'existing-binary');

		require('../src/secure-storage');

		const content = fs.readFileSync(targetBinary, 'utf8');
		assert.equal(content, 'existing-binary');

		// Restore the real binary
		fs.copyFileSync(sourceBinary, targetBinary);
	});

	it('should not throw when prebuilds directory is missing', function () {
		const fakePrebuildDir = path.join(keytarDir, 'prebuilds', 'fake-os-fake-arch');

		// This just verifies the function doesn't crash — it's a no-op
		assert.isFalse(fs.existsSync(fakePrebuildDir));
		assert.doesNotThrow(() => require('../src/secure-storage'));
	});
});

describe('SecureStorage', function () {
	const sandbox = sinon.createSandbox();
	let secureStorage;

	afterEach(function () {
		sandbox.verifyAndRestore();
		delete require.cache[require.resolve('../src/secure-storage')];
	});

	describe('on macOS (darwin)', function () {
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
			sandbox.stub(secureStorage, 'available').value(false);

			const password = await secureStorage.getPassword('boxcli', 'Box');
			assert.isNull(password);
		});

		it('setPassword should throw when not available', async function () {
			secureStorage = require('../src/secure-storage');
			sandbox.stub(secureStorage, 'available').value(false);

			try {
				await secureStorage.setPassword('boxcli', 'Box', 'secret');
				assert.fail('Should have thrown');
			} catch (error) {
				assert.include(error.message, 'not available');
			}
		});

		it('deletePassword should return false when not available', async function () {
			secureStorage = require('../src/secure-storage');
			sandbox.stub(secureStorage, 'available').value(false);

			const result = await secureStorage.deletePassword('boxcli', 'Box');
			assert.isFalse(result);
		});
	});
});
