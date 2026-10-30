'use strict';

const { test } = require('@oclif/test');
const { assert } = require('chai');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const BoxCommand = require('../../src/box-command');

const FIXED_PRINCIPAL_MESSAGE =
	"is not supported for Platform Account environments. Commands always run as the Platform Account from the environment's config file.";

function createPlatformAccountConfig({
	userID = '33333',
	enterpriseID = '11111',
	privateKey = '-----BEGIN ENCRYPTED PRIVATE KEY-----\nkey\n-----END ENCRYPTED PRIVATE KEY-----\n',
} = {}) {
	return {
		boxAppSettings: {
			clientID: 'platform-account-client-id',
			clientSecret: 'platform-account-client-secret',
			appAuth: {
				publicKeyID: 'platform-account-key-id',
				...(privateKey ? { privateKey } : {}),
				passphrase: 'platform-account-passphrase',
			},
		},
		...(enterpriseID ? { enterpriseID } : {}),
		...(userID ? { userID } : {}),
	};
}

function platformAccountEnvironment(overrides = {}) {
	return {
		name: 'agent',
		authMethod: 'platformAccount',
		clientId: 'platform-account-client-id',
		enterpriseId: '11111',
		userId: '33333',
		boxConfigFilePath: '/path/to/config.json',
		hasInLinePrivateKey: true,
		privateKeyPath: null,
		defaultAsUserId: null,
		useDefaultAsUser: false,
		cacheTokens: true,
		...overrides,
	};
}

describe('Configure Platform Account environments', function () {
	// Files are created while the suite is defined, because oclif test chains
	// evaluate command arguments before mocha hooks run.
	const tempDirectory = fs.mkdtempSync(
		path.join(os.tmpdir(), 'boxcli-platform-account-env-')
	);
	const writeConfig = (name, config) => {
		const filePath = path.join(tempDirectory, name);
		fs.writeFileSync(filePath, JSON.stringify(config));
		return filePath;
	};
	const configPath = writeConfig(
		'config.json',
		createPlatformAccountConfig()
	);
	const configWithoutEnterprisePath = writeConfig(
		'config_without_enterprise.json',
		createPlatformAccountConfig({ enterpriseID: null })
	);
	const configWithoutUserPath = writeConfig(
		'config_without_user.json',
		createPlatformAccountConfig({ userID: null })
	);
	const configWithoutKeyPath = writeConfig(
		'config_without_key.json',
		createPlatformAccountConfig({ privateKey: null })
	);
	const updatedConfigPath = writeConfig(
		'updated_config.json',
		createPlatformAccountConfig({ userID: '55555', enterpriseID: null })
	);
	const privateKeyPath = path.join(tempDirectory, 'private_key.pem');
	fs.writeFileSync(privateKeyPath, 'private key');

	let environments;
	let savedEnvironments;

	function environmentTest() {
		return test
			.stub(BoxCommand.prototype, 'getEnvironments', (stub) =>
				stub.callsFake(() => Promise.resolve(environments))
			)
			.stub(BoxCommand.prototype, 'updateEnvironments', (stub) =>
				stub.callsFake((updatedEnvironments) => {
					savedEnvironments = updatedEnvironments;
					return Promise.resolve();
				})
			);
	}

	after(function () {
		fs.rmSync(tempDirectory, { recursive: true, force: true });
	});

	beforeEach(function () {
		// A non-empty store, so CLI setup does not write a default (empty) environments config
		environments = {
			default: null,
			environments: { jwt: { name: 'jwt' } },
		};
		savedEnvironments = undefined;
	});

	describe('configure:environments:add --platform-account-auth', function () {
		environmentTest()
			.stderr()
			.command([
				'configure:environments:add',
				configPath,
				'--platform-account-auth',
				'--name=agent',
			])
			.it(
				'should store a Platform Account environment as the default',
				(context) => {
					assert.include(
						context.stderr,
						'Successfully added CLI environment "agent"'
					);
					assert.equal(savedEnvironments.default, 'agent');
					assert.deepEqual(
						savedEnvironments.environments.agent,
						platformAccountEnvironment({
							boxConfigFilePath: configPath,
						})
					);
				}
			);

		environmentTest()
			.stderr()
			.command([
				'configure:environments:add',
				configWithoutEnterprisePath,
				'--platform-account-auth',
				'--name=agent',
			])
			.it(
				'should not require an enterprise ID, since authentication uses the Platform Account user ID',
				() => {
					assert.isNull(
						savedEnvironments.environments.agent.enterpriseId
					);
					assert.equal(
						savedEnvironments.environments.agent.userId,
						'33333'
					);
				}
			);

		environmentTest()
			.stderr()
			.command([
				'configure:environments:add',
				configWithoutKeyPath,
				'--platform-account-auth',
				'--name=agent',
				`--private-key-path=${privateKeyPath}`,
			])
			.it('should accept the private key from a separate file', () => {
				const environment = savedEnvironments.environments.agent;
				assert.isFalse(environment.hasInLinePrivateKey);
				assert.equal(environment.privateKeyPath, privateKeyPath);
			});

		environmentTest()
			.stderr()
			.command([
				'configure:environments:add',
				configWithoutUserPath,
				'--platform-account-auth',
				'--name=agent',
				'--no-color',
			])
			.it(
				'should reject a config file without the Platform Account user ID',
				(context) => {
					assert.include(
						context.stderr,
						'Config object missing key userID'
					);
					assert.isUndefined(savedEnvironments);
				}
			);

		environmentTest()
			.stderr()
			.command([
				'configure:environments:add',
				configWithoutKeyPath,
				'--platform-account-auth',
				'--name=agent',
				'--no-color',
			])
			.it(
				'should reject a config file without a private key when no private key path is given',
				(context) => {
					assert.include(
						context.stderr,
						'Your environment does not have a private key'
					);
					assert.isUndefined(savedEnvironments);
				}
			);

		environmentTest()
			.stderr()
			.command([
				'configure:environments:add',
				configPath,
				'--platform-account-auth',
				'--ccg-auth',
				'--no-color',
			])
			.it(
				'should not combine Platform Account and CCG auth',
				(context) => {
					assert.include(
						context.stderr,
						'--ccg-auth=true cannot also be provided when using --platform-account-auth'
					);
					assert.isUndefined(savedEnvironments);
				}
			);
	});

	describe('configure:environments:switch-user', function () {
		environmentTest()
			.do(() => {
				environments = {
					default: 'agent',
					environments: { agent: platformAccountEnvironment() },
				};
			})
			.stderr()
			.command([
				'configure:environments:switch-user',
				'44444',
				'--no-color',
			])
			.it(
				'should reject switching the user of a Platform Account environment',
				(context) => {
					assert.include(
						context.stderr,
						`Switching users ${FIXED_PRINCIPAL_MESSAGE}`
					);
					assert.isUndefined(savedEnvironments);
				}
			);

		environmentTest()
			.do(() => {
				environments = {
					default: 'agent',
					environments: {
						agent: platformAccountEnvironment({
							useDefaultAsUser: true,
							defaultAsUserId: '44444',
						}),
					},
				};
			})
			.stderr()
			.command(['configure:environments:switch-user', '--default'])
			.it(
				'should allow switching back to the Platform Account itself',
				() => {
					assert.isFalse(
						savedEnvironments.environments.agent.useDefaultAsUser
					);
				}
			);
	});

	describe('configure:environments:update', function () {
		environmentTest()
			.do(() => {
				environments = {
					default: 'agent',
					environments: { agent: platformAccountEnvironment() },
				};
			})
			.stderr()
			.command([
				'configure:environments:update',
				'--user-id=44444',
				'--no-color',
			])
			.it(
				'should reject setting a default As-User for a Platform Account environment',
				(context) => {
					assert.include(
						context.stderr,
						`The --user-id flag ${FIXED_PRINCIPAL_MESSAGE}`
					);
					assert.isUndefined(savedEnvironments);
				}
			);

		environmentTest()
			.do(() => {
				environments = {
					default: 'agent',
					environments: { agent: platformAccountEnvironment() },
				};
			})
			.stdout()
			.command([
				'configure:environments:update',
				`--config-file-path=${updatedConfigPath}`,
			])
			.it(
				'should validate a new config file as a Platform Account config and refresh the stored IDs',
				() => {
					const environment = savedEnvironments.environments.agent;
					assert.equal(
						environment.boxConfigFilePath,
						updatedConfigPath
					);
					assert.equal(environment.userId, '55555');
					assert.isNull(environment.enterpriseId);
				}
			);

		environmentTest()
			.do(() => {
				environments = {
					default: 'agent',
					environments: { agent: platformAccountEnvironment() },
				};
			})
			.stderr()
			.command([
				'configure:environments:update',
				`--config-file-path=${configWithoutUserPath}`,
				'--no-color',
			])
			.it(
				'should reject a new config file without the Platform Account user ID',
				(context) => {
					assert.include(
						context.stderr,
						'Config object missing key userID'
					);
					assert.isUndefined(savedEnvironments);
				}
			);
	});
});
