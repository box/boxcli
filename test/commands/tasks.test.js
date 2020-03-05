'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('os');
const leche = require('leche');

describe('Tasks', () => {

	describe('tasks:create', () => {
		let type = 'file',
			id = '22222',
			message = 'Please review',
			dueDate = '2019-01-01T09:00:00+00:00',
			completionRule = 'any_assignee',
			fixture = getFixture('tasks/post_tasks'),
			yamlOutput = getFixture('output/tasks_create_yaml.txt');

		let expectedBody = {
			message,
			action: 'review',
			item: { type, id }
		};

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/tasks', expectedBody)
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'tasks:create',
				id,
				`--message=${message}`,
				'--json',
				'--token=test'
			])
			.it('should create a task on a file with the message flag passed (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/tasks', expectedBody)
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'tasks:create',
				id,
				`--message=${message}`,
				'--token=test'
			])
			.it('should create a task on a file with the message flag passed (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/tasks', expectedBody)
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'tasks:create',
				id,
				`--message=${message}`,
				'--id-only',
				'--token=test'
			])
			.it('should create a task on a file with the message flag passed (ID Output)', ctx => {
				assert.equal(ctx.stdout, `${JSON.parse(fixture).id}${os.EOL}`);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/tasks', {
					item: { type, id },
					action: 'review',
					due_at: dueDate,
				})
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'tasks:create',
				id,
				`--due-at=${dueDate}`,
				'--json',
				'--token=test'
			])
			.it('should create task with a due date when the --due-at flag is passed', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/tasks', {
					item: { type, id },
					action: 'review',
					completion_rule: completionRule,
				})
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'tasks:create',
				id,
				`--completion-rule=${completionRule}`,
				'--json',
				'--token=test'
			])
			.it('should create task with a completion rule when --completion-rule flag is passed', ctx => {
				assert.equal(ctx.stdout, fixture);
			});
	});

	describe('tasks:update', () => {
		let taskId = '11111',
			message = 'Could you please review this?',
			dueDate = '2019-01-01T09:00:00+00:00',
			completionRule = 'any_assignee',
			fixture = getFixture('tasks/put_tasks_id'),
			yamlOutput = getFixture('output/tasks_update_yaml.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/tasks/${taskId}`, { message })
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'tasks:update',
				taskId,
				`--message=${message}`,
				'--json',
				'--token=test'
			])
			.it('should update a task on a file with the message flag passed (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/tasks/${taskId}`, { message })
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'tasks:update',
				taskId,
				`--message=${message}`,
				'--token=test'
			])
			.it('should update a task on a file with the message flag passed (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/tasks/${taskId}`, { due_at: dueDate })
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'tasks:update',
				taskId,
				`--due-at=${dueDate}`,
				'--json',
				'--token=test'
			])
			.it('should update task due date when the --due-at flag is passed', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put(`/2.0/tasks/${taskId}`, { completion_rule: completionRule })
				.reply(201, fixture)
			)
			.stdout()
			.command([
				'tasks:update',
				taskId,
				`--completion-rule=${completionRule}`,
				'--json',
				'--token=test'
			])
			.it('should update task with a completion rule when --completion-rule flag is passed', ctx => {
				assert.equal(ctx.stdout, fixture);
			});
	});

	describe('tasks:get', () => {
		let taskId = '11111',
			fixture = getFixture('tasks/put_tasks_id'),
			yamlOutput = getFixture('output/tasks_get_yaml.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/tasks/${taskId}`)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'tasks:get',
				taskId,
				'--json',
				'--token=test'
			])
			.it('should get information about a task (JSON Output)', ctx => {
				assert.equal(ctx.stdout, fixture);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/tasks/${taskId}`)
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'tasks:get',
				taskId,
				'--token=test'
			])
			.it('should get information about a task (YAML Output)', ctx => {
				assert.equal(ctx.stdout, yamlOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get(`/2.0/tasks/${taskId}`)
				.query({fields: 'action'})
				.reply(200, fixture)
			)
			.stdout()
			.command([
				'tasks:get',
				taskId,
				'--fields=action',
				'--token=test'
			])
			.it('should send fields param to the API when --fields flag is passed');
	});

	describe('tasks:delete', () => {
		let taskId = '11111';

		test
			.nock(TEST_API_ROOT, api => api
				.delete(`/2.0/tasks/${taskId}`)
				.reply(204)
			)
			.stderr()
			.command([
				'tasks:delete',
				taskId,
				'--token=test'
			])
			.it('should delete a task', ctx => {
				assert.equal(ctx.stderr, `Successfully deleted task ${taskId}${os.EOL}`);
			});
	});

	leche.withData([
		'tasks:assign',
		'task-assignments:create'
	], function(command) {

		describe(command, () => {
			let taskId = '11111',
				userId = '33333',
				userLogin = 'foo@example.com',
				fixture = getFixture('task-assignments/post_task_assignments'),
				yamlOutput = getFixture('output/task_assignments_create_yaml.txt');

			let expectedBody = {
				task: {
					type: 'task',
					id: taskId
				},
				assign_to: {
					id: userId
				}
			};

			test
				.nock(TEST_API_ROOT, api => api
					.post('/2.0/task_assignments', expectedBody)
					.reply(201, fixture)
				)
				.stdout()
				.command([
					command,
					taskId,
					`--assign-to-user-id=${userId}`,
					'--json',
					'--token=test'
				])
				.it('should create a task assignment with the assign-to-user-id passed (JSON Output)', ctx => {
					assert.equal(ctx.stdout, fixture);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.post('/2.0/task_assignments', expectedBody)
					.reply(201, fixture)
				)
				.stdout()
				.command([
					command,
					taskId,
					`--assign-to-user-id=${userId}`,
					'--token=test'
				])
				.it('should create a task assignment with the assign-to-user-id passed (YAML Output)', ctx => {
					assert.equal(ctx.stdout, yamlOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.post('/2.0/task_assignments', {
						...expectedBody,
						assign_to: {
							login: userLogin,
						},
					})
					.reply(201, fixture)
				)
				.stdout()
				.command([
					command,
					taskId,
					`--assign-to-user-login=${userLogin}`,
					'--json',
					'--token=test'
				])
				.it('should create a task assignment with the assign-to-user-login flag', ctx => {
					assert.equal(ctx.stdout, fixture);
				});
		});
	});

	leche.withData([
		'tasks:assignments:delete',
		'task-assignments:delete'
	], function(command) {

		describe(command, () => {
			let assignmentId = '12345';

			test
				.nock(TEST_API_ROOT, api => api
					.delete(`/2.0/task_assignments/${assignmentId}`)
					.reply(204)
				)
				.stderr()
				.command([
					command,
					assignmentId,
					'--token=test'
				])
				.it('should delete a task assignment', ctx => {
					assert.equal(ctx.stderr, `Successfully deleted task assignment ${assignmentId}${os.EOL}`);
				});
		});
	});

	leche.withData([
		'tasks:assignments:get',
		'task-assignments:get'
	], function(command) {

		describe(command, () => {
			let assignmentId = '12345',
				fixture = getFixture('task-assignments/post_task_assignments'),
				yamlOutput = getFixture('output/task_assignments_get_yaml.txt');

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/task_assignments/${assignmentId}`)
					.reply(200, fixture)
				)
				.stdout()
				.command([
					command,
					assignmentId,
					'--json',
					'--token=test'
				])
				.it('should get information about a task assignment (JSON Output)', ctx => {
					assert.equal(ctx.stdout, fixture);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/task_assignments/${assignmentId}`)
					.reply(200, fixture)
				)
				.stdout()
				.command([
					command,
					assignmentId,
					'--token=test'
				])
				.it('should get information about a task assignment (YAML Output)', ctx => {
					assert.equal(ctx.stdout, yamlOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/task_assignments/${assignmentId}`)
					.query({fields: 'id'})
					.reply(200, fixture)
				)
				.stdout()
				.command([
					command,
					assignmentId,
					'--fields=id',
					'--token=test'
				])
				.it('should send fields param to the API when --fields flag is passed');
		});
	});

	leche.withData([
		'tasks:assignments',
		'task-assignments:list'
	], function(command) {

		describe(command, () => {
			let taskId = '11111',
				fixture = getFixture('task-assignments/get_tasks_id_assignments'),
				jsonOutput = getFixture('output/task_assignments_list_json.txt');

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/tasks/${taskId}/assignments`)
					.reply(200, fixture)
				)
				.stdout()
				.command([
					command,
					taskId,
					'--json',
					'--token=test'
				])
				.it('should list all task assignments on a task', ctx => {
					assert.equal(ctx.stdout, jsonOutput);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.get(`/2.0/tasks/${taskId}/assignments`)
					.query({fields: 'id'})
					.reply(200, fixture)
				)
				.stdout()
				.command([
					command,
					taskId,
					'--fields=id',
					'--json',
					'--token=test'
				])
				.it('should send fields param to the API when --fields flag is passed');
		});
	});

	leche.withData([
		'tasks:assignments:update',
		'task-assignments:update'
	], function(command) {

		describe(command, () => {
			let assignmentId = '12345',
				message = 'Looks good to me!',
				fixture = getFixture('task-assignments/put_task_assignments_id'),
				yamlOutput = getFixture('output/task_assignments_update_yaml.txt');

			test
				.nock(TEST_API_ROOT, api => api
					.put(`/2.0/task_assignments/${assignmentId}`, { message })
					.reply(200, fixture)
				)
				.stdout()
				.command([
					command,
					assignmentId,
					`--message=${message}`,
					'--json',
					'--token=test'
				])
				.it('should update a task assignment with message flag passed (JSON Output)', ctx => {
					assert.equal(ctx.stdout, fixture);
				});

			test
				.nock(TEST_API_ROOT, api => api
					.put(`/2.0/task_assignments/${assignmentId}`, { message })
					.reply(200, fixture)
				)
				.stdout()
				.command([
					command,
					assignmentId,
					`--message=${message}`,
					'--token=test'
				])
				.it('should update a task assignment with message flag passed (YAML Output)', ctx => {
					assert.equal(ctx.stdout, yamlOutput);
				});

			leche.withData({
				'completed flag': [
					'--completed',
					'completed'
				],
				'incomplete flag': [
					'--incomplete',
					'incomplete'
				],
				'approved flag': [
					'--approved',
					'approved'
				],
				'rejected flag': [
					'--rejected',
					'rejected'
				],
				'status flag set to completed': [
					'--status=completed',
					'completed'
				],
				'status flag set to incomplete': [
					'--status=incomplete',
					'incomplete'
				],
				'status flag set to approved': [
					'--status=approved',
					'approved'
				],
				'status flag set to rejected': [
					'--status=rejected',
					'rejected'
				]
			}, function(flag, resolutionState) {

				test
					.nock(TEST_API_ROOT, api => api
						.put(`/2.0/task_assignments/${assignmentId}`, { resolution_state: resolutionState })
						.reply(200, fixture)
					)
					.stdout()
					.command([
						command,
						assignmentId,
						flag,
						'--json',
						'--token=test'
					])
					.it('should update a task assignment with resolution state flag passed', ctx => {
						assert.equal(ctx.stdout, fixture);
					});
			});
		});
	});
});
