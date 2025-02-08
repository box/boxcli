'use strict';

const { expect } = require('chai');
const { execCLI, getAdminUserId, setupEnvironment, cleanupEnvironment } = require('../helpers/test-helper');

describe('Users Integration Tests', () => {
  let adminUserId;
  let testUser;

  beforeEach(async () => {
    adminUserId = getAdminUserId();
    await setupEnvironment();
  });

  after(async () => {
    try {
      if (testUser) {
        await execCLI(`users:delete ${testUser.id} --force`);
      }
    } finally {
      await cleanupEnvironment();
    }
  });

  describe('User Operations', () => {
    it('should get user info', async () => {
      const output = await execCLI(`users:get ${adminUserId} --json`);
      const user = JSON.parse(output);
      expect(user).to.be.an('object');
      expect(user.id).to.equal(adminUserId);
      expect(user.type).to.equal('user');
      expect(user.login).to.be.a('string');
      expect(user.name).to.be.a('string');
      expect(user.created_at).to.be.a('string');
      expect(user.modified_at).to.be.a('string');
    });

    it('should list group memberships', async () => {
      const output = await execCLI(`users:groups ${adminUserId} --json`);
      const memberships = JSON.parse(output);
      expect(memberships).to.be.an('array');
      memberships.forEach(membership => {
        expect(membership.type).to.equal('group_membership');
        expect(membership.user.id).to.equal(adminUserId);
        expect(membership.group).to.be.an('object');
      });
    });
  });
});
