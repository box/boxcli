'use strict';

const { expect } = require('chai');
const { execCLI, getAdminUserId } = require('../helpers/test-helper');

describe('Users Integration Tests', () => {
  let adminUserId;
  let testUser;

  before(() => {
    adminUserId = getAdminUserId();
  });

  after(async () => {
    if (testUser) {
      execCLI(`users:delete ${testUser.id} --force --token=test`);
    }
  });

  describe('User Operations', () => {
    it('should get user info', () => {
      const output = execCLI(`users:get ${adminUserId} --json --token=test`);
      const user = JSON.parse(output);
      expect(user.id).to.equal(adminUserId);
    });

    it('should create and delete user', () => {
      const name = 'Test User';
      const login = `test-${Date.now()}@example.com`;
      
      const output = execCLI(`users:create "${name}" "${login}" --json --token=test`);
      testUser = JSON.parse(output);
      expect(testUser.id).to.be.a('string');
      expect(testUser.name).to.equal(name);
      expect(testUser.login).to.equal(login);

      execCLI(`users:delete ${testUser.id} --force --token=test`);
      testUser = null;
    });

    it('should manage email aliases', () => {
      const alias = `alias-${Date.now()}@example.com`;
      
      const addOutput = execCLI(`users:email-aliases:add ${adminUserId} "${alias}" --json --token=test`);
      const addedAlias = JSON.parse(addOutput);
      expect(addedAlias.email).to.equal(alias);

      const listOutput = execCLI(`users:email-aliases ${adminUserId} --json --token=test`);
      const aliases = JSON.parse(listOutput);
      expect(aliases).to.be.an('array');

      execCLI(`users:email-aliases:remove ${adminUserId} ${addedAlias.id} --token=test`);
    });

    it('should list group memberships', () => {
      const output = execCLI(`users:groups ${adminUserId} --json --token=test`);
      const memberships = JSON.parse(output);
      expect(memberships).to.be.an('array');
    });
  });
});
