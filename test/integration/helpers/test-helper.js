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

const execWithTimeout = async(command, timeoutMs = TIMEOUT) => {
  return Promise.race([
    exec(command),
    new Promise((_, reject) => 
      setTimeout(() => reject(new Error(`Command timed out after ${timeoutMs}ms: ${command}`)), timeoutMs)
    )
  ]);
};

const setupEnvironment = async() => {
  console.log('Setting up test environment...');
  const jwtConfig = getJWTConfig();
  console.log('JWT config loaded');
  const configPath = '/tmp/jwt-config.json';
  const boxConfigDir = `${process.env.HOME}/.box`;

  try {
    // Create Box config directory if it doesn't exist
    console.log('Creating Box config directory...');
    try {
      await fs.access(boxConfigDir);
    } catch {
      await fs.mkdir(boxConfigDir, { mode: 0o700 });
    }

    // Write JWT config
    console.log('Writing JWT config file...');
    await fs.writeFile(configPath, JSON.stringify(jwtConfig), { mode: 0o600 });

    // Clean up existing environment
    console.log('Cleaning up existing environment...');
    try {
      await execWithTimeout(`${CLI_PATH} configure:environments:delete integration-test`);
      console.log('Existing environment deleted');
    } catch (error) {
      console.log('No existing environment to delete');
    }

    // Add new environment
    console.log('Adding new environment...');
    const { stdout: addOutput } = await execWithTimeout(
      `${CLI_PATH} configure:environments:add ${configPath} --name=integration-test`
    );
    console.log('Add environment output:', addOutput);

    // Set current environment with timeout
    console.log('Setting current environment...');
    const setProcess = require('child_process').spawn(
      CLI_PATH, 
      ['configure:environments:set-current', 'integration-test'],
      { stdio: ['pipe', 'pipe', 'pipe'] }
    );

    let resolved = false;
    const timeoutId = setTimeout(() => {
      if (!resolved) {
        setProcess.kill();
        throw new Error('Environment selection timed out');
      }
    }, TIMEOUT);

    // Handle environment selection
    setProcess.stdout.on('data', (data) => {
      console.log('Environment selection output:', data.toString());
      if (data.toString().includes('Which environment?')) {
        setProcess.stdin.write('\n');
      }
    });

    // Wait for process to complete
    await new Promise((resolve, reject) => {
      setProcess.on('close', (code) => {
        resolved = true;
        clearTimeout(timeoutId);
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Failed to set environment (exit code: ${code})`));
        }
      });

      setProcess.on('error', (error) => {
        resolved = true;
        clearTimeout(timeoutId);
        reject(error);
      });
    });
    console.log('Environment set successfully');

    // Verify environment setup
    console.log('Verifying environment setup...');
    const { stdout } = await execWithTimeout(`${CLI_PATH} users:get ${getAdminUserId()} --json`);
    const user = JSON.parse(stdout);
    if (!user.id || user.id !== getAdminUserId()) {
      throw new Error('Failed to verify environment setup');
    }
    console.log('Environment verification complete');

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
