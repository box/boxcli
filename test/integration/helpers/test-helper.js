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

const setupEnvironment = async () => {
  const jwtConfig = getJWTConfig();
  const configPath = '/tmp/jwt-config.json';
  const boxConfigDir = `${process.env.HOME}/.box`;
  
  // Ensure Box config directory exists with correct permissions
  if (!require('fs').existsSync(boxConfigDir)) {
    require('fs').mkdirSync(boxConfigDir, { mode: 0o700 });
  }
  
  try {
    // Write config to temp file for CLI command
    require('fs').writeFileSync(configPath, JSON.stringify(jwtConfig), { mode: 0o600 });
    
    // Clean up any existing environment first
    try {
      execSync(`${CLI_PATH} configure:environments:delete integration-test`);
    } catch (error) {
      // Environment might not exist, ignore error
    }
    
    // Add new environment and set as current
    execSync(`${CLI_PATH} configure:environments:add ${configPath} --name=integration-test`);
    execSync(`${CLI_PATH} configure:environments:set-current integration-test`);
    
    // Verify environment is set up by running a simple command
    const testOutput = execSync(`${CLI_PATH} users:get ${getAdminUserId()} --json`).toString();
    const user = JSON.parse(testOutput);
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
