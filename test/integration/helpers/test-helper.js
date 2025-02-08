'use strict';

const path = require('path');
const fs = require('fs').promises;
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const CLI_PATH = path.resolve(__dirname, '../../../bin/run');
const TIMEOUT = 30000; // 30 second timeout for operations

const getJWTConfig = () => {
  const config = process.env.BOX_JWT_CONFIG;
  if (!config) {
    throw new Error('Missing BOX_JWT_CONFIG environment variable');
  }
  return JSON.parse(Buffer.from(config, 'base64').toString());
};

const getAdminUserId = () => {
  const userId = process.env.BOX_ADMIN_USER_ID;
  if (!userId) {
    throw new Error('Missing BOX_ADMIN_USER_ID environment variable');
  }
  return userId;
};

async function execWithTimeout(command, timeoutMs = TIMEOUT) {
  const timeoutError = new Error(`Command timed out after ${timeoutMs}ms: ${command}`);
  const timeoutPromise = new Promise(resolve => {
    setTimeout(() => resolve(timeoutError), timeoutMs);
  });

  try {
    const result = await Promise.race([exec(command), timeoutPromise]);
    if (result === timeoutError) {
      throw timeoutError;
    }
    return result;
  } catch (error) {
    throw error;
  }
}

const setupEnvironment = async() => {
  const startTime = Date.now();
  const logWithTime = (msg) => {
    const elapsed = Date.now() - startTime;
    console.log(`[${elapsed}ms] ${msg}`);
  };

  logWithTime('Setting up test environment...');
  const jwtConfig = getJWTConfig();
  logWithTime('JWT config loaded');
  const configPath = '/tmp/jwt-config.json';
  const boxConfigDir = `${process.env.HOME}/.box`;

  try {
    // Create Box config directory if it doesn't exist
    logWithTime('Creating Box config directory...');
    try {
      await fs.access(boxConfigDir);
    } catch {
      await fs.mkdir(boxConfigDir, { mode: 0o700 });
    }

    // Write JWT config
    logWithTime('Writing JWT config file...');
    await fs.writeFile(configPath, JSON.stringify(jwtConfig), { mode: 0o600 });

    // Clean up existing environment with shorter timeout
    logWithTime('Cleaning up existing environment...');
    try {
      await execWithTimeout(`${CLI_PATH} configure:environments:delete integration-test`, 10000);
      logWithTime('Existing environment deleted');
    } catch (error) {
      logWithTime('No existing environment to delete');
    }

    // Add new environment with shorter timeout
    logWithTime('Adding new environment...');
    const { stdout: addOutput } = await execWithTimeout(
      `${CLI_PATH} configure:environments:add ${configPath} --name=integration-test`,
      15000
    );
    logWithTime('Add environment output: ' + addOutput);

    // Set current environment with shorter timeout
    logWithTime('Setting current environment...');
    const setProcess = require('child_process').spawn(
      CLI_PATH,
      ['configure:environments:set-current', 'integration-test'],
      { stdio: ['pipe', 'pipe', 'pipe'] }
    );

    let resolved = false;
    const timeoutId = setTimeout(() => {
      if (!resolved) {
        setProcess.kill();
        throw new Error('Environment selection timed out after 15s');
      }
    }, 15000);

    // Handle environment selection with immediate response
    setProcess.stdout.on('data', (data) => {
      const output = data.toString();
      logWithTime('Environment selection output: ' + output);
      if (output.includes('Which environment?')) {
        logWithTime('Selecting environment...');
        setProcess.stdin.write('\n');
      }
    });

    // Wait for process to complete with proper cleanup
    const waitForProcess = async () => {
      const cleanup = () => {
        resolved = true;
        clearTimeout(timeoutId);
        setProcess.removeAllListeners();
      };

      try {
        await new Promise((resolve, reject) => {
          setProcess.on('close', (code) => {
            cleanup();
            if (code === 0) {
              resolve();
            } else {
              reject(new Error(`Failed to set environment (exit code: ${code})`));
            }
          });

          setProcess.on('error', (error) => {
            cleanup();
            reject(error);
          });
        });
      } catch (error) {
        cleanup();
        throw error;
      }
    };

    await waitForProcess();
    logWithTime('Environment set successfully');

    // Verify environment setup with shorter timeout
    logWithTime('Verifying environment setup...');
    const { stdout } = await execWithTimeout(`${CLI_PATH} users:get ${getAdminUserId()} --json`, 15000);
    const user = JSON.parse(stdout);
    if (!user.id || user.id !== getAdminUserId()) {
      throw new Error('Failed to verify environment setup');
    }
    logWithTime('Environment verification complete');

  } catch (error) {
    console.error('Error setting up environment:', error);
    throw error;
  } finally {
    // Clean up config file
    try {
      await fs.unlink(configPath);
    } catch (error) {
      console.error('Error cleaning up config file:', error);
    }
  }
};

const cleanupEnvironment = async() => {
  try {
    await execWithTimeout(`${CLI_PATH} configure:environments:delete integration-test`);
    console.log('Environment cleanup complete');
  } catch (error) {
    console.error('Error cleaning up environment:', error);
  }
};

const execCLI = async(command) => {
  const { stdout } = await execWithTimeout(`${CLI_PATH} ${command}`);
  return stdout;
};

module.exports = {
  getJWTConfig,
  getAdminUserId,
  execCLI,
  setupEnvironment,
  cleanupEnvironment
};
