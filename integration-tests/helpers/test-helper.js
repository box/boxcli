'use strict';

const path = require('path');
const fs = require('fs');
const { promisify } = require('util');
const util = require('util');
const { once } = require('events');
const os = require('os');
const exec = promisify(require('child_process').exec);
const { validateConfigObject } = require('../../src/util');
const darwinKeychain = require('keychain');
const darwinKeychainSetPassword = util.promisify(darwinKeychain.setPassword.bind(darwinKeychain));
const darwinKeychainGetPassword = util.promisify(darwinKeychain.getPassword.bind(darwinKeychain));
let keytar = null;
try {
  keytar = require('keytar');
} catch (ex) {
  // keytar cannot be imported because the library is not provided for this operating system / architecture
}

const CONFIG_FOLDER_PATH = path.join(os.homedir(), '.box');
const SETTINGS_FILE_PATH = path.join(CONFIG_FOLDER_PATH, 'settings.json');
const ENVIRONMENTS_FILE_PATH = path.join(CONFIG_FOLDER_PATH, 'box_environments.json');

const CLI_PATH = process.env.CI ? '/home/runner/work/boxcli/boxcli/bin/run' : path.resolve(__dirname, '../../bin/run');
const TIMEOUT = 60000; // 60 second timeout for operations

const getJWTConfig = () => {
  const config = process.env.BOX_JWT_CONFIG;
  if (!config) {
    throw new Error('Missing BOX_JWT_CONFIG environment variable');
  }
  const jwtConfig = JSON.parse(Buffer.from(config, 'base64').toString());
  
  // Validate JWT config
  const requiredFields = ['boxAppSettings', 'enterpriseID'];
  const requiredAppFields = ['clientID', 'clientSecret', 'appAuth'];
  const requiredAuthFields = ['publicKeyID', 'privateKey', 'passphrase'];

  if (!requiredFields.every(field => jwtConfig[field])) {
    throw new Error(`JWT config missing required fields: ${requiredFields.filter(f => !jwtConfig[f]).join(', ')}`);
  }
  if (!requiredAppFields.every(field => jwtConfig.boxAppSettings[field])) {
    throw new Error(`JWT config missing required app fields: ${requiredAppFields.filter(f => !jwtConfig.boxAppSettings[f]).join(', ')}`);
  }
  if (!requiredAuthFields.every(field => jwtConfig.boxAppSettings.appAuth[field])) {
    throw new Error(`JWT config missing required auth fields: ${requiredAuthFields.filter(f => !jwtConfig.boxAppSettings.appAuth[f]).join(', ')}`);
  }

  return jwtConfig;
};

const getAdminUserId = () => {
  const userId = process.env.BOX_ADMIN_USER_ID;
  if (!userId) {
    throw new Error('Missing BOX_ADMIN_USER_ID environment variable');
  }
  return userId;
};

async function execWithTimeout(command, timeoutMs = TIMEOUT) {
  try {
    const { stdout, stderr } = await exec(command, { timeout: timeoutMs });
    if (stderr && !stderr.includes('DeprecationWarning')) {
      throw new Error(`Command failed with stderr: ${stderr}`);
    }
    return { stdout: stdout || '' };
  } catch (error) {
    if (error.code === 'ETIMEDOUT') {
      throw new Error(`Command timed out after ${timeoutMs}ms: ${command}`);
    }
    if (error.stderr && !error.stderr.includes('DeprecationWarning')) {
      throw new Error(`Command failed: ${error.stderr}`);
    }
    throw error;
  }
}

const setupEnvironment = async () => {
  const startTime = Date.now();
  const logWithTime = (msg) => {
    const elapsed = Date.now() - startTime;
    console.log(`[${elapsed}ms] ${msg}`);
  };

  logWithTime('Setting up test environment...');
  const jwtConfig = getJWTConfig();
  validateConfigObject(jwtConfig);
  logWithTime('JWT config loaded and validated');

  try {
    // Clean up any existing environment first
    logWithTime('Cleaning up existing environment...');
    try {
      const { stdout, stderr } = await exec(`${CLI_PATH} configure:environments:delete integration-test`, { timeout: 30000 });
      logWithTime('Existing environment deleted');
    } catch (error) {
      // Ignore errors about non-existent environments
      if (!error.stderr?.includes('environment does not exist')) {
        throw error;
      }
      logWithTime('No existing environment to delete');
    }

    // Remove existing config directory and files
    if (fs.existsSync(CONFIG_FOLDER_PATH)) {
      fs.rmSync(CONFIG_FOLDER_PATH, { recursive: true, force: true });
    }

    // Create fresh config directory
    fs.mkdirSync(CONFIG_FOLDER_PATH, { recursive: true });
    fs.chmodSync(CONFIG_FOLDER_PATH, 0o700);

    // Write settings and environment configuration
    logWithTime('Writing configuration files...');
    const settings = {
      cacheTokens: true,
      boxReportsFolderPath: '/tmp/box-reports',
      boxDownloadsFolderPath: '/tmp/box-downloads'
    };

    // Write JWT config file
    const configFilePath = path.join(CONFIG_FOLDER_PATH, 'jwt-config.json');
    const configJson = {
      boxAppSettings: {
        clientID: jwtConfig.boxAppSettings.clientID,
        clientSecret: jwtConfig.boxAppSettings.clientSecret,
        appAuth: {
          publicKeyID: jwtConfig.boxAppSettings.appAuth.publicKeyID,
          privateKey: jwtConfig.boxAppSettings.appAuth.privateKey,
          passphrase: jwtConfig.boxAppSettings.appAuth.passphrase
        }
      },
      enterpriseID: jwtConfig.enterpriseID
    };
    fs.writeFileSync(configFilePath, JSON.stringify(configJson, null, 2));
    fs.chmodSync(configFilePath, 0o600);
    logWithTime(`JWT config written to: ${configFilePath}`);

    const environmentConfig = {
      name: 'integration-test',
      defaultAsUserId: null,
      useDefaultAsUser: false,
      cacheTokens: true,
      authMethod: 'jwt',
      boxConfigFilePath: configFilePath,
      hasInLinePrivateKey: true,
      privateKeyPath: null,
      enterpriseID: jwtConfig.enterpriseID
    };

    const environments = {
      default: 'integration-test',
      environments: {
        'integration-test': environmentConfig
      }
    };

    // Write settings file
    const settingsJson = JSON.stringify(settings, null, 2);
    fs.writeFileSync(SETTINGS_FILE_PATH, settingsJson);
    fs.chmodSync(SETTINGS_FILE_PATH, 0o600);
    logWithTime(`Settings file written: ${settingsJson}`);

    // Write environment config
    const environmentsJson = JSON.stringify(environments, null, 2);

    // Write to keychain on macOS/Windows
    switch (process.platform) {
      case 'darwin': {
        try {
          await darwinKeychainSetPassword({
            account: 'Box',
            service: 'boxcli',
            password: environmentsJson,
          });
          logWithTime('Environment config written to keychain');
        } catch (error) {
          logWithTime(`Failed to write to keychain: ${error.message}`);
        }
        break;
      }

      case 'win32': {
        try {
          if (keytar) {
            await keytar.setPassword(
              'boxcli',
              'Box',
              environmentsJson
            );
            logWithTime('Environment config written to keychain');
          }
        } catch (error) {
          logWithTime(`Failed to write to keychain: ${error.message}`);
        }
        break;
      }

      default:
    }

    // Always write to file system as fallback
    fs.writeFileSync(ENVIRONMENTS_FILE_PATH, environmentsJson);
    fs.chmodSync(ENVIRONMENTS_FILE_PATH, 0o600);
    logWithTime(`Environment config written to file: ${environmentsJson}`);

    // Verify environment config was written correctly
    const writtenConfig = JSON.parse(fs.readFileSync(ENVIRONMENTS_FILE_PATH, 'utf8'));
    if (!writtenConfig.environments || !writtenConfig.environments['integration-test']) {
      throw new Error('Failed to write environment configuration');
    }

    // Set environment variables that BoxCLI uses
    process.env.BOX_ENVIRONMENT = 'integration-test';
    logWithTime(`Configuration files written to ${CONFIG_FOLDER_PATH}`);

    // Verify files exist and are readable
    logWithTime('Verifying configuration files...');
    const settingsContent = fs.readFileSync(SETTINGS_FILE_PATH, 'utf8');
    const environmentsContent = fs.readFileSync(ENVIRONMENTS_FILE_PATH, 'utf8');
    logWithTime(`Settings file content: ${settingsContent}`);
    logWithTime(`Environments file content: ${environmentsContent}`);

    // Verify environment by trying to use it
    logWithTime('Verifying environment by getting user info...');
    let retries = 3;
    let lastError;
    while (retries > 0) {
      try {
        const output = await execCLI(`users:get ${getAdminUserId()} --json`);
        const user = JSON.parse(output);
        if (!user.id || user.id !== getAdminUserId()) {
          throw new Error('Failed to verify user info');
        }
        logWithTime('Environment verified successfully');
        break;
      } catch (error) {
        lastError = error;
        retries--;
        if (retries > 0) {
          logWithTime(`Verification failed, retrying... (${retries} attempts left): ${error.message}`);
          await new Promise(resolve => setTimeout(resolve, 5000));
        }
      }
    }

    if (retries === 0) {
      throw new Error(`Failed to verify environment after multiple attempts: ${lastError.message}`);
    }
    logWithTime('Environment verification complete');
  } catch (error) {
    logWithTime(`Error in environment setup: ${error.message}`);
    throw error;
  }
};

const cleanupEnvironment = async () => {
  try {
    await execWithTimeout(`${CLI_PATH} configure:environments:delete integration-test`);
    console.log('Environment cleanup complete');
  } catch (error) {
    console.error('Error cleaning up environment:', error);
  }
};

const execCLI = async (command) => {
  try {
    const { stdout, stderr } = await exec(`${CLI_PATH} ${command}`, { timeout: TIMEOUT });
    if (stderr && !stderr.includes('DeprecationWarning')) {
      throw new Error(`Command failed: ${stderr}`);
    }
    if (!stdout) {
      throw new Error('Command produced no output');
    }
    return stdout.trim();
  } catch (error) {
    if (error.stderr && !error.stderr.includes('DeprecationWarning')) {
      throw new Error(`Command failed: ${error.stderr}`);
    }
    throw error;
  }
};

module.exports = {
  getJWTConfig,
  getAdminUserId,
  execCLI,
  setupEnvironment,
  cleanupEnvironment
};
