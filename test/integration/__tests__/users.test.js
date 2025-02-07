'use strict';

const { expect } = require('chai');
const { setupCLI, getAdminUserId } = require('../helpers/test-helper');

describe('Users Integration Tests', () => {
  let cli;
  let adminUserId;
  let testUser;

  before(async () => {
    cli = await setupCLI();
    adminUserId = getAdminUserId();
  });

  after(async () => {
    if (testUser) {
      await cli.users.delete(testUser.id);
    }
  });

  describe('User Operations', () => {
    it('should get user info', async () => {
      const user = await cli.users.get(adminUserId);
      expect(user.id).to.equal(adminUserId);
    });

    it('should create and delete user', async () => {
      testUser = await cli.users.create({
        name: 'Test User',
        login: `test-${Date.now()}@example.com`
      });
      expect(testUser.id).to.be.a('string');
      
      await cli.users.delete(testUser.id);
      testUser = null;
    });

    it('should manage email aliases', async () => {
      const alias = `alias-${Date.now()}@example.com`;
      const addedAlias = await cli.users.addEmailAlias(adminUserId, alias);
      expect(addedAlias.email).to.equal(alias);

      const aliases = await cli.users.getEmailAliases(adminUserId);
      expect(aliases).to.be.an('array');

      await cli.users.removeEmailAlias(adminUserId, addedAlias.id);
    });

    it('should list group memberships', async () => {
      const memberships = await cli.users.getGroupMemberships(adminUserId);
      expect(memberships).to.be.an('array');
    });
  });
});
