'use strict';

const path = require('path');
const fs = require('fs').promises;
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

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



const setupEnvironment = async() => {
  console.log('Setting up test environment...');
  const jwtConfig = getJWTConfig();
  console.log('JWT config loaded');
  const configPath = '/tmp/jwt-config.json';
  const boxConfigDir = `${process.env.HOME}/.box`;
  console.log('Creating Box config directory...');

  try {
    await fs.access(boxConfigDir);
  } catch {
    await fs.mkdir(boxConfigDir, { mode: 0o700 });
  }

  try {
    console.log('Writing JWT config file...');
    await fs.writeFile(configPath, JSON.stringify(jwtConfig), { mode: 0o600 });

    console.log('Setting up Box environment...');
    try {
      console.log('Cleaning up existing environment...');
      await exec(`${CLI_PATH} configure:environments:delete integration-test`).catch(() => {});
      await new Promise(resolve => setTimeout(resolve, 1000)); // Wait for cleanup to complete

      console.log('Adding new environment...');
      const { stdout: addOutput } = await exec(`${CLI_PATH} configure:environments:add ${configPath} --name=integration-test`);
      console.log('Add environment output:', addOutput);

      console.log('Setting current environment...');
      const { stdout: setOutput } = await exec(`${CLI_PATH} configure:environments:set-current integration-test`);
      console.log('Set environment output:', setOutput);

    console.log('Verifying environment setup...');
    const { stdout } = await exec(`${CLI_PATH} users:get ${getAdminUserId()} --json`);
    const user = JSON.parse(stdout);
    console.log('Environment verification complete');
    if (!user.id || user.id !== getAdminUserId()) {
      throw new Error('Failed to set up environment');
    }
  } catch (error) {
    console.error('Error setting up environment:', error);
    throw error;
  }
};

const cleanupEnvironment = async() => {
  try {
    await exec(`${CLI_PATH} configure:environments:delete integration-test`);
    const configPath = '/tmp/jwt-config.json';
    await fs.unlink(configPath).catch(() => {});
  } catch (error) {
    console.error('Error cleaning up environment:', error);
  }
};

const execCLI = async(command) => {
  const { stdout } = await exec(`${CLI_PATH} ${command}`);
  return stdout;
};

module.exports = {
  getJWTConfig,
  getAdminUserId,
  execCLI,
  setupEnvironment,
  cleanupEnvironment
};
