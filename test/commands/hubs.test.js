'use strict';

const { test } = require('@oclif/test');
const { assert } = require('chai');
const os = require('node:os');
const { TEST_API_ROOT, getFixture } = require('../helpers/test-helper');

// Hub fixtures use API snake_case fields, but the TS SDK currently returns camelCase JSON output.
// It also wraps date-time fields in `{ value: ... }` objects, so tests need a normalized expected shape.
// This is a temporary test helper until a future PR makes command JSON output follow API field naming.
function formatHubJsonOutput(hub) {
	return {
		id: hub.id,
		type: hub.type,
		title: hub.title,
		description: hub.description,
		createdAt: {
			value: hub.created_at,
		},
		updatedAt: {
			value: hub.updated_at,
		},
		createdBy: hub.created_by,
		updatedBy: hub.updated_by,
		viewCount: hub.view_count,
		isAiEnabled: hub.is_ai_enabled,
		isCollaborationRestrictedToEnterprise:
			hub.is_collaboration_restricted_to_enterprise,
		canNonOwnersInvite: hub.can_non_owners_invite,
		canSharedLinkBeCreated: hub.can_shared_link_be_created,
		canPublicSharedLinkBeCreated: hub.can_public_shared_link_be_created,
	};
}

describe('Hubs', function () {
	describe('hubs', function () {
		const response = {
			entries: [{ id: '12345', type: 'hubs', title: 'Team Hub' }],
			limit: 10,
		};

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/hubs')
					.query({
						query: 'team',
						scope: 'editable',
						sort: 'name',
						direction: 'ASC',
						limit: 10,
					})
					.reply(200, response)
			)
			.stdout()
			.command([
				'hubs',
				'--query=team',
				'--scope=editable',
				'--sort=name',
				'--direction=ASC',
				'--max-items=10',
				'--json',
				'--token=test',
			])
			.it('lists hubs with provided filters', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), [
					{ id: '12345', type: 'hubs', title: 'Team Hub' },
				]);
			});

		const firstPageEntries = Array.from({ length: 1000 }, (_, index) => ({
			id: `${index + 1}`,
			type: 'hubs',
		}));
		const secondPageEntries = [{ id: '1001', type: 'hubs' }];

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/hubs')
					.query({
						query: 'team',
						limit: 1000,
					})
					.reply(200, {
						entries: firstPageEntries,
						limit: 1000,
						next_marker: 'next-page',
					})
					.get('/2.0/hubs')
					.query({
						query: 'team',
						limit: 1,
						marker: 'next-page',
					})
					.reply(200, {
						entries: secondPageEntries,
						limit: 1,
					})
			)
			.stdout()
			.command([
				'hubs',
				'--query=team',
				'--max-items=1001',
				'--json',
				'--token=test',
			])
			.it('follows next_marker until max-items is reached', (context) => {
				const output = JSON.parse(context.stdout);
				assert.lengthOf(output, 1001);
				assert.equal(output[0].id, '1');
				assert.equal(output[1000].id, '1001');
			});
	});

	describe('hubs:enterprise', function () {
		const response = {
			entries: [{ id: '11111', type: 'hubs', title: 'Enterprise Hub' }],
			limit: 50,
		};

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/enterprise_hubs')
					.query({
						query: 'enterprise',
						sort: 'updated_at',
						direction: 'DESC',
						limit: 50,
					})
					.reply(200, response)
			)
			.stdout()
			.command([
				'hubs:enterprise',
				'--query=enterprise',
				'--sort=updated_at',
				'--direction=DESC',
				'--max-items=50',
				'--json',
				'--token=test',
			])
			.it('lists enterprise hubs with provided filters', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), [
					{
						id: '11111',
						type: 'hubs',
						title: 'Enterprise Hub',
					},
				]);
			});
	});

	describe('hubs:items', function () {
		const response = JSON.parse(getFixture('hubs/get_hub_items'));

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.get('/2.0/hub_items')
					.query({
						hub_id: '12345',
						parent_id: '67890',
						limit: 2,
					})
					.reply(200, response)
			)
			.stdout()
			.command([
				'hubs:items',
				'12345',
				'--parent-id=67890',
				'--max-items=2',
				'--json',
				'--token=test',
			])
			.it('lists items in a hub', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response.entries);
			});
	});

	describe('hubs:items:manage', function () {
		const response = JSON.parse(getFixture('hubs/post_hubs_id_manage_items'));

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.post('/2.0/hubs/12345/manage_items', {
						operations: [
							{
								action: 'add',
								item: {
									id: '11111',
									type: 'file',
								},
								parent_id: '67890',
							},
							{
								action: 'remove',
								item: {
									id: '22222',
									type: 'folder',
								},
							},
						],
					})
					.reply(200, response)
			)
			.stdout()
			.command([
				'hubs:items:manage',
				'12345',
				'--add=id=11111,type=file,parent-id=67890',
				'--remove=id=22222,type=folder',
				'--json',
				'--token=test',
			])
			.it('adds and removes items in a hub', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), {
					operations: [
						{
							action: 'add',
							item: {
								id: '11111',
								type: 'file',
							},
							parentId: '67890',
							status: 201,
						},
						{
							action: 'remove',
							item: {
								id: '22222',
								type: 'folder',
							},
							status: 204,
						},
					],
				});
			});
	});

	describe('hubs:get', function () {
		const response = JSON.parse(getFixture('hubs/get_hubs_id'));

		test
			.nock(TEST_API_ROOT, (api) =>
				api.get('/2.0/hubs/12345').reply(200, response)
			)
			.stdout()
			.command(['hubs:get', '12345', '--json', '--token=test'])
			.it('gets a hub by ID', (context) => {
				assert.deepEqual(
					JSON.parse(context.stdout),
					formatHubJsonOutput(response)
				);
			});
	});

	describe('hubs:create', function () {
		const response = {
			id: '98765',
			type: 'hubs',
			title: 'New Hub',
			description: 'New hub description',
		};

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.post('/2.0/hubs', {
						title: 'New Hub',
						description: 'New hub description',
					})
					.reply(200, response)
			)
			.stdout()
			.command([
				'hubs:create',
				'New Hub',
				'--description=New hub description',
				'--json',
				'--token=test',
			])
			.it('creates a hub with title and description', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), {
					id: '98765',
					type: 'hubs',
					title: 'New Hub',
					description: 'New hub description',
				});
			});
	});

	describe('hubs:update', function () {
		const response = JSON.parse(getFixture('hubs/put_hubs_id'));

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.put('/2.0/hubs/12345', {
						title: 'Updated Hub',
						description: 'Updated description',
						is_ai_enabled: true,
						is_collaboration_restricted_to_enterprise: true,
						can_non_owners_invite: true,
						can_shared_link_be_created: false,
					})
					.reply(200, response)
			)
			.stdout()
			.command([
				'hubs:update',
				'12345',
				'--title=Updated Hub',
				'--description=Updated description',
				'--ai-enabled',
				'--collaboration-restricted-to-enterprise',
				'--can-non-owners-invite',
				'--no-can-shared-link-be-created',
				'--json',
				'--token=test',
			])
			.it('updates a hub with provided fields', (context) => {
				assert.deepEqual(
					JSON.parse(context.stdout),
					formatHubJsonOutput(response)
				);
			});
	});

	describe('hubs:copy', function () {
		const response = {
			id: '55555',
			type: 'hubs',
			title: 'Copied Hub',
			description: 'Copied description',
		};

		test
			.nock(TEST_API_ROOT, (api) =>
				api
					.post('/2.0/hubs/12345/copy', {
						title: 'Copied Hub',
						description: 'Copied description',
					})
					.reply(200, response)
			)
			.stdout()
			.command([
				'hubs:copy',
				'12345',
				'--title=Copied Hub',
				'--description=Copied description',
				'--json',
				'--token=test',
			])
			.it('copies a hub with overrides', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), {
					id: '55555',
					type: 'hubs',
					title: 'Copied Hub',
					description: 'Copied description',
				});
			});
	});

	describe('hubs:delete', function () {
		test
			.nock(TEST_API_ROOT, (api) =>
				api.delete('/2.0/hubs/12345').reply(204)
			)
			.stderr()
			.command(['hubs:delete', '12345', '--token=test'])
			.it('deletes a hub by ID', (context) => {
				assert.equal(context.stderr, `Deleted hub 12345${os.EOL}`);
			});
	});
});
