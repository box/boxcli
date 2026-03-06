'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');

const CLITokenCache = require('../src/token-cache');
const utilities = require('../src/util');

describe('CLITokenCache', function() {
	const testEnvName = 'test-environment';
	const testTokenInfo = {
		accessToken: 'test-access-token',
		accessTokenTTLMS: 3_600_000,
		refreshToken: 'test-refresh-token',
		acquiredAtMS: Date.now(),
	};
	const testFilePath = path.join(
		os.homedir(),
		'.box',
		`${testEnvName}_token_cache.json`
	);

	let tokenCache;
	let keytarStub;

	beforeEach(function() {
		tokenCache = new CLITokenCache(testEnvName);
	});

	afterEach(function() {
		// Clean up any test files
		if (fs.existsSync(testFilePath)) {
			try {
				fs.unlinkSync(testFilePath);
			} catch {
				// Ignore cleanup errors
			}
		}

		// Restore stubs
		if (keytarStub) {
			keytarStub.restore();
		}
	});

	describe('constructor', function() {
		it('should initialize with environment name', function() {
			expect(tokenCache.environmentName).to.equal(testEnvName);
		});

		it('should set correct file path', function() {
			expect(tokenCache.filePath).to.equal(testFilePath);
		});

		it('should set correct keytar service name', function() {
			expect(tokenCache.keytarService).to.equal(`boxcli-token-${testEnvName}`);
		});

		it('should set keytar account name', function() {
			expect(tokenCache.keytarAccount).to.equal('Box');
		});

		it('should detect secure storage support on supported platforms', function() {
			const supportedPlatforms = ['darwin', 'win32', 'linux'];
			const isSupported = supportedPlatforms.includes(process.platform);
			expect(tokenCache.supportsSecureStorage).to.equal(isSupported);
		});
	});

	describe('read() - File-based storage', function() {
		it('should read token from file when secure storage not available', function(done) {
			// Create a test token file
			const boxDir = path.join(os.homedir(), '.box');
			if (!fs.existsSync(boxDir)) {
				fs.mkdirSync(boxDir, { recursive: true });
			}
			fs.writeFileSync(testFilePath, JSON.stringify(testTokenInfo), 'utf8');

			// Create cache instance with secure storage disabled
			const cacheWithoutSecure = new CLITokenCache(testEnvName);
			cacheWithoutSecure.supportsSecureStorage = false;

			cacheWithoutSecure.read((error, tokenInfo) => {
				expect(error).to.be.null;
				expect(tokenInfo.accessToken).to.equal(testTokenInfo.accessToken);
				expect(tokenInfo.refreshToken).to.equal(testTokenInfo.refreshToken);
				done();
			});
		});

		it('should return empty object when file does not exist', function(done) {
			const cacheWithoutSecure = new CLITokenCache('nonexistent-env');
			cacheWithoutSecure.supportsSecureStorage = false;

			cacheWithoutSecure.read((error, tokenInfo) => {
				expect(error).to.be.null;
				expect(tokenInfo).to.be.an('object');
				expect(tokenInfo.accessToken).to.be.undefined;
				done();
			});
		});

		it('should handle invalid JSON in file gracefully', function(done) {
			const boxDir = path.join(os.homedir(), '.box');
			if (!fs.existsSync(boxDir)) {
				fs.mkdirSync(boxDir, { recursive: true });
			}
			fs.writeFileSync(testFilePath, 'invalid json', 'utf8');

			const cacheWithoutSecure = new CLITokenCache(testEnvName);
			cacheWithoutSecure.supportsSecureStorage = false;

			cacheWithoutSecure.read((error, tokenInfo) => {
				expect(error).to.be.null;
				expect(tokenInfo).to.be.an('object');
				expect(tokenInfo.accessToken).to.be.undefined;
				done();
			});
		});
	});

	describe('write() - File-based storage', function() {
		it('should write token to file when secure storage not available', function(done) {
			const cacheWithoutSecure = new CLITokenCache(testEnvName);
			cacheWithoutSecure.supportsSecureStorage = false;

			cacheWithoutSecure.write(testTokenInfo, (error) => {
				expect(error).to.be.undefined;
				expect(fs.existsSync(testFilePath)).to.be.true;

				const fileContent = fs.readFileSync(testFilePath, 'utf8');
				const savedToken = JSON.parse(fileContent);
				expect(savedToken.accessToken).to.equal(testTokenInfo.accessToken);
				done();
			});
		});

		it('should format JSON with proper indentation', function(done) {
			const cacheWithoutSecure = new CLITokenCache(testEnvName);
			cacheWithoutSecure.supportsSecureStorage = false;

			cacheWithoutSecure.write(testTokenInfo, (error) => {
				expect(error).to.be.undefined;

				const fileContent = fs.readFileSync(testFilePath, 'utf8');
				expect(fileContent).to.include('\n    ');
				done();
			});
		});
	});

	describe('clear()', function() {
		it('should delete token file', function(done) {
			const cacheWithoutSecure = new CLITokenCache(testEnvName);
			cacheWithoutSecure.supportsSecureStorage = false;

			// First write a token
			cacheWithoutSecure.write(testTokenInfo, () => {
				expect(fs.existsSync(testFilePath)).to.be.true;

				// Then clear it
				cacheWithoutSecure.clear((error) => {
					expect(error).to.be.undefined;
					expect(fs.existsSync(testFilePath)).to.be.false;
					done();
				});
			});
		});

		it('should not error when file does not exist', function(done) {
			const cacheWithoutSecure = new CLITokenCache('nonexistent-env');
			cacheWithoutSecure.supportsSecureStorage = false;

			cacheWithoutSecure.clear((error) => {
				expect(error).to.be.undefined;
				done();
			});
		});
	});

	describe('store() - TS SDK compatible', function() {
		it('should store token in promise-based interface', async function() {
			const cacheWithoutSecure = new CLITokenCache(testEnvName);
			cacheWithoutSecure.supportsSecureStorage = false;

			const tsToken = {
				accessToken: 'ts-access-token',
				expiresIn: 3600,
				refreshToken: 'ts-refresh-token',
			};

			await cacheWithoutSecure.store(tsToken);

			const fileContent = fs.readFileSync(testFilePath, 'utf8');
			const savedToken = JSON.parse(fileContent);
			expect(savedToken.accessToken).to.equal('ts-access-token');
			expect(savedToken.refreshToken).to.equal('ts-refresh-token');
			expect(savedToken.accessTokenTTLMS).to.equal(3_600_000);
			expect(savedToken.acquiredAtMS).to.be.a('number');
		});
	});

	describe('get() - TS SDK compatible', function() {
		it('should get token in promise-based interface', async function() {
			const cacheWithoutSecure = new CLITokenCache(testEnvName);
			cacheWithoutSecure.supportsSecureStorage = false;

			// First write a token
			await cacheWithoutSecure.store({
				accessToken: 'ts-access-token',
				expiresIn: 3600,
				refreshToken: 'ts-refresh-token',
			});

			// Then get it
			const tokenInfo = await cacheWithoutSecure.get();
			expect(tokenInfo).to.not.be.undefined;
			expect(tokenInfo.accessToken).to.equal('ts-access-token');
		});

		it('should return undefined when no token exists', async function() {
			const cacheWithoutSecure = new CLITokenCache('nonexistent-env');
			cacheWithoutSecure.supportsSecureStorage = false;

			const tokenInfo = await cacheWithoutSecure.get();
			expect(tokenInfo).to.be.undefined;
		});
	});

	describe('Secure Storage - Backward Compatibility', function() {
		it('should read existing file-based token when secure storage is empty', function (done) {
			if (!tokenCache.supportsSecureStorage) {
				this.skip();
			}

			// Create a file-based token (simulating old version)
			const boxDir = path.join(os.homedir(), '.box');
			if (!fs.existsSync(boxDir)) {
				fs.mkdirSync(boxDir, { recursive: true });
			}
			fs.writeFileSync(testFilePath, JSON.stringify(testTokenInfo), 'utf8');

			tokenCache.read((error, tokenInfo) => {
				expect(error).to.be.null;
				expect(tokenInfo.accessToken).to.equal(testTokenInfo.accessToken);
				expect(fs.existsSync(testFilePath)).to.be.true; // File not deleted on read
				done();
			});
		});

		it('should migrate file-based token to secure storage on write', function (done) {
			if (!tokenCache.supportsSecureStorage) {
				this.skip();
			}

			// Create a file-based token
			const boxDir = path.join(os.homedir(), '.box');
			if (!fs.existsSync(boxDir)) {
				fs.mkdirSync(boxDir, { recursive: true });
			}
			fs.writeFileSync(testFilePath, JSON.stringify(testTokenInfo), 'utf8');
			expect(fs.existsSync(testFilePath)).to.be.true;

			// Write a new token (should migrate)
			const newToken = { ...testTokenInfo, accessToken: 'new-token' };
			tokenCache.write(newToken, (error) => {
				expect(error).to.be.undefined;

				// File should be deleted after migration
				setTimeout(() => {
					expect(fs.existsSync(testFilePath)).to.be.false;
					done();
				}, 100);
			});
		});
	});

	describe('Multiple Environments', function() {
		it('should isolate tokens between different environments', function(done) {
			const env1Cache = new CLITokenCache('env-1');
			const env2Cache = new CLITokenCache('env-2');

			env1Cache.supportsSecureStorage = false;
			env2Cache.supportsSecureStorage = false;

			const token1 = { ...testTokenInfo, accessToken: 'token-for-env-1' };
			const token2 = { ...testTokenInfo, accessToken: 'token-for-env-2' };

			// Write tokens for both environments
			env1Cache.write(token1, () => {
				env2Cache.write(token2, () => {
					// Read them back
					env1Cache.read((error1, tokenInfo1) => {
						env2Cache.read((error2, tokenInfo2) => {
							expect(tokenInfo1.accessToken).to.equal('token-for-env-1');
							expect(tokenInfo2.accessToken).to.equal('token-for-env-2');

							// Clean up
							env1Cache.clear(() => {
								env2Cache.clear(() => {
									done();
								});
							});
						});
					});
				});
			});
		});

		it('should use different keytar service names for different environments', function() {
			const env1Cache = new CLITokenCache('production');
			const env2Cache = new CLITokenCache('development');

			expect(env1Cache.keytarService).to.equal('boxcli-token-production');
			expect(env2Cache.keytarService).to.equal('boxcli-token-development');
		});
	});

	describe('Error Handling', function() {
		it('should ignore missing token file when clearing', function(done) {
			const cacheWithoutSecure = new CLITokenCache('missing-file-env');
			cacheWithoutSecure.supportsSecureStorage = false;

			const unlinkStub = sinon.stub(utilities, 'unlinkAsync').rejects(
				Object.assign(new Error('No such file or directory'), {
					code: 'ENOENT',
				})
			);

			cacheWithoutSecure.clear((error) => {
				expect(error).to.be.undefined;
				unlinkStub.restore();
				done();
			});
		});

		it('should report file deletion failures when clearing', function(done) {
			const cacheWithoutSecure = new CLITokenCache('delete-failure-env');
			cacheWithoutSecure.supportsSecureStorage = false;

			const unlinkStub = sinon.stub(utilities, 'unlinkAsync').rejects(
				Object.assign(new Error('Permission denied'), {
					code: 'EACCES',
				})
			);

			cacheWithoutSecure.clear((error) => {
				expect(error).to.exist;
				expect(error.message).to.equal('Failed to delete token cache');
				expect(error.cause).to.exist;
				expect(error.cause.message).to.equal(
					'Failed to delete token file'
				);
				unlinkStub.restore();
				done();
			});
		});

		it('should report secure storage deletion failures when clearing', function(done) {
			if (!tokenCache.supportsSecureStorage) {
				this.skip();
			}

			const unlinkStub = sinon.stub(utilities, 'unlinkAsync').resolves();
			const keytar = require('keytar');
			const deletePasswordStub = sinon
				.stub(keytar, 'deletePassword')
				.rejects(Object.assign(new Error('Permission denied'), { code: 'EACCES' }));

			tokenCache.clear((error) => {
				expect(error).to.exist;
				expect(error.message).to.equal('Failed to delete token cache');
				expect(error.cause).to.exist;
				expect(error.cause.message).to.equal(
					'Failed to delete token from secure storage'
				);
				deletePasswordStub.restore();
				unlinkStub.restore();
				done();
			});
		});

		it('should fallback to file storage if secure storage write fails', function (done) {
			if (!tokenCache.supportsSecureStorage) {
				this.skip();
			}

			// Mock keytar to simulate failure
			const keytar = require('keytar');
			const setPasswordStub = sinon
				.stub(keytar, 'setPassword')
				.rejects(new Error('Secure storage unavailable'));

			tokenCache.write(testTokenInfo, (error) => {
				expect(error).to.be.undefined;
				// Should fallback to file
				expect(fs.existsSync(testFilePath)).to.be.true;

				setPasswordStub.restore();
				done();
			});
		});

		it('should fallback to file storage if secure storage read fails', function (done) {
			if (!tokenCache.supportsSecureStorage) {
				this.skip();
			}

			// Create a file-based token
			const boxDir = path.join(os.homedir(), '.box');
			if (!fs.existsSync(boxDir)) {
				fs.mkdirSync(boxDir, { recursive: true });
			}
			fs.writeFileSync(testFilePath, JSON.stringify(testTokenInfo), 'utf8');

			// Mock keytar to simulate failure
			const keytar = require('keytar');
			const getPasswordStub = sinon
				.stub(keytar, 'getPassword')
				.rejects(new Error('Secure storage unavailable'));

			tokenCache.read((error, tokenInfo) => {
				expect(error).to.be.null;
				expect(tokenInfo.accessToken).to.equal(testTokenInfo.accessToken);

				getPasswordStub.restore();
				done();
			});
		});
	});
});
