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
      execCLI(`users:delete ${testUser.id} --force`);
    }
  });

  describe('User Operations', () => {
    it('should get user info', () => {
      const output = execCLI(`users:get ${adminUserId} --json`);
      const user = JSON.parse(output);
      expect(user.id).to.equal(adminUserId);
    });

    it('should create and delete user', () => {
      const name = 'Test User';
      const login = `test-${Date.now()}@example.com`;
      
      const output = execCLI(`users:create "${name}" "${login}" --json`);
      testUser = JSON.parse(output);
      expect(testUser.id).to.be.a('string');
      expect(testUser.name).to.equal(name);
      expect(testUser.login).to.equal(login);

      execCLI(`users:delete ${testUser.id} --force`);
      testUser = null;
    });

    it('should manage email aliases', () => {
      const alias = `alias-${Date.now()}@example.com`;
      
      const addOutput = execCLI(`users:email-aliases:add ${adminUserId} "${alias}" --json`);
      const addedAlias = JSON.parse(addOutput);
      expect(addedAlias.email).to.equal(alias);

      const listOutput = execCLI(`users:email-aliases ${adminUserId} --json`);
      const aliases = JSON.parse(listOutput);
      expect(aliases).to.be.an('array');

      execCLI(`users:email-aliases:remove ${adminUserId} ${addedAlias.id}`);
    });

    it('should list group memberships', () => {
      const output = execCLI(`users:groups ${adminUserId} --json`);
      const memberships = JSON.parse(output);
      expect(memberships).to.be.an('array');
    });
  });
});
