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

const execCLI = (command) => {
  return execSync(`${CLI_PATH} ${command}`).toString();
};

module.exports = {
  getJWTConfig,
  getAdminUserId,
  execCLI
};
