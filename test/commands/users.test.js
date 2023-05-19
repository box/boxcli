'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const leche = require('leche');
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('os');

describe('Users', () => {

	leche.withData([
		'users:email-aliases:add',
		'users:add-email-alias'
	], function(command) {

		describe(command, () => {
			let userId = '1234',
				email = 'testuser@example.com',
				fixture = getFixture('users/post_users_id_email_aliases'),
				yamlOutput = getFixture('output/users_add_email_alias_yaml.txt');

			let expectedBody = {
				email,
				is_confirmed: false
			};

			test
				.nock(TEST_API_ROOT, api => api
					.post(`/2.0/users/${userId}/email_aliases`, expectedBody)
					.reply(201, fixture)
				)
				.stdout()
				.command([
					command,
					userId,
					email,
					'--json',
					'--token=test'
				])
				.it('should add a new email alias to a user (JSON Output)', ctx => {
					assert.equal(ctx.stdout, fixture);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.post(`/2.0/users/${userId}/email_aliases`, expectedBody)
					.reply(201, fixture)
				)
				.stdout()
				.command([
					command,
					userId,
					email,
					'--token=test'
				])
				.it('should add a new email alias to a user (YAML Output)', ctx => {
					assert.equal(ctx.stdout, yamlOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.post(`/2.0/users/${userId}/email_aliases`, {
						...expectedBody,
						is_confirmed: true,
					})
					.reply(201, fixture)
				)
				.stdout()
				.command([
					command,
					userId,
					email,
					'--confirm',
					'--json',
					'--token=test'
				])
				.it('should auto-confirm email alias when --confirm flag is passed', ctx => {
					assert.equal(ctx.stdout, fixture);
				});
		});
	});

	leche.withData([
		'users:email-aliases',
		'users:get-email-aliases'
	], function(command) {

		describe(command, () => {
			let userId = '1234',
				fixture = getFixture('users/get_users_id_email_aliases'),
				jsonOutput = getFixture('output/users_get_email_aliases_json.txt'),
				tableOutput = getFixture('output/users_get_email_aliases_table.txt');

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/users/${userId}/email_aliases`)
					.reply(200, fixture)
				)
				.stdout()
				.command([
					command,
					userId,
					'--json',
					'--token=test'
				])
				.it('should get all Email Aliases for a User (JSON Output)', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/users/${userId}/email_aliases`)
					.reply(200, fixture)
				)
				.stdout()
				.command([
					command,
					userId,
					'--token=test'
				])
				.it('should get all Email Aliases for a User (Table Output)', ctx => {
					assert.equal(ctx.stdout, tableOutput);
				});
		});
	});

	leche.withData([
		'users:email-aliases:remove',
		'users:delete-email-alias'
	], function(command) {

		describe(command, () => {
			let userId = '1234',
				aliasId = '7777';

			test
				.nock(TEST_API_ROOT, api => api
					.delete(`/2.0/users/${userId}/email_aliases/${aliasId}`)
					.reply(204)
				)
				.stderr()
				.command([
					command,
					userId,
					aliasId,
					'--token=test'
				])
				.it('should delete an email alias from a user', ctx => {
					assert.equal(ctx.stderr, `Removed alias ${aliasId} from user ${userId}${os.EOL}`);
				});
		});
	});

	describe('users:get', () => {
		let userId = '33333',
			fixture = getFixture('users/get_users_id'),
			yamlOutput = getFixture('output/users_get_yaml.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/users/${userId}`)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'users:get',
				userId,
				'--json',
				'--token=test'
			])
			.it('should get information about a Box user (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/users/${userId}`)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'users:get',
				userId,
				'--token=test'
			])
			.it('should get information about a Box user (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/users/${userId}`)
				.query({fields: 'name,address'})
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'users:get',
				userId,
				'--fields=name,address',
				'--token=test'
			])
			.it('should send fields param to the API when --fields flag is passed');
	});

	leche.withData([
		'users',
		'users:list'
	], function(command) {

		describe(command, () => {
			let fixture = getFixture('users/get_users_page_1'),
				fixture2 = getFixture('users/get_users_page_2'),
				jsonOutput = getFixture('output/users_list_json.txt');

			test
				.nock(TEST_API_ROOT, api => api
					.get('/2.0/users')
					.query({ filter_term: 'AppUser_', usemarker: true, limit: 1000 })
					.reply(200, fixture)
					.get('/2.0/users')
					.query({
						filter_term: 'AppUser_',
						offset: 3,
						usemarker: true,
						limit: 1000,
					})
					.reply(200, fixture2)
				)
				.stdout()
				.command([
					command,
					'--app-users',
					'--json',
					'--token=test'
				])
				.it('should list all Box users with the app-users flag passed (JSON Output)', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.get('/2.0/users')
					.query({fields: 'name,address', usemarker: true, limit: 1000})
					.reply(200, fixture)
					.get('/2.0/users')
					.query({
						fields: 'name,address',
						offset: 3,
						usemarker: true,
						limit: 1000
					})
					.reply(200, fixture2)
				)
				.stdout()
				.command([
					command,
					'--fields=name,address',
					'--json',
					'--token=test'
				])
				.it('should send fields param to the API when --fields flag is passed');
		});
	});

	leche.withData([
		'users:groups',
		'users:list-groups'
	], function(command) {

		describe(command, () => {
			let userId = '13130406',
				fixture = getFixture('users/get_users_id_memberships_page_1'),
				fixture2 = getFixture('users/get_users_id_memberships_page_2'),
				jsonOutput = getFixture('output/users_list_groups_json.txt');

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/users/${userId}/memberships`)
					.query({limit: 1000})
					.reply(200, fixture)
					.get(`/2.0/users/${userId}/memberships`)
					.query({
						offset: 1,
						limit: 1000
					})
					.reply(200, fixture2)
				)
				.stdout()
				.command([
					command,
					userId,
					'--json',
					'--token=test'
				])
				.it('should list groups a user belongs to (JSON Output)', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/users/${userId}/memberships`)
					.query({fields: 'name', limit: 1000})
					.reply(200, fixture)
					.get(`/2.0/users/${userId}/memberships`)
					.query({
						fields: 'name',
						offset: 1,
						limit: 1000
					})
					.reply(200, fixture2)
				)
				.stdout()
				.command([
					command,
					userId,
					'--fields=name',
					'--json',
					'--token=test'
				])
				.it('should send fields param to the API when --fields flag is passed');
		});
	});

	describe('users:search', () => {
		let userName = 'roger federer',
			fixture = getFixture('users/get_users_page_1'),
			fixture2 = getFixture('users/get_users_page_2'),
			jsonOutput = getFixture('output/users_search_json.txt'),
			jsonFieldsOutput = getFixture('output/users_search_fields_json.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/users')
				.query({
					filter_term: userName,
				})
				.reply(200, fixture)
				.get('/2.0/users')
				.query({
					filter_term: userName,
					offset: 3
				})
				.reply(200, fixture2)
			)
			.stdout()
			.command([
				'users:search',
				userName,
				'--json',
				'--token=test'
			])
			.it('should search for Box users (JSON Output)', ctx => {
				assert.equal(ctx.stdout, jsonOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/users')
				.query({
					fields: 'name,address',
					filter_term: userName,
				})
				.reply(200, fixture)
				.get('/2.0/users')
				.query({
					fields: 'name,address',
					filter_term: userName,
					offset: 3
				})
				.reply(200, fixture2)
			)
			.stdout()
			.command([
				'users:search',
				userName,
				'--fields=name,address',
				'--json',
				'--token=test'
			])
			.it('should send fields param to the API when --fields flag is passed');

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/users')
				.query({
					filter_term: userName,
					fields: 'name,tracking_codes,is_external_collab_restricted',
				})
				.reply(200, fixture)
				.get('/2.0/users')
				.query({
					filter_term: userName,
					fields: 'name,tracking_codes,is_external_collab_restricted',
					offset: 3
				})
				.reply(200, fixture2)
			)
			.stdout()
			.command([
				'users:search',
				userName,
				'--fields=name,tracking_codes,is_external_collab_restricted',
				'--json',
				'--token=test'
			])
			.it('should request specific fields from API when fields flag is passed (JSON Output)', ctx => {
				assert.equal(ctx.stdout, jsonFieldsOutput);
			});

		leche.withData({
			'managed users flag': [
				'--managed-users',
				{user_type: 'managed'}
			],
			'external users flag': [
				'--external-users',
				{user_type: 'external'}
			],
			'all users flag': [
				'--all-users',
				{user_type: 'all'}
			],
		}, function(flag, queryParams) {

			test
				.nock(TEST_API_ROOT, api => api
					.get('/2.0/users')
					.query({
						filter_term: userName,
						...queryParams,
					})
					.reply(200, fixture)
					.get('/2.0/users')
					.query({
						filter_term: userName,
						...queryParams,
						offset: 3
					})
					.reply(200, fixture2)
				)
				.stdout()
				.command([
					'users:search',
					userName,
					flag,
					'--json',
					'--token=test'
				])
				.it('should search for correct type of users when filtering flag is passed (JSON Output)', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});
		});
	});

	leche.withData([
		'users:invite',
		'users:invite-user'
	], function(command) {

		describe(command, () => {
			let userEmail = 'testuser@example.com',
				enterpriseId = '1234',
				fixture = getFixture('users/get_users_id'),
				yamlOutput = getFixture('output/users_invite_user_yaml.txt');

			let expectedBody = {
				enterprise: { id: enterpriseId },
				actionable_by: { login: userEmail }
			};

			test
				.nock(TEST_API_ROOT, api => api
					.post('/2.0/invites', expectedBody)
					.reply(201, fixture)
				)
				.stdout()
				.command([
					command,
					userEmail,
					enterpriseId,
					'--json',
					'--token=test'
				])
				.it('should invite an Existing Box User to Your Enterprise (JSON Output)', ctx => {
					assert.equal(ctx.stdout, fixture);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.post('/2.0/invites', expectedBody)
					.reply(201, fixture)
				)
				.stdout()
				.command([
					command,
					userEmail,
					enterpriseId,
					'--token=test'
				])
				.it('should invite an Existing Box User to Your Enterprise (YAML Output)', ctx => {
					assert.equal(ctx.stdout, yamlOutput);
				});
		});
	});

	leche.withData([
		'users:transfer-content',
		'users:move-root-content'
	], function(command) {

		describe(command, () => {
			let userId = '1234',
				newUserId = '4321',
				fixture = getFixture('users/put_users_id_folder'),
				yamlOutput = getFixture('output/users_move_root_content_yaml.txt');

			test
				.nock(TEST_API_ROOT, api => api
					.put(`/2.0/users/${userId}/folders/0`)
					.reply(200, fixture)
				)
				.stdout()
				.command([
					command,
					userId,
					newUserId,
					'--json',
					'--token=test'
				])
				.it('should move a user\'s root content to another user (JSON Output)', ctx => {
					assert.equal(ctx.stdout, fixture);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.put(`/2.0/users/${userId}/folders/0`)
					.reply(200, fixture)
				)
				.stdout()
				.command([
					command,
					userId,
					newUserId,
					'--token=test'
				])
				.it('should move a user\'s root content to another user (YAML Output)', ctx => {
					assert.equal(ctx.stdout, yamlOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.put(`/2.0/users/${userId}/folders/0`)
					.reply(200, fixture)
				)
				.stdout()
				.command([
					command,
					userId,
					newUserId,
					'--token=test',
					'-q'
				])
				.it('should move a user\'s root content to another user (No Output)', ctx => {
					assert.isEmpty(ctx.stdout);
				});
		});
	});

	describe('users:create', () => {
		let name = 'Another Test User',
			login = 'anothertestuser@example.com',
			role = 'user',
			phone = '1234567890',
			fixture = getFixture('users/post_users'),
			yamlOutput = getFixture('output/users_create_yaml.txt');

		let expectedBody = {
			name,
			login,
			phone,
			role,
			is_sync_enabled: true
		};

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/users', expectedBody)
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'users:create',
				name,
				login,
				`--role=${role}`,
				`--phone-number=${phone}`,
				'--sync-enable',
				'--json',
				'--token=test'
			])
			.it('should create a new Box user with role, phone-number and sync-enable flags passed (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/users', expectedBody)
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'users:create',
				name,
				login,
				`--role=${role}`,
				`--phone-number=${phone}`,
				'--sync-enable',
				'--token=test'
			])
			.it('should create a new Box user with role, phone-number and sync-enable flags passed (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/users', expectedBody)
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'users:create',
				name,
				login,
				`--role=${role}`,
				`--phone-number=${phone}`,
				'--sync-enable',
				'--id-only',
				'--token=test'
			])
			.it('should create a new Box user with role, phone-number and sync-enable flags passed (ID Output)', ctx => {
				assert.equal(ctx.stdout, `${JSON.parse(fixture).id}${os.EOL}`);
			});

		leche.withData({
			'sync disable flag': [
				'--no-sync-enable',
				{is_sync_enabled: false}
			],
			'exempt from device limits flag': [
				'--exempt-from-device-limits',
				{is_exempt_from_device_limits: true}
			],
			'no exempt from device limits flag': [
				'--no-exempt-from-device-limits',
				{is_exempt_from_device_limits: false}
			],
			'password reset required flag': [
				'--password-reset',
				{is_password_reset_required: true}
			],
			'exempt from login verification flag': [
				'--exempt-from-2fa',
				{is_exempt_login_verification: true}
			],
			'no exempt from login verification flag': [
				'--no-exempt-from-2fa',
				{is_exempt_login_verification: false}
			],
			'external collab restricted flag': [
				'--restrict-external-collab',
				{is_external_collab_restricted: true}
			],
			'can see managed users flag': [
				'--can-see-managed-users',
				{can_see_managed_users: true}
			],
			'no can see managed users flag': [
				'--no-can-see-managed-users',
				{can_see_managed_users: false}
			],
			'language flag': [
				'--language=en-us',
				{language: 'en-us'}
			],
			'job title flag': [
				'--job-title=CEO',
				{job_title: 'CEO'}
			],
			'address flag': [
				'--address=Nowhere',
				{address: 'Nowhere'}
			],
			'space amount flag': [
				'--disk-space=12345',
				{space_amount: 12345}
			],
			'status flag': [
				'--status=inactive',
				{status: 'inactive'}
			],
			'timezone flag': [
				'--timezone=America/Los_Angeles',
				{timezone: 'America/Los_Angeles'}
			],
		}, function(flag, body) {

			test
				.nock(TEST_API_ROOT, api => api
					.post('/2.0/users', { name, login, ...body })
					.reply(201, fixture)
				)
				.stdout()
				.command([
					'users:create',
					name,
					login,
					flag,
					'--id-only',
					'--token=test'
				])
				.it('should create a new Box user with specified attributes when flag is passed', ctx => {
					assert.equal(ctx.stdout, `${JSON.parse(fixture).id}${os.EOL}`);
				});
		});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/users', {
					name,
					is_platform_access_only: true,
					external_app_user_id: 'foo',
				})
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'users:create',
				name,
				'--app-user',
				'--external-id=foo',
				'--id-only',
				'--token=test'
			])
			.it('should create a new app user with external ID when App User flags are passed', ctx => {
				assert.equal(ctx.stdout, `${JSON.parse(fixture).id}${os.EOL}`);
			});

		test
			.stdout()
			.stderr()
			.command([
				'users:create',
				name,
				'--no-color',
				'--token=test'
			])
			.it('should output an error message when neither the --app-user flag or login is passed', ctx => {
				assert.equal(ctx.stdout, '');
				assert.equal(ctx.stderr, `Either the login argument or the --app-user flag is required${os.EOL}`);
			});
	});

	describe('users:update', () => {
		let userId = '33333',
			phone = '(555) 555-5555',
			jobTitle = 'CEO',
			fixture = getFixture('users/put_users_id'),
			yamlOutput = getFixture('output/users_update_yaml.txt');

		let expectedBody = {
			phone,
			job_title: jobTitle
		};

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/users/${userId}`, expectedBody)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'users:update',
				userId,
				`--phone-number=${phone}`,
				`--job-title=${jobTitle}`,
				'--json',
				'--token=test'
			])
			.it('should update a new Box user with phone-number and job-title flags passed (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/users/${userId}`, expectedBody)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'users:update',
				userId,
				`--phone-number=${phone}`,
				`--job-title=${jobTitle}`,
				'--token=test'
			])
			.it('should update a new Box user with phone-number and job-title flags passed (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		leche.withData({
			'sync disable flag': [
				'--no-sync-enable',
				{is_sync_enabled: false}
			],
			'exempt from device limits flag': [
				'--exempt-from-device-limits',
				{is_exempt_from_device_limits: true}
			],
			'no exempt from device limits flag': [
				'--no-exempt-from-device-limits',
				{is_exempt_from_device_limits: false}
			],
			'password reset required flag': [
				'--password-reset',
				{is_password_reset_required: true}
			],
			'exempt from login verification flag': [
				'--exempt-from-2fa',
				{is_exempt_login_verification: true}
			],
			'no exempt from login verification flag': [
				'--no-exempt-from-2fa',
				{is_exempt_login_verification: false}
			],
			'external collab restricted flag': [
				'--restrict-external-collab',
				{is_external_collab_restricted: true}
			],
			'can see managed users flag': [
				'--can-see-managed-users',
				{can_see_managed_users: true}
			],
			'no can see managed users flag': [
				'--no-can-see-managed-users',
				{can_see_managed_users: false}
			],
			'language flag': [
				'--language=en-us',
				{language: 'en-us'}
			],
			'job title flag': [
				'--job-title=CEO',
				{job_title: 'CEO'}
			],
			'address flag': [
				'--address=Nowhere',
				{address: 'Nowhere'}
			],
			'space amount flag': [
				'--disk-space=12345',
				{space_amount: 12345}
			],
			'status flag': [
				'--status=inactive',
				{status: 'inactive'}
			],
			'timezone flag': [
				'--timezone=America/Los_Angeles',
				{timezone: 'America/Los_Angeles'}
			],
			'role flag': [
				'--role=coadmin',
				{role: 'coadmin'}
			],
			'remove flag': [
				'--remove',
				{enterprise: null},
			],
			'login flag': [
				'--login=new.email@gmail.com',
				{login: 'new.email@gmail.com'},
			],
			'name flag': [
				'--name=Bob Smith',
				{name: 'Bob Smith'}
			],
			'external ID flag': [
				'--external-id=foo',
				{external_app_user_id: 'foo'}
			]
		}, function(flag, body) {

			test
				.nock(TEST_API_ROOT, api => api
					.put(`/2.0/users/${userId}`, body)
					.reply(200, fixture)
				)
				.stdout()
				.command([
					'users:update',
					userId,
					flag,
					'--json',
					'--token=test'
				])
				.it('should update user with specified attributes when flag is passed', ctx => {
					assert.equal(ctx.stdout, fixture);
				});
		});
	});

	describe('users:delete', () => {
		let userId = '44444';

		test
			.nock(TEST_API_ROOT, api => api
				.delete(`/2.0/users/${userId}`)
				.query({ force: true })
				.reply(204)
			)
			.stderr()
			.command([
				'users:delete',
				userId,
				'--force',
				'--token=test'
			])
			.it('should delete a Box User with the force flag passed', ctx => {
				assert.equal(ctx.stderr, `Deleted user ${userId}${os.EOL}`);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.delete(`/2.0/users/${userId}`)
				.query({ notify: false })
				.reply(204)
			)
			.stderr()
			.command([
				'users:delete',
				userId,
				'--no-notify',
				'--token=test'
			])
			.it('should pass notify param when --no-notify flag is passed', ctx => {
				assert.equal(ctx.stderr, `Deleted user ${userId}${os.EOL}`);
			});
	});

	describe('users:terminate-session', () => {
		let userIDs = ['12345', '67890'];
		let userLogins = ['user1@example.com', 'user2@example.com'];
		let fixture = getFixture('users/post_users_terminate_sessions');

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/users/terminate_sessions', {
					user_ids: userIDs,
					user_logins: userLogins
				})
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'users:terminate-session',
				'--user-ids',
				'12345',
				'67890',
				'--user-logins',
				'user1@example.com',
				'user2@example.com',
				'--json',
				'--token=test'
			])
			.it('should terminate sessions for the specified users', ctx => {
				assert.equal(ctx.stdout, fixture);
			});
	});
});
