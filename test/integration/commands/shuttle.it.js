'use strict';

const { assert } = require('chai');
const { run, expectFailure, uniqueName, cleanup } = require('../helpers');

// The ID the box-node-sdk shuttle tests use for jobs, schedules, mappings, runs and reports that do not exist
const MISSING_ID = '123456';

describe('Integration: shuttle', function () {
	let system;
	let systemDeleted = false;

	after(async function () {
		try {
			if (system && !systemDeleted) {
				await run(['shuttle:systems:delete', system.id], {
					asUser: true,
					json: false,
				});
			}
		} finally {
			cleanup();
		}
	});

	describe('jobs', function () {
		it('shuttle:jobs lists the shuttle jobs of USER_ID', async function () {
			const { output } = await run(['shuttle:jobs'], { asUser: true });
			assert.isArray(output);
		});

		it('shuttle:jobs:create fails for a source system that does not exist', async function () {
			await expectFailure(
				[
					'shuttle:jobs:create',
					uniqueName(),
					'--job-type',
					'transfer',
					'--source-system-id',
					MISSING_ID,
				],
				{ status: 400, asUser: true }
			);
		});

		it('shuttle:jobs:get fails for a job that does not exist', async function () {
			await expectFailure(['shuttle:jobs:get', MISSING_ID], {
				status: 404,
				asUser: true,
			});
		});

		it('shuttle:jobs:update fails for a job that does not exist', async function () {
			await expectFailure(
				['shuttle:jobs:update', MISSING_ID, '--name', uniqueName()],
				{ status: 404, asUser: true }
			);
		});

		it('shuttle:jobs:delete fails for a job that does not exist', async function () {
			await expectFailure(['shuttle:jobs:delete', MISSING_ID], {
				status: 404,
				asUser: true,
				json: false,
			});
		});

		it('shuttle:jobs:start fails for a job that does not exist', async function () {
			await expectFailure(['shuttle:jobs:start', MISSING_ID], {
				status: 404,
				asUser: true,
				json: false,
			});
		});

		it('shuttle:jobs:stop fails for a job that does not exist', async function () {
			await expectFailure(['shuttle:jobs:stop', MISSING_ID], {
				status: 404,
				asUser: true,
				json: false,
			});
		});

		it('shuttle:jobs:prepare-migration fails for a job that does not exist', async function () {
			await expectFailure(
				['shuttle:jobs:prepare-migration', MISSING_ID],
				{ status: 404, asUser: true, json: false }
			);
		});
	});

	describe('job schedules', function () {
		it('shuttle:job-schedules fails for a job that does not exist', async function () {
			await expectFailure(
				['shuttle:job-schedules', '--job-id', MISSING_ID],
				{ status: 404, asUser: true }
			);
		});

		it('shuttle:job-schedules:get fails for a schedule that does not exist', async function () {
			await expectFailure(['shuttle:job-schedules:get', MISSING_ID], {
				status: 404,
				asUser: true,
			});
		});

		it('shuttle:job-schedules:update fails for a schedule that does not exist', async function () {
			await expectFailure(
				[
					'shuttle:job-schedules:update',
					MISSING_ID,
					'--run-mode',
					'simulation',
				],
				{ status: 404, asUser: true }
			);
		});

		it('shuttle:job-schedules:delete fails for a schedule that does not exist', async function () {
			await expectFailure(['shuttle:job-schedules:delete', MISSING_ID], {
				status: 404,
				asUser: true,
				json: false,
			});
		});

		it('shuttle:job-schedules:create fails for a job that does not exist', async function () {
			await expectFailure(
				[
					'shuttle:job-schedules:create',
					'--job-id',
					MISSING_ID,
					'--run-mode',
					'transfer',
					'--state',
					'paused',
					'--trigger-type',
					'by_time',
					'--start-at',
					'2030-01-01T09:00:00',
					'--time-zone',
					'America/Los_Angeles',
					'--repeat',
					'daily',
				],
				{ status: 404, asUser: true }
			);
		});
	});

	describe('mappings', function () {
		it('shuttle:path-mappings fails for a job that does not exist', async function () {
			await expectFailure(
				['shuttle:path-mappings', '--job-id', MISSING_ID],
				{ status: 404, asUser: true }
			);
		});

		it('shuttle:path-mappings:get fails for a mapping that does not exist', async function () {
			await expectFailure(['shuttle:path-mappings:get', MISSING_ID], {
				status: 404,
				asUser: true,
			});
		});

		it('shuttle:path-mappings:update fails for a mapping that does not exist', async function () {
			await expectFailure(
				['shuttle:path-mappings:update', MISSING_ID, '--path-skipped'],
				{ status: 404, asUser: true }
			);
		});

		it('shuttle:path-mappings:delete fails for a mapping that does not exist', async function () {
			await expectFailure(['shuttle:path-mappings:delete', MISSING_ID], {
				status: 404,
				asUser: true,
				json: false,
			});
		});

		it('shuttle:path-mapping-imports:create fails for a job that does not exist', async function () {
			await expectFailure(
				[
					'shuttle:path-mapping-imports:create',
					'--job-id',
					MISSING_ID,
					'--file-id',
					MISSING_ID,
				],
				{ status: 404, asUser: true, json: false }
			);
		});

		it('shuttle:subject-mappings fails for a job that does not exist', async function () {
			await expectFailure(
				['shuttle:subject-mappings', '--job-id', MISSING_ID],
				{ status: 404, asUser: true }
			);
		});

		it('shuttle:subject-mappings:create fails for a job that does not exist', async function () {
			await expectFailure(
				[
					'shuttle:subject-mappings:create',
					'--job-id',
					MISSING_ID,
					'--discovered-subject-id',
					MISSING_ID,
				],
				{ status: 404, asUser: true }
			);
		});

		it('shuttle:subject-mappings:get fails for a mapping that does not exist', async function () {
			await expectFailure(['shuttle:subject-mappings:get', MISSING_ID], {
				status: 404,
				asUser: true,
			});
		});

		it('shuttle:subject-mappings:update fails for a mapping that does not exist', async function () {
			await expectFailure(
				[
					'shuttle:subject-mappings:update',
					MISSING_ID,
					'--subject-skipped',
				],
				{ status: 404, asUser: true }
			);
		});

		it('shuttle:subject-mappings:delete fails for a mapping that does not exist', async function () {
			await expectFailure(
				['shuttle:subject-mappings:delete', MISSING_ID],
				{ status: 404, asUser: true, json: false }
			);
		});

		it('shuttle:subject-mapping-imports:create fails for a job that does not exist', async function () {
			await expectFailure(
				[
					'shuttle:subject-mapping-imports:create',
					'--job-id',
					MISSING_ID,
					'--file-id',
					MISSING_ID,
				],
				{ status: 404, asUser: true, json: false }
			);
		});

		it('shuttle:discovered-subjects fails for a job that does not exist', async function () {
			await expectFailure(
				['shuttle:discovered-subjects', '--job-id', MISSING_ID],
				{ status: 404, asUser: true }
			);
		});

		it('shuttle:path-entries fails for a job that does not exist', async function () {
			await expectFailure(
				[
					'shuttle:path-entries',
					'--job-id',
					MISSING_ID,
					'--side',
					'source',
				],
				{ status: 404, asUser: true }
			);
		});

		it('shuttle:mapping-errors fails for a job that does not exist', async function () {
			await expectFailure(
				['shuttle:mapping-errors', '--job-id', MISSING_ID],
				{ status: 404, asUser: true }
			);
		});

		it('shuttle:path-mappings:create fails for a job that does not exist', async function () {
			await expectFailure(
				[
					'shuttle:path-mappings:create',
					'--job-id',
					MISSING_ID,
					'--source-type',
					'account',
					'--source-path',
					'/finance',
					'--source-account-email',
					'user@example.com',
				],
				{ status: 404, asUser: true }
			);
		});
	});

	describe('reports', function () {
		it('shuttle:reports fails for a run that does not exist', async function () {
			await expectFailure(['shuttle:reports', '--run-id', MISSING_ID], {
				status: 400,
				asUser: true,
			});
		});

		it('shuttle:reports:create fails for a run that does not exist', async function () {
			await expectFailure(
				[
					'shuttle:reports:create',
					'--run-id',
					MISSING_ID,
					'--format',
					'csv',
					'--section',
					'transfer_overview',
				],
				{ status: 400, asUser: true }
			);
		});

		it('shuttle:reports:get fails for a report that does not exist', async function () {
			await expectFailure(['shuttle:reports:get', MISSING_ID], {
				status: 404,
				asUser: true,
			});
		});
	});

	describe('runs', function () {
		it('shuttle:runs lists the runs of a job', async function () {
			const { output } = await run(
				['shuttle:runs', '--job-id', MISSING_ID],
				{ asUser: true }
			);
			assert.isArray(output);
		});

		it('shuttle:runs:get fails for a run that does not exist', async function () {
			await expectFailure(['shuttle:runs:get', MISSING_ID], {
				status: 400,
				asUser: true,
			});
		});
	});

	describe('systems', function () {
		it('shuttle:systems:create creates a Windows system', async function () {
			const name = uniqueName();
			const { output } = await run(
				['shuttle:systems:create', name, '--system-type', 'windows'],
				{ asUser: true }
			);
			system = output;
			assert.equal(output.type, 'shuttle_system');
			assert.equal(output.name, name);
			assert.equal(output.system_type, 'windows');
		});

		it('shuttle:systems:get returns the created system', async function () {
			const { output } = await run(['shuttle:systems:get', system.id], {
				asUser: true,
			});
			assert.equal(output.id, system.id);
			assert.equal(output.name, system.name);
		});

		it('shuttle:systems:update renames the system', async function () {
			const name = uniqueName();
			const { output } = await run(
				['shuttle:systems:update', system.id, '--name', name],
				{ asUser: true }
			);
			assert.equal(output.name, name);

			const { output: stored } = await run(
				['shuttle:systems:get', system.id],
				{ asUser: true }
			);
			assert.equal(stored.name, name);
		});

		it('shuttle:systems lists the created system', async function () {
			const { output } = await run(['shuttle:systems'], {
				asUser: true,
			});
			assert.isTrue(output.some((item) => item.id === system.id));
		});

		it('shuttle:systems:issue-registration-token issues a token', async function () {
			const { output } = await run(
				['shuttle:systems:issue-registration-token', system.id],
				{ asUser: true }
			);
			assert.isNotEmpty(output.registration_token);
		});

		it('shuttle:systems:delete deletes the system', async function () {
			await run(['shuttle:systems:delete', system.id], {
				asUser: true,
				json: false,
			});
			systemDeleted = true;

			await expectFailure(['shuttle:systems:get', system.id], {
				status: 404,
				asUser: true,
			});
		});
	});
});
