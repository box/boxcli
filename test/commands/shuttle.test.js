'use strict';

const { test } = require('@oclif/test');
const { assert } = require('chai');
const os = require('node:os');
const { TEST_API_ROOT } = require('../helpers/test-helper');

describe('Shuttle', function () {
	const jobId = '6a315c0754833bfc5df067bf';
	const systemId = '6a3ba68e810d9156194530a1';
	const scheduleId = '6a3ba68e810d9156194530b2';
	const pathMappingId = '6a3ba68e810d9156194530c3';
	const subjectMappingId = '6a3ba68e810d9156194530d4';
	const discoveredSubjectId = '6a3ba7c02ea17bc9461eeacf';
	const runId = `${jobId}:42`;
	const reportId = '6a3ba68e810d9156194530e5';
	const fileId = '12345678901';

	const system = {
		id: systemId,
		type: 'shuttle_system',
		name: 'NYC File Server',
		system_type: 'windows',
		state: 'connected',
	};

	const job = {
		id: jobId,
		type: 'shuttle_job',
		name: 'Q4 Migration',
		job_type: 'transfer',
		state: 'draft',
		mapping_state: 'incomplete',
		is_enabled: true,
		source_system: {
			type: 'shuttle_system',
			id: systemId,
			name: 'NYC File Server',
		},
	};

	const scheduleTrigger = {
		type: 'by_time',
		start_at: '2026-03-16T09:00:00',
		time_zone: 'America/Los_Angeles',
		repeat: 'daily',
	};

	const schedule = {
		id: scheduleId,
		type: 'shuttle_job_schedule',
		job_id: jobId,
		run_mode: 'transfer',
		state: 'enabled',
		trigger: scheduleTrigger,
	};

	const pathMapping = {
		id: pathMappingId,
		type: 'shuttle_path_mapping',
		job_id: jobId,
		is_path_skipped: false,
		source: {
			type: 'account',
			path: '/Finance',
			account: {
				email: 'admin@company.com',
			},
		},
		target: {
			type: 'account',
			path: '/HR Migration',
			account: {
				email: 'admin@company.box.com',
			},
		},
	};

	const subjectMapping = {
		id: subjectMappingId,
		type: 'shuttle_subject_mapping',
		job_id: jobId,
		discovered_subject_id: discoveredSubjectId,
		is_subject_skipped: false,
		source: {
			type: 'user',
			email: 'alice@company.com',
			name: 'Alice',
		},
		target: {
			type: 'user',
			id: '12345678',
		},
	};

	const run = {
		id: runId,
		type: 'shuttle_run',
		job_id: jobId,
		run_mode: 'transfer',
		state: 'completed',
	};

	const report = {
		id: reportId,
		type: 'shuttle_report',
		run_id: runId,
		status: 'ready',
		format: 'xlsx',
	};

	const mappingError = {
		id: 'err1',
		type: 'shuttle_mapping_error',
		job_id: jobId,
		revision: 1,
		category: 'path_import',
		path: '/Finance',
		messages: ['Row 2: Invalid path'],
	};

	const discoveredSubject = {
		id: discoveredSubjectId,
		type: 'shuttle_discovered_subject',
		job_id: jobId,
		revision: 1,
		source: {
			type: 'user',
			email: 'alice@company.com',
			name: 'Alice',
		},
	};

	const pathEntries = {
		entries: [
			{
				id: 'pe1',
				type: 'shuttle_path_entry',
				name: 'Finance',
				path: '/Finance',
				is_directory: true,
				can_map: true,
				scope: {
					type: 'account',
					email: 'admin@company.com',
				},
			},
		],
		limit: 100,
	};

	/* ------------------------------------------------------------------ */
	/* systems                                                            */
	/* ------------------------------------------------------------------ */

	describe('shuttle:systems', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/shuttle_systems')
				.query({ limit: 10 })
				.matchHeader('box-version', '2026.0')
				.reply(200, { entries: [system], limit: 10 })
		)
			.stdout()
			.command(['shuttle:systems', '--max-items=10', '--json', '--token=test'])
			.it('lists shuttle systems', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), [system]);
			});
	});

	describe('shuttle:systems:get', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/shuttle_systems/${systemId}`)
				.matchHeader('box-version', '2026.0')
				.reply(200, system)
		)
			.stdout()
			.command(['shuttle:systems:get', systemId, '--json', '--token=test'])
			.it('gets a shuttle system by id', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), system);
			});
	});

	describe('shuttle:systems:create', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/shuttle_systems', {
					name: 'NYC File Server',
					system_type: 'windows',
				})
				.matchHeader('box-version', '2026.0')
				.reply(201, system)
		)
			.stdout()
			.command([
				'shuttle:systems:create',
				'NYC File Server',
				'--system-type=windows',
				'--json',
				'--token=test',
			])
			.it('creates a windows shuttle system', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), system);
			});
	});

	describe('shuttle:systems:update', function () {
		const updated = { ...system, name: 'NYC File Server (Primary)' };

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/shuttle_systems/${systemId}`, {
					name: 'NYC File Server (Primary)',
				})
				.matchHeader('box-version', '2026.0')
				.reply(200, updated)
		)
			.stdout()
			.command([
				'shuttle:systems:update',
				systemId,
				'--name=NYC File Server (Primary)',
				'--json',
				'--token=test',
			])
			.it('updates a shuttle system name', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), updated);
			});
	});

	describe('shuttle:systems:delete', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.delete(`/2.0/shuttle_systems/${systemId}`)
				.matchHeader('box-version', '2026.0')
				.reply(204)
		)
			.stderr()
			.command(['shuttle:systems:delete', systemId, '--token=test'])
			.it('deletes a shuttle system', (context) => {
				assert.equal(
					context.stderr,
					`Deleted shuttle system ${systemId}${os.EOL}`
				);
			});
	});

	describe('shuttle:systems:issue-registration-token', function () {
		const credentials = {
			type: 'shuttle_agent_credentials',
			registration_token: 'reg-token-xyz',
			expires_at: '2026-03-16T10:00:00Z',
		};

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post(`/2.0/shuttle_systems/${systemId}/issue_registration_token`)
				.matchHeader('box-version', '2026.0')
				.reply(201, credentials)
		)
			.stdout()
			.command([
				'shuttle:systems:issue-registration-token',
				systemId,
				'--json',
				'--token=test',
			])
			.it('issues a Windows agent registration token', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), credentials);
			});
	});

	/* ------------------------------------------------------------------ */
	/* jobs                                                               */
	/* ------------------------------------------------------------------ */

	describe('shuttle:jobs', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/shuttle_jobs')
				.query({ limit: 10 })
				.matchHeader('box-version', '2026.0')
				.reply(200, { entries: [job], limit: 10 })
		)
			.stdout()
			.command(['shuttle:jobs', '--max-items=10', '--json', '--token=test'])
			.it('lists shuttle jobs', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), [job]);
			});
	});

	describe('shuttle:jobs:get', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/shuttle_jobs/${jobId}`)
				.matchHeader('box-version', '2026.0')
				.reply(200, job)
		)
			.stdout()
			.command(['shuttle:jobs:get', jobId, '--json', '--token=test'])
			.it('gets a shuttle job by id', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), job);
			});
	});

	describe('shuttle:jobs:create', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/shuttle_jobs', {
					name: 'Q4 Migration',
					job_type: 'transfer',
					source_system_id: systemId,
					account_mapping: {
						is_enabled: true,
						are_permissions_mapped: true,
					},
					settings: {
						is_overwrite_enabled: true,
					},
				})
				.matchHeader('box-version', '2026.0')
				.reply(201, job)
		)
			.stdout()
			.command([
				'shuttle:jobs:create',
				'Q4 Migration',
				'--job-type=transfer',
				`--source-system-id=${systemId}`,
				'--account-mapping-enabled',
				'--are-permissions-mapped',
				'--is-overwrite-enabled',
				'--json',
				'--token=test',
			])
			.it('creates a shuttle job with camelCase→wire body', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), job);
			});
	});

	describe('shuttle:jobs:create --body', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/shuttle_jobs', {
					name: 'Body Job',
					job_type: 'transfer',
					source_system_id: systemId,
				})
				.matchHeader('box-version', '2026.0')
				.reply(201, { ...job, name: 'Body Job' })
		)
			.stdout()
			.command([
				'shuttle:jobs:create',
				'ignored-when-body-set',
				`--body={"name":"Body Job","job_type":"transfer","source_system_id":"${systemId}"}`,
				'--json',
				'--token=test',
			])
			.it('accepts snake_case --body and sends the wire payload', (context) => {
				assert.equal(JSON.parse(context.stdout).name, 'Body Job');
			});
	});

	describe('shuttle:jobs:update', function () {
		const updated = { ...job, name: 'Q4 Migration (revised)' };

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/shuttle_jobs/${jobId}`, {
					name: 'Q4 Migration (revised)',
				})
				.matchHeader('box-version', '2026.0')
				.reply(200, updated)
		)
			.stdout()
			.command([
				'shuttle:jobs:update',
				jobId,
				'--name=Q4 Migration (revised)',
				'--json',
				'--token=test',
			])
			.it('updates a shuttle job name', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), updated);
			});
	});

	describe('shuttle:jobs:delete', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.delete(`/2.0/shuttle_jobs/${jobId}`)
				.matchHeader('box-version', '2026.0')
				.reply(204)
		)
			.stderr()
			.command(['shuttle:jobs:delete', jobId, '--token=test'])
			.it('deletes a shuttle job', (context) => {
				assert.equal(context.stderr, `Deleted shuttle job ${jobId}${os.EOL}`);
			});
	});

	describe('shuttle:jobs:start', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post(`/2.0/shuttle_jobs/${jobId}/start`, {
					mode: 'transfer',
				})
				.matchHeader('box-version', '2026.0')
				.reply(204)
		)
			.stdout()
			.command([
				'shuttle:jobs:start',
				jobId,
				'--mode=transfer',
				'--token=test',
			])
			.it('starts a shuttle job run', (context) => {
				assert.equal(context.stdout, '');
			});
	});

	describe('shuttle:jobs:stop', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post(`/2.0/shuttle_jobs/${jobId}/stop`)
				.matchHeader('box-version', '2026.0')
				.reply(204)
		)
			.stdout()
			.command(['shuttle:jobs:stop', jobId, '--token=test'])
			.it('stops a shuttle job', (context) => {
				assert.equal(context.stdout, '');
			});
	});

	describe('shuttle:jobs:prepare-migration', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post(`/2.0/shuttle_jobs/${jobId}/prepare_migration`)
				.matchHeader('box-version', '2026.0')
				.reply(204)
		)
			.stdout()
			.command(['shuttle:jobs:prepare-migration', jobId, '--token=test'])
			.it('prepares a shuttle job for migration', (context) => {
				assert.equal(context.stdout, '');
			});
	});

	/* ------------------------------------------------------------------ */
	/* job schedules                                                      */
	/* ------------------------------------------------------------------ */

	describe('shuttle:job-schedules', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/shuttle_job_schedules')
				.query({ job_id: jobId, limit: 10 })
				.matchHeader('box-version', '2026.0')
				.reply(200, { entries: [schedule], limit: 10 })
		)
			.stdout()
			.command([
				'shuttle:job-schedules',
				`--job-id=${jobId}`,
				'--max-items=10',
				'--json',
				'--token=test',
			])
			.it('lists shuttle job schedules', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), [schedule]);
			});
	});

	describe('shuttle:job-schedules:get', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/shuttle_job_schedules/${scheduleId}`)
				.matchHeader('box-version', '2026.0')
				.reply(200, schedule)
		)
			.stdout()
			.command([
				'shuttle:job-schedules:get',
				scheduleId,
				'--json',
				'--token=test',
			])
			.it('gets a shuttle job schedule by id', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), schedule);
			});
	});

	describe('shuttle:job-schedules:create', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/shuttle_job_schedules', {
					job_id: jobId,
					run_mode: 'transfer',
					trigger: scheduleTrigger,
				})
				.matchHeader('box-version', '2026.0')
				.reply(201, schedule)
		)
			.stdout()
			.command([
				'shuttle:job-schedules:create',
				`--job-id=${jobId}`,
				'--run-mode=transfer',
				'--trigger-type=by_time',
				'--start-at=2026-03-16T09:00:00',
				'--time-zone=America/Los_Angeles',
				'--repeat=daily',
				'--json',
				'--token=test',
			])
			.it('creates a by_time job schedule from flat flags', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), schedule);
			});
	});

	describe('shuttle:job-schedules:update', function () {
		const updated = { ...schedule, state: 'paused' };

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/shuttle_job_schedules/${scheduleId}`, {
					state: 'paused',
				})
				.matchHeader('box-version', '2026.0')
				.reply(200, updated)
		)
			.stdout()
			.command([
				'shuttle:job-schedules:update',
				scheduleId,
				'--state=paused',
				'--json',
				'--token=test',
			])
			.it('updates a shuttle job schedule state', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), updated);
			});
	});

	describe('shuttle:job-schedules:delete', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.delete(`/2.0/shuttle_job_schedules/${scheduleId}`)
				.matchHeader('box-version', '2026.0')
				.reply(204)
		)
			.stderr()
			.command(['shuttle:job-schedules:delete', scheduleId, '--token=test'])
			.it('deletes a shuttle job schedule', (context) => {
				assert.equal(
					context.stderr,
					`Deleted shuttle job schedule ${scheduleId}${os.EOL}`
				);
			});
	});

	/* ------------------------------------------------------------------ */
	/* runs                                                               */
	/* ------------------------------------------------------------------ */

	describe('shuttle:runs', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/shuttle_runs')
				.query({ job_id: jobId, limit: 10 })
				.matchHeader('box-version', '2026.0')
				.reply(200, { entries: [run], limit: 10 })
		)
			.stdout()
			.command([
				'shuttle:runs',
				`--job-id=${jobId}`,
				'--max-items=10',
				'--json',
				'--token=test',
			])
			.it('lists shuttle runs', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), [run]);
			});
	});

	describe('shuttle:runs:get', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/shuttle_runs/${runId}`)
				.matchHeader('box-version', '2026.0')
				.reply(200, run)
		)
			.stdout()
			.command(['shuttle:runs:get', runId, '--json', '--token=test'])
			.it('gets a shuttle run by id', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), run);
			});
	});

	/* ------------------------------------------------------------------ */
	/* reports                                                            */
	/* ------------------------------------------------------------------ */

	describe('shuttle:reports', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/shuttle_reports')
				.query({ run_id: runId, limit: 10 })
				.matchHeader('box-version', '2026.0')
				.reply(200, { entries: [report], limit: 10 })
		)
			.stdout()
			.command([
				'shuttle:reports',
				`--run-id=${runId}`,
				'--max-items=10',
				'--json',
				'--token=test',
			])
			.it('lists shuttle reports', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), [report]);
			});
	});

	describe('shuttle:reports:get', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/shuttle_reports/${reportId}`)
				.matchHeader('box-version', '2026.0')
				.reply(200, report)
		)
			.stdout()
			.command(['shuttle:reports:get', reportId, '--json', '--token=test'])
			.it('gets a shuttle report by id', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), report);
			});
	});

	describe('shuttle:reports:create', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/shuttle_reports', {
					run_id: runId,
					format: 'xlsx',
					sections: ['event_log', 'transfer_overview'],
				})
				.matchHeader('box-version', '2026.0')
				.reply(201, report)
		)
			.stdout()
			.command([
				'shuttle:reports:create',
				`--run-id=${runId}`,
				'--format=xlsx',
				'--section=event_log',
				'--section=transfer_overview',
				'--json',
				'--token=test',
			])
			.it('creates a shuttle report', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), report);
			});
	});

	/* ------------------------------------------------------------------ */
	/* path mappings                                                      */
	/* ------------------------------------------------------------------ */

	describe('shuttle:path-mappings', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/shuttle_path_mappings')
				.query({ job_id: jobId, limit: 10 })
				.matchHeader('box-version', '2026.0')
				.reply(200, { entries: [pathMapping], limit: 10 })
		)
			.stdout()
			.command([
				'shuttle:path-mappings',
				`--job-id=${jobId}`,
				'--max-items=10',
				'--json',
				'--token=test',
			])
			.it('lists shuttle path mappings', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), [pathMapping]);
			});
	});

	describe('shuttle:path-mappings:get', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/shuttle_path_mappings/${pathMappingId}`)
				.matchHeader('box-version', '2026.0')
				.reply(200, pathMapping)
		)
			.stdout()
			.command([
				'shuttle:path-mappings:get',
				pathMappingId,
				'--json',
				'--token=test',
			])
			.it('gets a shuttle path mapping by id', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), pathMapping);
			});
	});

	describe('shuttle:path-mappings:create', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/shuttle_path_mappings', {
					job_id: jobId,
					source: {
						type: 'account',
						path: '/Finance',
						account: {
							email: 'admin@company.com',
						},
					},
					target: {
						type: 'account',
						path: '/HR Migration',
						account: {
							email: 'admin@company.box.com',
						},
					},
				})
				.matchHeader('box-version', '2026.0')
				.reply(201, pathMapping)
		)
			.stdout()
			.command([
				'shuttle:path-mappings:create',
				`--job-id=${jobId}`,
				'--source-type=account',
				'--source-path=/Finance',
				'--source-account-email=admin@company.com',
				'--target-type=account',
				'--target-path=/HR Migration',
				'--target-account-email=admin@company.box.com',
				'--json',
				'--token=test',
			])
			.it('creates a path mapping from flat flags', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), pathMapping);
			});
	});

	describe('shuttle:path-mappings:update', function () {
		const updated = { ...pathMapping, is_path_skipped: true, target: null };

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/shuttle_path_mappings/${pathMappingId}`, {
					is_path_skipped: true,
					target: null,
				})
				.matchHeader('box-version', '2026.0')
				.reply(200, updated)
		)
			.stdout()
			.command([
				'shuttle:path-mappings:update',
				pathMappingId,
				'--is-path-skipped',
				'--clear-target',
				'--json',
				'--token=test',
			])
			.it('updates a path mapping skip/clear-target', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), updated);
			});
	});

	describe('shuttle:path-mappings:delete', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.delete(`/2.0/shuttle_path_mappings/${pathMappingId}`)
				.matchHeader('box-version', '2026.0')
				.reply(204)
		)
			.stderr()
			.command(['shuttle:path-mappings:delete', pathMappingId, '--token=test'])
			.it('deletes a shuttle path mapping', (context) => {
				assert.equal(
					context.stderr,
					`Deleted shuttle path mapping ${pathMappingId}${os.EOL}`
				);
			});
	});

	describe('shuttle:path-mapping-imports:create', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/shuttle_path_mapping_imports', {
					job_id: jobId,
					file_id: fileId,
				})
				.matchHeader('box-version', '2026.0')
				.reply(204)
		)
			.stdout()
			.command([
				'shuttle:path-mapping-imports:create',
				`--job-id=${jobId}`,
				`--file-id=${fileId}`,
				'--token=test',
			])
			.it('starts a path-mapping spreadsheet import (no content)', (context) => {
				assert.equal(context.stdout, '');
			});
	});

	/* ------------------------------------------------------------------ */
	/* subject mappings                                                   */
	/* ------------------------------------------------------------------ */

	describe('shuttle:subject-mappings', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/shuttle_subject_mappings')
				.query({ job_id: jobId, limit: 10 })
				.matchHeader('box-version', '2026.0')
				.reply(200, { entries: [subjectMapping], limit: 10 })
		)
			.stdout()
			.command([
				'shuttle:subject-mappings',
				`--job-id=${jobId}`,
				'--max-items=10',
				'--json',
				'--token=test',
			])
			.it('lists shuttle subject mappings', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), [subjectMapping]);
			});
	});

	describe('shuttle:subject-mappings:get', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/shuttle_subject_mappings/${subjectMappingId}`)
				.matchHeader('box-version', '2026.0')
				.reply(200, subjectMapping)
		)
			.stdout()
			.command([
				'shuttle:subject-mappings:get',
				subjectMappingId,
				'--json',
				'--token=test',
			])
			.it('gets a shuttle subject mapping by id', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), subjectMapping);
			});
	});

	describe('shuttle:subject-mappings:create', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/shuttle_subject_mappings', {
					job_id: jobId,
					discovered_subject_id: discoveredSubjectId,
					target: {
						type: 'user',
						id: '12345678',
					},
				})
				.matchHeader('box-version', '2026.0')
				.reply(201, subjectMapping)
		)
			.stdout()
			.command([
				'shuttle:subject-mappings:create',
				`--job-id=${jobId}`,
				`--discovered-subject-id=${discoveredSubjectId}`,
				'--target-type=user',
				'--target-id=12345678',
				'--json',
				'--token=test',
			])
			.it('creates a subject mapping from flat flags', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), subjectMapping);
			});
	});

	describe('shuttle:subject-mappings:update', function () {
		const updated = {
			...subjectMapping,
			is_subject_skipped: true,
			target: null,
		};

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/shuttle_subject_mappings/${subjectMappingId}`, {
					is_subject_skipped: true,
					target: null,
				})
				.matchHeader('box-version', '2026.0')
				.reply(200, updated)
		)
			.stdout()
			.command([
				'shuttle:subject-mappings:update',
				subjectMappingId,
				'--is-subject-skipped',
				'--clear-target',
				'--json',
				'--token=test',
			])
			.it('updates a subject mapping skip/clear-target', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), updated);
			});
	});

	describe('shuttle:subject-mappings:delete', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.delete(`/2.0/shuttle_subject_mappings/${subjectMappingId}`)
				.matchHeader('box-version', '2026.0')
				.reply(204)
		)
			.stderr()
			.command([
				'shuttle:subject-mappings:delete',
				subjectMappingId,
				'--token=test',
			])
			.it('deletes a shuttle subject mapping', (context) => {
				assert.equal(
					context.stderr,
					`Deleted shuttle subject mapping ${subjectMappingId}${os.EOL}`
				);
			});
	});

	describe('shuttle:subject-mapping-imports:create', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/shuttle_subject_mapping_imports', {
					job_id: jobId,
					file_id: fileId,
				})
				.matchHeader('box-version', '2026.0')
				.reply(204)
		)
			.stdout()
			.command([
				'shuttle:subject-mapping-imports:create',
				`--job-id=${jobId}`,
				`--file-id=${fileId}`,
				'--token=test',
			])
			.it(
				'starts a subject-mapping spreadsheet import (no content)',
				(context) => {
					assert.equal(context.stdout, '');
				}
			);
	});

	/* ------------------------------------------------------------------ */
	/* browse / errors / discovered                                       */
	/* ------------------------------------------------------------------ */

	describe('shuttle:path-entries', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/shuttle_path_entries')
				.query({
					job_id: jobId,
					side: 'source',
					limit: 100,
				})
				.matchHeader('box-version', '2026.0')
				.reply(200, pathEntries)
		)
			.stdout()
			.command([
				'shuttle:path-entries',
				`--job-id=${jobId}`,
				'--side=source',
				'--max-items=100',
				'--json',
				'--token=test',
			])
			.it('lists path entries with camelCase query params', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), pathEntries.entries);
			});
	});

	describe('shuttle:mapping-errors', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/shuttle_mapping_errors')
				.query({ job_id: jobId, limit: 10 })
				.matchHeader('box-version', '2026.0')
				.reply(200, { entries: [mappingError], limit: 10 })
		)
			.stdout()
			.command([
				'shuttle:mapping-errors',
				`--job-id=${jobId}`,
				'--max-items=10',
				'--json',
				'--token=test',
			])
			.it('lists shuttle mapping errors', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), [mappingError]);
			});
	});

	describe('shuttle:discovered-subjects', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/shuttle_discovered_subjects')
				.query({ job_id: jobId, limit: 10 })
				.matchHeader('box-version', '2026.0')
				.reply(200, { entries: [discoveredSubject], limit: 10 })
		)
			.stdout()
			.command([
				'shuttle:discovered-subjects',
				`--job-id=${jobId}`,
				'--max-items=10',
				'--json',
				'--token=test',
			])
			.it('lists discovered subjects', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), [discoveredSubject]);
			});
	});
});
