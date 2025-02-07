'use strict';

const { execSync } = require('child_process');
const path = require('path');

const CLI_PATH = path.resolve(__dirname, '../../../bin/run');

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

const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

const setupEnvironment = async () => {
  const jwtConfig = getJWTConfig();
  const configPath = '/tmp/jwt-config.json';
  const boxConfigDir = `${process.env.HOME}/.box`;
  
  // Ensure Box config directory exists with correct permissions
  const fs = require('fs').promises;
  await fs.access(boxConfigDir).catch(async () => {
    await fs.mkdir(boxConfigDir, { mode: 0o700 });
  });
  
  try {
    // Write config to temp file for CLI command
    await fs.writeFile(configPath, JSON.stringify(jwtConfig), { mode: 0o600 });
    
    // Clean up any existing environment first
    try {
      await exec(`${CLI_PATH} configure:environments:delete integration-test`);
    } catch (error) {
      // Environment might not exist, ignore error
    }
    
    // Add new environment and set as current
    await exec(`${CLI_PATH} configure:environments:add ${configPath} --name=integration-test`);
    await exec(`${CLI_PATH} configure:environments:set-current integration-test`);
    
    // Verify environment is set up by running a simple command
    const { stdout } = await exec(`${CLI_PATH} users:get ${getAdminUserId()} --json`);
    const user = JSON.parse(stdout);
    if (!user.id || user.id !== getAdminUserId()) {
      throw new Error('Failed to set up environment');
    }
  } catch (error) {
    console.error('Error setting up environment:', error);
    throw error;
  }
};

const cleanupEnvironment = () => {
  try {
    execSync(`${CLI_PATH} configure:environments:delete integration-test`);
  } catch (error) {
    // Environment might not exist, ignore error
  }
};

const execCLI = (command) => {
  return execSync(`${CLI_PATH} ${command}`).toString();
};

module.exports = {
  getJWTConfig,
  getAdminUserId,
  execCLI,
  setupEnvironment,
  cleanupEnvironment
};
