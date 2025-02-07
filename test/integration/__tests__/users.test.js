'use strict';

const { expect } = require('chai');
const { execCLI, getAdminUserId, setupEnvironment, cleanupEnvironment } = require('../helpers/test-helper');

describe('Users Integration Tests', function() {
  this.timeout(60000);
  let adminUserId;
  let testUser;

  beforeEach(async() => {
    adminUserId = getAdminUserId();
    await setupEnvironment();
  });

  after(() => {
    cleanupEnvironment();
  });

  after(() => {
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

    it('should get user info', () => {
      const output = execCLI(`users:get ${adminUserId} --json`);
      const user = JSON.parse(output);
      expect(user.id).to.equal(adminUserId);
      expect(user.type).to.equal('user');
      expect(user.login).to.be.a('string');
      expect(user.name).to.be.a('string');
    });

    it('should list group memberships', () => {
      const output = execCLI(`users:groups ${adminUserId} --json`);
      const memberships = JSON.parse(output);
      expect(memberships).to.be.an('array');
      memberships.forEach(membership => {
        expect(membership.type).to.equal('group_membership');
        expect(membership.user.id).to.equal(adminUserId);
        expect(membership.group).to.be.an('object');
      });
    });

    it('should list group memberships', () => {
      const output = execCLI(`users:groups ${adminUserId} --json`);
      const memberships = JSON.parse(output);
      expect(memberships).to.be.an('array');
    });
  });
});
