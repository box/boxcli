'use strict';

const fs = require('node:fs');
const _ = require('lodash');
const BoxTSSDK = require('box-node-sdk/sdk-gen');
const BoxCLIError = require('./cli-error');
const CLITokenCache = require('./token-cache');
const DEBUG = require('./debug');

const PLATFORM_ACCOUNT_AUTH_METHOD = 'platformAccount';

const REQUIRED_PLATFORM_ACCOUNT_CONFIG_VALUES = Object.freeze([
	'boxAppSettings.clientID',
	'boxAppSettings.clientSecret',
	'boxAppSettings.appAuth.publicKeyID',
	'boxAppSettings.appAuth.passphrase',
	'userID',
]);

/**
 * Check whether a CLI environment authenticates as a Platform Account
 *
 * @param {Object} [environment] A CLI environment
 * @returns {boolean} True for Platform Account environments
 */
function isPlatformAccountEnvironment(environment) {
	return environment?.authMethod === PLATFORM_ACCOUNT_AUTH_METHOD;
}

/**
 * Ensure a Platform Account config file contains the values needed to authenticate.
 * The private key is validated separately, since it can also come from a separate file.
 *
 * @param {Object} configObj Parsed Platform Account config file
 * @returns {void}
 * @throws {BoxCLIError} If a required value is missing
 */
function validatePlatformAccountConfig(configObj) {
	const checkProp = _.propertyOf(configObj);
	const missingProp = REQUIRED_PLATFORM_ACCOUNT_CONFIG_VALUES.find(
		(key) => !checkProp(key)
	);
	if (missingProp) {
		throw new BoxCLIError(`Config object missing key ${missingProp}`);
	}
}

/**
 * Error for operations that would act as someone other than the Platform Account.
 * Platform Account environments are bound to one principal, so every action is attributable to it.
 *
 * @param {string} operation Description of the rejected operation, e.g. "The --as-user flag"
 * @returns {BoxCLIError} The error to throw
 */
function createFixedPrincipalError(operation) {
	return new BoxCLIError(
		`${operation} is not supported for Platform Account environments. Commands always run as the Platform Account from the environment's config file.`
	);
}

/**
 * Error for token exchange (downscoping), which Platform Accounts do not support.
 *
 * @returns {BoxCLIError} The error to throw
 */
function createTokenExchangeNotSupportedError() {
	return new BoxCLIError(
		'Token exchange and downscoping are not supported for Platform Account environments'
	);
}

/**
 * Reject options that would make a Platform Account environment act as another user.
 *
 * @param {Object} options Options
 * @param {string} options.environmentName Name of the current environment
 * @param {Object} options.environment The current environment
 * @param {string} [options.asUser] Value of the --as-user flag
 * @returns {void}
 * @throws {BoxCLIError} If an As-User is requested or configured
 */
function assertPlatformAccountPrincipalIsFixed({
	environmentName,
	environment,
	asUser,
}) {
	if (asUser) {
		throw createFixedPrincipalError('The --as-user flag');
	}
	if (environment.useDefaultAsUser) {
		throw new BoxCLIError(
			`Environment "${environmentName}" has a default As-User set, which is not supported for Platform Account environments. Run "box configure:environments:switch-user --default" to remove it.`
		);
	}
}

/**
 * Read and validate the Platform Account config file, including the private
 * key stored in a separate file when the environment uses one.
 * The file is validated on every use, since it can change after the environment was added.
 *
 * @param {Object} environment The current environment
 * @returns {Object} Parsed config file
 * @throws {BoxCLIError} If a file cannot be read or the config is missing a required value
 */
function readPlatformAccountConfig(environment) {
	const configFilePath = environment.boxConfigFilePath;
	let configObj;
	try {
		configObj = JSON.parse(fs.readFileSync(configFilePath));
	} catch (error) {
		throw new BoxCLIError(
			`Could not read Platform Account config file ${configFilePath}`,
			error
		);
	}

	try {
		validatePlatformAccountConfig(configObj);
	} catch (error) {
		throw new BoxCLIError(
			`Invalid Platform Account config file ${configFilePath}: ${error.message}`
		);
	}

	if (!environment.hasInLinePrivateKey) {
		try {
			configObj.boxAppSettings.appAuth.privateKey = fs.readFileSync(
				environment.privateKeyPath,
				'utf8'
			);
			DEBUG.init(
				'Loaded Platform Account private key from %s',
				environment.privateKeyPath
			);
		} catch (error) {
			throw new BoxCLIError(
				`Could not read private key file ${environment.privateKeyPath}`,
				error
			);
		}
	}

	if (!configObj.boxAppSettings.appAuth.privateKey) {
		throw new BoxCLIError(
			`Invalid Platform Account config file ${configFilePath}: Config object missing key boxAppSettings.appAuth.privateKey. Add the private key to the config file, or set a private key file with "box configure:environments:update --private-key-path <path>".`
		);
	}
	return configObj;
}

/**
 * Build the generated SDK Platform Account auth for an environment.
 * Tokens are cached in the CLI token cache unless the environment disables token caching.
 *
 * @param {string} environmentName Name of the environment
 * @param {Object} environment The environment
 * @returns {BoxTSSDK.BoxPlatformAccountAuth} The Platform Account auth
 * @throws {BoxCLIError} If the config file cannot be read or is invalid
 */
function createPlatformAccountAuth(environmentName, environment) {
	const configObj = readPlatformAccountConfig(environment);
	const tokenStorage =
		environment.cacheTokens === false
			? undefined
			: new CLITokenCache(environmentName);
	let config;
	try {
		config = BoxTSSDK.PlatformAccountConfig.fromConfigJsonString(
			JSON.stringify(configObj),
			tokenStorage
		);
	} catch (error) {
		throw new BoxCLIError(
			`Invalid Platform Account config file ${environment.boxConfigFilePath}`,
			error
		);
	}
	return new BoxTSSDK.BoxPlatformAccountAuth({ config });
}

module.exports = {
	PLATFORM_ACCOUNT_AUTH_METHOD,
	isPlatformAccountEnvironment,
	validatePlatformAccountConfig,
	createFixedPrincipalError,
	createTokenExchangeNotSupportedError,
	assertPlatformAccountPrincipalIsFixed,
	readPlatformAccountConfig,
	createPlatformAccountAuth,
};
