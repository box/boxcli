'use strict';

const { expect } = require('chai');
const { execCLI, getAdminUserId, setupEnvironment, cleanupEnvironment, getJWTConfig } = require('../helpers/test-helper');

describe('Users Integration Tests', () => {
  let adminUserId;
  let testUser;
  let testUserEmail;

  beforeEach(async() => {
    adminUserId = getAdminUserId();
    testUserEmail = `test-user-${Date.now()}@boxdemo.com`;
    await setupEnvironment();
  });

  after(async() => {
    try {
      if (testUser) {
        await execCLI(`users:delete ${testUser.id} --force`);
      }
    } finally {
      await cleanupEnvironment();
    }
  });

  describe('User Lifecycle', () => {
    it('should create and delete a user', async() => {
      const createOutput = await execCLI(`users:create "${testUserEmail}" ${testUserEmail} --json`);
      testUser = JSON.parse(createOutput);
      expect(testUser).to.be.an('object');
      expect(testUser.login).to.equal(testUserEmail);
      expect(testUser.name).to.equal(testUserEmail);

      const deleteOutput = await execCLI(`users:delete ${testUser.id} --force --json`);
      expect(deleteOutput).to.include('Successfully deleted user');
      testUser = null;
    });

    it('should update user info', async() => {
      const createOutput = await execCLI(`users:create "${testUserEmail}" ${testUserEmail} --json`);
      testUser = JSON.parse(createOutput);

      const newName = 'Updated Name';
      const updateOutput = await execCLI(`users:update ${testUser.id} --name="${newName}" --json`);
      const updatedUser = JSON.parse(updateOutput);
      expect(updatedUser.name).to.equal(newName);
    });

    it('should manage email aliases', async() => {
      const createOutput = await execCLI(`users:create "${testUserEmail}" ${testUserEmail} --json`);
      testUser = JSON.parse(createOutput);

      const aliasEmail = `alias-${Date.now()}@boxdemo.com`;
      await execCLI(`users:email-aliases:add ${testUser.id} ${aliasEmail}`);

      const listOutput = await execCLI(`users:email-aliases ${testUser.id} --json`);
      const aliases = JSON.parse(listOutput);
      expect(aliases).to.be.an('array');
      expect(aliases.some(alias => alias.email === aliasEmail)).to.be.true;

      await execCLI(`users:email-aliases:remove ${testUser.id} ${aliasEmail}`);
      const updatedListOutput = await execCLI(`users:email-aliases ${testUser.id} --json`);
      const updatedAliases = JSON.parse(updatedListOutput);
      expect(updatedAliases.some(alias => alias.email === aliasEmail)).to.be.false;
    });
  });

  describe('User Operations', () => {
    it('should get user info', async() => {
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

    it('should list group memberships', async() => {
      const output = await execCLI(`users:groups ${adminUserId} --json`);
      const memberships = JSON.parse(output);
      expect(memberships).to.be.an('array');
      memberships.forEach(membership => {
        expect(membership.type).to.equal('group_membership');
        expect(membership.user.id).to.equal(adminUserId);
        expect(membership.group).to.be.an('object');
      });
    });

    it('should search users', async() => {
      const createOutput = await execCLI(`users:create "${testUserEmail}" ${testUserEmail} --json`);
      testUser = JSON.parse(createOutput);

      const searchOutput = await execCLI(`users:search ${testUserEmail} --json`);
      const searchResults = JSON.parse(searchOutput);
      expect(searchResults).to.be.an('array');
      expect(searchResults.some(user => user.id === testUser.id)).to.be.true;
    });

    it('should terminate user sessions', async() => {
      const createOutput = await execCLI(`users:create "${testUserEmail}" ${testUserEmail} --json`);
      testUser = JSON.parse(createOutput);

      const output = await execCLI(`users:terminate-session ${testUser.id}`);
      expect(output).to.include('Successfully terminated user sessions');
    });
  });

  describe('Content Transfer', () => {
    let sourceUser;
    let destinationUser;

    beforeEach(async() => {
      // Create source user
      const sourceEmail = `test-source-${Date.now()}@boxdemo.com`;
      const sourceOutput = await execCLI(`users:create "${sourceEmail}" ${sourceEmail} --json`);
      sourceUser = JSON.parse(sourceOutput);

      // Create destination user
      const destEmail = `test-dest-${Date.now()}@boxdemo.com`;
      const destOutput = await execCLI(`users:create "${destEmail}" ${destEmail} --json`);
      destinationUser = JSON.parse(destOutput);
    });

    afterEach(async() => {
      // Clean up test users
      if (sourceUser) {
        await execCLI(`users:delete ${sourceUser.id} --force`);
      }
      if (destinationUser) {
        await execCLI(`users:delete ${destinationUser.id} --force`);
      }
    });

    it('should transfer content between users', async() => {
      const output = await execCLI(`users:transfer-content ${sourceUser.id} ${destinationUser.id} --json`);
      const result = JSON.parse(output);
      expect(result.owned_by.id).to.equal(destinationUser.id);
      expect(result.type).to.equal('folder');
    });

    it('should transfer content with notify flag', async() => {
      const output = await execCLI(`users:transfer-content ${sourceUser.id} ${destinationUser.id} --notify --json`);
      const result = JSON.parse(output);
      expect(result.owned_by.id).to.equal(destinationUser.id);
      expect(result.type).to.equal('folder');
    });
  });

  describe('User Invitations', () => {
    let testEmail;
    let enterpriseId;

    beforeEach(() => {
      testEmail = `test-invite-${Date.now()}@boxdemo.com`;
      // Get enterprise ID from JWT config
      const jwtConfig = getJWTConfig();
      enterpriseId = jwtConfig.enterpriseID;
    });

    it('should invite a user to enterprise', async() => {
      const output = await execCLI(`users:invite ${testEmail} ${enterpriseId} --json`);
      const result = JSON.parse(output);
      expect(result.enterprise.id).to.equal(enterpriseId);
      expect(result.actionable_by.login).to.equal(testEmail);
      expect(result.status).to.equal('pending');
    });
  });
});
