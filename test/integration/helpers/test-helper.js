'use strict';

const fs = require('fs');
const BoxCLI = require('../../../src/cli');

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

const setupCLI = async () => {
  const cli = new BoxCLI();
  await cli.configure({
    jwtConfig: getJWTConfig(),
    adminUserId: getAdminUserId()
  });
  return cli;
};

module.exports = {
  getJWTConfig,
  getAdminUserId,
  setupCLI
};
