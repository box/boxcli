'use strict';

const { test } = require('@oclif/test');
const { assert } = require('chai');
const os = require('node:os');
const { TEST_API_ROOT, getFixture } = require('../helpers/test-helper');

const JOB_ID = '6a3ba68e810d9156194530a1';
const OTHER_JOB_ID = '6a3ba68e810d9156194530a2';
const SCHEDULE_ID = '7c1ba68e810d9156194530b2';
const SYSTEM_ID = '6a315c0754833bfc5df067bf';
const PATH_MAPPING_ID = '6a3ba7a24ea17bc9461eeacd';
const SUBJECT_MAPPING_ID = '6a3ba7a24ea17bc9461eeace';
const DISCOVERED_SUBJECT_ID = '6a3ba7a24ea17bc9461eeacf';
const REPORT_ID = '6a3ba8d14f2c91e8370b4d12';
const RUN_ID = '6a3ba68e810d9156194530a1:42';
const RUN_PATH = /^\/2\.0\/shuttle_runs\/6a3ba68e810d9156194530a1(:|%3A)42$/;

function isEmptyBody(body) {
	return !body || Object.keys(body).length === 0;
}

describe('Shuttle', function () {
	describe('shuttle:jobs', function () {
		const response = JSON.parse(getFixture('shuttle/get_shuttle_jobs'));

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/shuttle_jobs')
				.query({ limit: 10 })
				.reply(200, response)
		)
			.stdout()
			.command(['shuttle:jobs', '--max-items=10', '--json', '--token=test'])
			.it('lists shuttle jobs', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response.entries);
			});
	});

	describe('shuttle:jobs:get', function () {
		const response = JSON.parse(getFixture('shuttle/get_shuttle_jobs_id'));

		test.nock(TEST_API_ROOT, (api) =>
			api.get(`/2.0/shuttle_jobs/${JOB_ID}`).reply(200, response)
		)
			.stdout()
			.command(['shuttle:jobs:get', JOB_ID, '--json', '--token=test'])
			.it('gets a shuttle job by ID', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response);
			});
	});

	describe('shuttle:jobs:create', function () {
		const response = JSON.parse(getFixture('shuttle/post_shuttle_jobs'));

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/shuttle_jobs', {
					name: 'Finance migration',
					job_type: 'transfer',
					source_system_id: SYSTEM_ID,
					comment: 'Move the finance share',
					tags: ['finance', 'q3'],
					account_mapping: {
						is_enabled: true,
						permission_conflict_strategy:
							'warn_permissions_conflicts',
						are_external_shares_mapped: false,
						are_permissions_mapped: true,
					},
					settings: {
						bandwidth_limit_bytes_per_sec: 1_048_576,
						are_deletions_mirrored: true,
						are_file_versions_synced: true,
						max_file_versions: 10,
						is_overwrite_enabled: false,
						are_completed_mappings_skipped_on_rerun: true,
						is_content_scanning_enabled: false,
						include_shared_source_folders: true,
						include_shared_destination_folders: false,
					},
				})
				.reply(201, response)
		)
			.stdout()
			.command([
				'shuttle:jobs:create',
				'Finance migration',
				'--job-type=transfer',
				`--source-system-id=${SYSTEM_ID}`,
				'--comment=Move the finance share',
				'--tag=finance',
				'--tag=q3',
				'--account-mapping-enabled',
				'--permission-conflict-strategy=warn_permissions_conflicts',
				'--no-external-shares-mapped',
				'--permissions-mapped',
				'--bandwidth-limit-bytes-per-sec=1048576',
				'--deletions-mirrored',
				'--file-versions-synced',
				'--max-file-versions=10',
				'--no-overwrite-enabled',
				'--completed-mappings-skipped-on-rerun',
				'--no-content-scanning-enabled',
				'--include-shared-source-folders',
				'--no-include-shared-destination-folders',
				'--json',
				'--token=test',
			])
			.it(
				'creates a shuttle job with account mapping and settings',
				(context) => {
					assert.deepEqual(JSON.parse(context.stdout), response);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/shuttle_jobs', {
					name: 'Finance migration',
					job_type: 'analysis',
					source_system_id: SYSTEM_ID,
				})
				.reply(201, response)
		)
			.stdout()
			.command([
				'shuttle:jobs:create',
				'Finance migration',
				'--job-type=analysis',
				`--source-system-id=${SYSTEM_ID}`,
				'--json',
				'--token=test',
			])
			.it(
				'creates a shuttle job with only required fields',
				(context) => {
					assert.deepEqual(JSON.parse(context.stdout), response);
				}
			);

		test.stderr()
			.command([
				'shuttle:jobs:create',
				'Finance migration',
				'--job-type=sync',
				`--source-system-id=${SYSTEM_ID}`,
				'--token=test',
			])
			.it('rejects unsupported job types', (context) => {
				assert.include(
					context.stderr,
					'Expected --job-type=sync to be one of: transfer, analysis'
				);
			});

		test.stderr()
			.command([
				'shuttle:jobs:create',
				'Finance migration',
				'--job-type=transfer',
				`--source-system-id=${SYSTEM_ID}`,
				'--permission-conflict-strategy=ignore',
				'--token=test',
			])
			.it(
				'rejects unsupported permission conflict strategies',
				(context) => {
					assert.include(
						context.stderr,
						'Expected --permission-conflict-strategy=ignore to be one of: preserve_structure_restrict_sharing, preserve_structure_expand_sharing, preserve_sharing_modify_structure, warn_permissions_conflicts'
					);
				}
			);
	});

	describe('shuttle:jobs:update', function () {
		const response = JSON.parse(getFixture('shuttle/put_shuttle_jobs_id'));

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/shuttle_jobs/${JOB_ID}`, {
					name: 'Finance migration v2',
					comment: null,
					tags: ['finance', 'q3'],
					account_mapping: {
						permission_conflict_strategy: null,
					},
					settings: {
						bandwidth_limit_bytes_per_sec: null,
						are_deletions_mirrored: false,
						max_file_versions: null,
					},
				})
				.reply(200, response)
		)
			.stdout()
			.command([
				'shuttle:jobs:update',
				JOB_ID,
				'--name=Finance migration v2',
				'--clear-comment',
				'--tag=finance',
				'--tag=q3',
				'--clear-permission-conflict-strategy',
				'--clear-bandwidth-limit-bytes-per-sec',
				'--no-deletions-mirrored',
				'--clear-max-file-versions',
				'--json',
				'--token=test',
			])
			.it(
				'updates a shuttle job and clears nullable fields',
				(context) => {
					assert.deepEqual(JSON.parse(context.stdout), response);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/shuttle_jobs/${JOB_ID}`, {
					comment: 'Second wave',
					account_mapping: {
						is_enabled: false,
						permission_conflict_strategy:
							'preserve_structure_expand_sharing',
					},
				})
				.reply(200, response)
		)
			.stdout()
			.command([
				'shuttle:jobs:update',
				JOB_ID,
				'--comment=Second wave',
				'--no-account-mapping-enabled',
				'--permission-conflict-strategy=preserve_structure_expand_sharing',
				'--json',
				'--token=test',
			])
			.it(
				'updates the comment and account mapping of a shuttle job',
				(context) => {
					assert.deepEqual(JSON.parse(context.stdout), response);
				}
			);

		test.stderr()
			.command(['shuttle:jobs:update', JOB_ID, '--token=test'])
			.it('requires at least one update flag', (context) => {
				assert.include(
					context.stderr,
					'Please provide at least one update flag.'
				);
			});
	});

	describe('shuttle:jobs:delete', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api.delete(`/2.0/shuttle_jobs/${JOB_ID}`).reply(204)
		)
			.stderr()
			.command(['shuttle:jobs:delete', JOB_ID, '--token=test'])
			.it('deletes a shuttle job by ID', (context) => {
				assert.equal(
					context.stderr,
					`Deleted shuttle job ${JOB_ID}${os.EOL}`
				);
			});
	});

	describe('shuttle:jobs:prepare-migration', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api.post(`/2.0/shuttle_jobs/${JOB_ID}/prepare_migration`).reply(202)
		)
			.stderr()
			.command(['shuttle:jobs:prepare-migration', JOB_ID, '--token=test'])
			.it('requests migration preparation of a shuttle job', (context) => {
				assert.equal(
					context.stderr,
					`Accepted prepare migration of shuttle job ${JOB_ID}${os.EOL}`
				);
			});
	});

	describe('shuttle:jobs:start', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api.post(`/2.0/shuttle_jobs/${JOB_ID}/start`, isEmptyBody).reply(202)
		)
			.stderr()
			.command(['shuttle:jobs:start', JOB_ID, '--token=test'])
			.it('starts a shuttle job without a body', (context) => {
				assert.equal(
					context.stderr,
					`Accepted start of shuttle job ${JOB_ID}${os.EOL}`
				);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post(`/2.0/shuttle_jobs/${JOB_ID}/start`, { mode: 'transfer' })
				.reply(202)
		)
			.stderr()
			.command([
				'shuttle:jobs:start',
				JOB_ID,
				'--mode=transfer',
				'--token=test',
			])
			.it('starts a shuttle job in the given mode', (context) => {
				assert.equal(
					context.stderr,
					`Accepted start of shuttle job ${JOB_ID}${os.EOL}`
				);
			});

		test.stderr()
			.command([
				'shuttle:jobs:start',
				JOB_ID,
				'--mode=dry_run',
				'--token=test',
			])
			.it('rejects unsupported run modes', (context) => {
				assert.include(
					context.stderr,
					'Expected --mode=dry_run to be one of: transfer, simulation, scan, analysis'
				);
			});
	});

	describe('shuttle:jobs:stop', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api.post(`/2.0/shuttle_jobs/${JOB_ID}/stop`).reply(202)
		)
			.stderr()
			.command(['shuttle:jobs:stop', JOB_ID, '--token=test'])
			.it('stops a shuttle job', (context) => {
				assert.equal(
					context.stderr,
					`Accepted stop of shuttle job ${JOB_ID}${os.EOL}`
				);
			});
	});

	describe('shuttle:job-schedules', function () {
		const response = JSON.parse(
			getFixture('shuttle/get_shuttle_job_schedules')
		);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/shuttle_job_schedules')
				.query({ job_id: JOB_ID, limit: 1000 })
				.reply(200, response)
		)
			.stdout()
			.command([
				'shuttle:job-schedules',
				`--job-id=${JOB_ID}`,
				'--json',
				'--token=test',
			])
			.it('lists the schedules of a shuttle job', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response.entries);
			});
	});

	describe('shuttle:job-schedules:get', function () {
		const response = JSON.parse(
			getFixture('shuttle/get_shuttle_job_schedules_id')
		);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/shuttle_job_schedules/${SCHEDULE_ID}`)
				.reply(200, response)
		)
			.stdout()
			.command([
				'shuttle:job-schedules:get',
				SCHEDULE_ID,
				'--json',
				'--token=test',
			])
			.it('gets a shuttle job schedule by ID', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response);
			});
	});

	describe('shuttle:job-schedules:create', function () {
		const response = JSON.parse(
			getFixture('shuttle/post_shuttle_job_schedules')
		);
		const byJobResponse = JSON.parse(
			getFixture('shuttle/put_shuttle_job_schedules_id')
		);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/shuttle_job_schedules', {
					job_id: JOB_ID,
					run_mode: 'transfer',
					state: 'paused',
					description: 'Nightly transfer',
					trigger: {
						type: 'by_time',
						start_at: '2030-01-01T09:00:00',
						time_zone: 'America/Los_Angeles',
						repeat: 'daily',
					},
				})
				.reply(201, response)
		)
			.stdout()
			.command([
				'shuttle:job-schedules:create',
				`--job-id=${JOB_ID}`,
				'--run-mode=transfer',
				'--state=paused',
				'--description=Nightly transfer',
				'--trigger-type=by_time',
				'--start-at=2030-01-01T09:00:00',
				'--time-zone=America/Los_Angeles',
				'--repeat=daily',
				'--json',
				'--token=test',
			])
			.it('creates a schedule triggered by time', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/shuttle_job_schedules', {
					job_id: JOB_ID,
					run_mode: 'simulation',
					trigger: {
						type: 'by_job',
						triggered_by_job_id: OTHER_JOB_ID,
						last_run_condition: 'on_success',
					},
				})
				.reply(201, byJobResponse)
		)
			.stdout()
			.command([
				'shuttle:job-schedules:create',
				`--job-id=${JOB_ID}`,
				'--run-mode=simulation',
				'--trigger-type=by_job',
				`--triggered-by-job-id=${OTHER_JOB_ID}`,
				'--last-run-condition=on_success',
				'--json',
				'--token=test',
			])
			.it('creates a schedule triggered by another job', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), byJobResponse);
			});

		test.stderr()
			.command([
				'shuttle:job-schedules:create',
				`--job-id=${JOB_ID}`,
				'--run-mode=transfer',
				'--trigger-type=by_time',
				'--start-at=2030-01-01T09:00:00',
				'--time-zone=America/Los_Angeles',
				'--token=test',
			])
			.it('requires all flags of the chosen trigger type', (context) => {
				assert.include(
					context.stderr,
					'--trigger-type=by_time requires --repeat.'
				);
			});

		test.stderr()
			.command([
				'shuttle:job-schedules:create',
				`--job-id=${JOB_ID}`,
				'--run-mode=transfer',
				'--trigger-type=by_time',
				'--start-at=2030-01-01T09:00:00',
				'--time-zone=America/Los_Angeles',
				'--repeat=daily',
				`--triggered-by-job-id=${OTHER_JOB_ID}`,
				'--token=test',
			])
			.it('refuses flags of another trigger type', (context) => {
				assert.include(
					context.stderr,
					'--triggered-by-job-id cannot be used with --trigger-type=by_time.'
				);
			});

		test.stderr()
			.command([
				'shuttle:job-schedules:create',
				`--job-id=${JOB_ID}`,
				'--run-mode=scan',
				'--trigger-type=by_job',
				`--triggered-by-job-id=${OTHER_JOB_ID}`,
				'--last-run-condition=always',
				'--token=test',
			])
			.it('rejects unsupported schedule run modes', (context) => {
				assert.include(
					context.stderr,
					'Expected --run-mode=scan to be one of: transfer, simulation, analysis'
				);
			});

		test.stderr()
			.command([
				'shuttle:job-schedules:create',
				`--job-id=${JOB_ID}`,
				'--run-mode=transfer',
				'--state=stopped',
				'--trigger-type=by_job',
				`--triggered-by-job-id=${OTHER_JOB_ID}`,
				'--last-run-condition=always',
				'--token=test',
			])
			.it('rejects unsupported schedule states', (context) => {
				assert.include(
					context.stderr,
					'Expected --state=stopped to be one of: enabled, paused'
				);
			});

		test.stderr()
			.command([
				'shuttle:job-schedules:create',
				`--job-id=${JOB_ID}`,
				'--run-mode=transfer',
				'--trigger-type=by_event',
				'--token=test',
			])
			.it('rejects unsupported trigger types', (context) => {
				assert.include(
					context.stderr,
					'Expected --trigger-type=by_event to be one of: by_time, by_job'
				);
			});

		test.stderr()
			.command([
				'shuttle:job-schedules:create',
				`--job-id=${JOB_ID}`,
				'--run-mode=transfer',
				'--trigger-type=by_time',
				'--start-at=2030-01-01T09:00:00',
				'--time-zone=America/Los_Angeles',
				'--repeat=monthly',
				'--token=test',
			])
			.it('rejects unsupported repeat values', (context) => {
				assert.include(
					context.stderr,
					'Expected --repeat=monthly to be one of: none, daily, weekly, weekdays, weekends'
				);
			});

		test.stderr()
			.command([
				'shuttle:job-schedules:create',
				`--job-id=${JOB_ID}`,
				'--run-mode=transfer',
				'--trigger-type=by_job',
				`--triggered-by-job-id=${OTHER_JOB_ID}`,
				'--last-run-condition=on_failure',
				'--token=test',
			])
			.it('rejects unsupported last run conditions', (context) => {
				assert.include(
					context.stderr,
					'Expected --last-run-condition=on_failure to be one of: always, on_success, on_finish'
				);
			});
	});

	describe('shuttle:job-schedules:update', function () {
		const response = JSON.parse(
			getFixture('shuttle/put_shuttle_job_schedules_id')
		);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/shuttle_job_schedules/${SCHEDULE_ID}`, {
					run_mode: 'simulation',
					description: null,
					trigger: {
						type: 'by_job',
						triggered_by_job_id: OTHER_JOB_ID,
						last_run_condition: 'on_success',
					},
				})
				.reply(200, response)
		)
			.stdout()
			.command([
				'shuttle:job-schedules:update',
				SCHEDULE_ID,
				'--run-mode=simulation',
				'--clear-description',
				'--trigger-type=by_job',
				`--triggered-by-job-id=${OTHER_JOB_ID}`,
				'--last-run-condition=on_success',
				'--json',
				'--token=test',
			])
			.it('updates a schedule and replaces its trigger', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/shuttle_job_schedules/${SCHEDULE_ID}`, {
					state: 'paused',
					description: 'Weekend transfer',
				})
				.reply(200, response)
		)
			.stdout()
			.command([
				'shuttle:job-schedules:update',
				SCHEDULE_ID,
				'--state=paused',
				'--description=Weekend transfer',
				'--json',
				'--token=test',
			])
			.it('updates a schedule without sending a trigger', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response);
			});

		test.stderr()
			.command([
				'shuttle:job-schedules:update',
				SCHEDULE_ID,
				'--start-at=2030-01-01T09:00:00',
				'--token=test',
			])
			.it('requires --trigger-type for trigger flags', (context) => {
				assert.include(
					context.stderr,
					'--start-at requires --trigger-type.'
				);
			});

		test.stderr()
			.command([
				'shuttle:job-schedules:update',
				SCHEDULE_ID,
				'--token=test',
			])
			.it('requires at least one update flag', (context) => {
				assert.include(
					context.stderr,
					'Please provide at least one update flag.'
				);
			});
	});

	describe('shuttle:job-schedules:delete', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api.delete(`/2.0/shuttle_job_schedules/${SCHEDULE_ID}`).reply(204)
		)
			.stderr()
			.command([
				'shuttle:job-schedules:delete',
				SCHEDULE_ID,
				'--token=test',
			])
			.it('deletes a shuttle job schedule by ID', (context) => {
				assert.equal(
					context.stderr,
					`Deleted shuttle job schedule ${SCHEDULE_ID}${os.EOL}`
				);
			});
	});

	describe('shuttle:path-entries', function () {
		const response = JSON.parse(
			getFixture('shuttle/get_shuttle_path_entries')
		);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/shuttle_path_entries')
				.query({
					job_id: JOB_ID,
					side: 'source',
					path: '/finance',
					path_id: 'F-1001',
					account_email: 'user@example.com',
					limit: 1000,
				})
				.reply(200, response)
		)
			.stdout()
			.command([
				'shuttle:path-entries',
				`--job-id=${JOB_ID}`,
				'--side=source',
				'--path=/finance',
				'--path-id=F-1001',
				'--account-email=user@example.com',
				'--json',
				'--token=test',
			])
			.it('lists the path entries of a shuttle job', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response.entries);
			});

		test.stderr()
			.command([
				'shuttle:path-entries',
				`--job-id=${JOB_ID}`,
				'--side=both',
				'--token=test',
			])
			.it('rejects unsupported sides', (context) => {
				assert.include(
					context.stderr,
					'Expected --side=both to be one of: source, target'
				);
			});
	});

	describe('shuttle:path-mappings', function () {
		const response = JSON.parse(
			getFixture('shuttle/get_shuttle_path_mappings')
		);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/shuttle_path_mappings')
				.query({ job_id: JOB_ID, limit: 1000 })
				.reply(200, response)
		)
			.stdout()
			.command([
				'shuttle:path-mappings',
				`--job-id=${JOB_ID}`,
				'--json',
				'--token=test',
			])
			.it('lists the path mappings of a shuttle job', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response.entries);
			});
	});

	describe('shuttle:path-mappings:get', function () {
		const response = JSON.parse(
			getFixture('shuttle/get_shuttle_path_mappings_id')
		);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/shuttle_path_mappings/${PATH_MAPPING_ID}`)
				.reply(200, response)
		)
			.stdout()
			.command([
				'shuttle:path-mappings:get',
				PATH_MAPPING_ID,
				'--json',
				'--token=test',
			])
			.it('gets a shuttle path mapping by ID', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response);
			});
	});

	describe('shuttle:path-mappings:create', function () {
		const response = JSON.parse(
			getFixture('shuttle/post_shuttle_path_mappings')
		);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/shuttle_path_mappings', {
					job_id: JOB_ID,
					source: {
						type: 'account',
						path: '/finance',
						path_id: 'F-1001',
						account: { email: 'user@example.com' },
						is_directory: true,
					},
					target: {
						type: 'account',
						path: '/Finance',
						account: { id: '11111' },
					},
				})
				.reply(201, response)
		)
			.stdout()
			.command([
				'shuttle:path-mappings:create',
				`--job-id=${JOB_ID}`,
				'--source-type=account',
				'--source-path=/finance',
				'--source-path-id=F-1001',
				'--source-account-email=user@example.com',
				'--source-directory',
				'--target-type=account',
				'--target-path=/Finance',
				'--target-account-id=11111',
				'--json',
				'--token=test',
			])
			.it('creates an account path mapping', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/shuttle_path_mappings', {
					job_id: JOB_ID,
					is_path_skipped: true,
					source: {
						type: 'shared_space',
						space: 'Team Drive',
						path: '/archive',
					},
				})
				.reply(201, response)
		)
			.stdout()
			.command([
				'shuttle:path-mappings:create',
				`--job-id=${JOB_ID}`,
				'--source-type=shared_space',
				'--source-space=Team Drive',
				'--source-path=/archive',
				'--path-skipped',
				'--json',
				'--token=test',
			])
			.it(
				'creates a skipped shared space path mapping without a target',
				(context) => {
					assert.deepEqual(JSON.parse(context.stdout), response);
				}
			);

		test.stderr()
			.command([
				'shuttle:path-mappings:create',
				`--job-id=${JOB_ID}`,
				'--source-type=account',
				'--source-path=/finance',
				'--token=test',
			])
			.it(
				'requires an account ID or email for an account source',
				(context) => {
					assert.include(
						context.stderr,
						'--source-type=account requires --source-account-id or --source-account-email.'
					);
				}
			);

		test.stderr()
			.command([
				'shuttle:path-mappings:create',
				`--job-id=${JOB_ID}`,
				'--source-type=shared_space',
				'--source-space=Team Drive',
				'--token=test',
			])
			.it('requires a source path', (context) => {
				assert.include(
					context.stderr,
					'--source-type=shared_space requires --source-path.'
				);
			});

		test.stderr()
			.command([
				'shuttle:path-mappings:create',
				`--job-id=${JOB_ID}`,
				'--source-type=shared_space',
				'--source-path=/archive',
				'--target-type=account',
				'--target-path=/Archive',
				'--target-account-id=11111',
				'--target-space=Team Drive',
				'--token=test',
			])
			.it('refuses flags of another location type', (context) => {
				assert.include(
					context.stderr,
					'--target-space cannot be used with --target-type=account.'
				);
			});

		test.stderr()
			.command([
				'shuttle:path-mappings:create',
				`--job-id=${JOB_ID}`,
				'--source-type=shared_space',
				'--source-path=/archive',
				'--target-path=/Archive',
				'--token=test',
			])
			.it('requires --target-type for target flags', (context) => {
				assert.include(
					context.stderr,
					'--target-path requires --target-type.'
				);
			});

		test.stderr()
			.command([
				'shuttle:path-mappings:create',
				`--job-id=${JOB_ID}`,
				'--source-type=folder',
				'--source-path=/archive',
				'--token=test',
			])
			.it('rejects unsupported location types', (context) => {
				assert.include(
					context.stderr,
					'Expected --source-type=folder to be one of: account, shared_space'
				);
			});
	});

	describe('shuttle:path-mappings:update', function () {
		const response = JSON.parse(
			getFixture('shuttle/put_shuttle_path_mappings_id')
		);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/shuttle_path_mappings/${PATH_MAPPING_ID}`, {
					is_path_skipped: true,
					target: null,
				})
				.reply(200, response)
		)
			.stdout()
			.command([
				'shuttle:path-mappings:update',
				PATH_MAPPING_ID,
				'--path-skipped',
				'--clear-target',
				'--json',
				'--token=test',
			])
			.it('skips a path and clears its target', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/shuttle_path_mappings/${PATH_MAPPING_ID}`, {
					source: {
						type: 'shared_space',
						space: 'Team Drive',
						path: '/archive',
						is_directory: false,
					},
				})
				.reply(200, response)
		)
			.stdout()
			.command([
				'shuttle:path-mappings:update',
				PATH_MAPPING_ID,
				'--source-type=shared_space',
				'--source-space=Team Drive',
				'--source-path=/archive',
				'--no-source-directory',
				'--json',
				'--token=test',
			])
			.it('replaces the source of a path mapping', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response);
			});

		test.stderr()
			.command([
				'shuttle:path-mappings:update',
				PATH_MAPPING_ID,
				'--token=test',
			])
			.it('requires at least one update flag', (context) => {
				assert.include(
					context.stderr,
					'Please provide at least one update flag.'
				);
			});
	});

	describe('shuttle:path-mappings:delete', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.delete(`/2.0/shuttle_path_mappings/${PATH_MAPPING_ID}`)
				.reply(204)
		)
			.stderr()
			.command([
				'shuttle:path-mappings:delete',
				PATH_MAPPING_ID,
				'--token=test',
			])
			.it('deletes a shuttle path mapping by ID', (context) => {
				assert.equal(
					context.stderr,
					`Deleted shuttle path mapping ${PATH_MAPPING_ID}${os.EOL}`
				);
			});
	});

	describe('shuttle:path-mapping-imports:create', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/shuttle_path_mapping_imports', {
					job_id: JOB_ID,
					file_id: '12345',
				})
				.reply(202)
		)
			.stderr()
			.command([
				'shuttle:path-mapping-imports:create',
				`--job-id=${JOB_ID}`,
				'--file-id=12345',
				'--token=test',
			])
			.it('requests a path mapping import', (context) => {
				assert.equal(
					context.stderr,
					`Accepted path mapping import for shuttle job ${JOB_ID}${os.EOL}`
				);
			});
	});

	describe('shuttle:subject-mappings', function () {
		const response = JSON.parse(
			getFixture('shuttle/get_shuttle_subject_mappings')
		);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/shuttle_subject_mappings')
				.query({ job_id: JOB_ID, limit: 1000 })
				.reply(200, response)
		)
			.stdout()
			.command([
				'shuttle:subject-mappings',
				`--job-id=${JOB_ID}`,
				'--json',
				'--token=test',
			])
			.it('lists the subject mappings of a shuttle job', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response.entries);
			});
	});

	describe('shuttle:subject-mappings:get', function () {
		const response = JSON.parse(
			getFixture('shuttle/get_shuttle_subject_mappings_id')
		);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/shuttle_subject_mappings/${SUBJECT_MAPPING_ID}`)
				.reply(200, response)
		)
			.stdout()
			.command([
				'shuttle:subject-mappings:get',
				SUBJECT_MAPPING_ID,
				'--json',
				'--token=test',
			])
			.it('gets a shuttle subject mapping by ID', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response);
			});
	});

	describe('shuttle:subject-mappings:create', function () {
		const response = JSON.parse(
			getFixture('shuttle/post_shuttle_subject_mappings')
		);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/shuttle_subject_mappings', {
					job_id: JOB_ID,
					discovered_subject_id: DISCOVERED_SUBJECT_ID,
					revision: 3,
					target: { type: 'user', id: '11111' },
				})
				.reply(201, response)
		)
			.stdout()
			.command([
				'shuttle:subject-mappings:create',
				`--job-id=${JOB_ID}`,
				`--discovered-subject-id=${DISCOVERED_SUBJECT_ID}`,
				'--revision=3',
				'--target-type=user',
				'--target-id=11111',
				'--json',
				'--token=test',
			])
			.it('maps a discovered subject to a Box user', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/shuttle_subject_mappings', {
					job_id: JOB_ID,
					discovered_subject_id: DISCOVERED_SUBJECT_ID,
					is_subject_skipped: true,
				})
				.reply(201, response)
		)
			.stdout()
			.command([
				'shuttle:subject-mappings:create',
				`--job-id=${JOB_ID}`,
				`--discovered-subject-id=${DISCOVERED_SUBJECT_ID}`,
				'--subject-skipped',
				'--json',
				'--token=test',
			])
			.it(
				'creates a skipped subject mapping without a target',
				(context) => {
					assert.deepEqual(JSON.parse(context.stdout), response);
				}
			);

		test.stderr()
			.command([
				'shuttle:subject-mappings:create',
				`--job-id=${JOB_ID}`,
				`--discovered-subject-id=${DISCOVERED_SUBJECT_ID}`,
				'--target-id=11111',
				'--token=test',
			])
			.it('requires --target-type for --target-id', (context) => {
				assert.include(
					context.stderr,
					'--target-id requires --target-type.'
				);
			});

		test.stderr()
			.command([
				'shuttle:subject-mappings:create',
				`--job-id=${JOB_ID}`,
				`--discovered-subject-id=${DISCOVERED_SUBJECT_ID}`,
				'--target-type=user',
				'--token=test',
			])
			.it('requires --target-id for --target-type', (context) => {
				assert.include(
					context.stderr,
					'--target-type=user requires --target-id.'
				);
			});

		test.stderr()
			.command([
				'shuttle:subject-mappings:create',
				`--job-id=${JOB_ID}`,
				`--discovered-subject-id=${DISCOVERED_SUBJECT_ID}`,
				'--target-type=device',
				'--target-id=11111',
				'--token=test',
			])
			.it('rejects unsupported target types', (context) => {
				assert.include(
					context.stderr,
					'Expected --target-type=device to be one of: user, group'
				);
			});
	});

	describe('shuttle:subject-mappings:update', function () {
		const response = JSON.parse(
			getFixture('shuttle/put_shuttle_subject_mappings_id')
		);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/shuttle_subject_mappings/${SUBJECT_MAPPING_ID}`, {
					is_subject_skipped: true,
					target: null,
				})
				.reply(200, response)
		)
			.stdout()
			.command([
				'shuttle:subject-mappings:update',
				SUBJECT_MAPPING_ID,
				'--subject-skipped',
				'--clear-target',
				'--json',
				'--token=test',
			])
			.it('skips a subject and clears its target', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/shuttle_subject_mappings/${SUBJECT_MAPPING_ID}`, {
					target: { type: 'group', id: '22222' },
				})
				.reply(200, response)
		)
			.stdout()
			.command([
				'shuttle:subject-mappings:update',
				SUBJECT_MAPPING_ID,
				'--target-type=group',
				'--target-id=22222',
				'--json',
				'--token=test',
			])
			.it('maps a subject to a Box group', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response);
			});

		test.stderr()
			.command([
				'shuttle:subject-mappings:update',
				SUBJECT_MAPPING_ID,
				'--token=test',
			])
			.it('requires at least one update flag', (context) => {
				assert.include(
					context.stderr,
					'Please provide at least one update flag.'
				);
			});
	});

	describe('shuttle:subject-mappings:delete', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.delete(`/2.0/shuttle_subject_mappings/${SUBJECT_MAPPING_ID}`)
				.reply(204)
		)
			.stderr()
			.command([
				'shuttle:subject-mappings:delete',
				SUBJECT_MAPPING_ID,
				'--token=test',
			])
			.it('deletes a shuttle subject mapping by ID', (context) => {
				assert.equal(
					context.stderr,
					`Deleted shuttle subject mapping ${SUBJECT_MAPPING_ID}${os.EOL}`
				);
			});
	});

	describe('shuttle:subject-mapping-imports:create', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/shuttle_subject_mapping_imports', {
					job_id: JOB_ID,
					file_id: '12345',
				})
				.reply(202)
		)
			.stderr()
			.command([
				'shuttle:subject-mapping-imports:create',
				`--job-id=${JOB_ID}`,
				'--file-id=12345',
				'--token=test',
			])
			.it('requests a subject mapping import', (context) => {
				assert.equal(
					context.stderr,
					`Accepted subject mapping import for shuttle job ${JOB_ID}${os.EOL}`
				);
			});
	});

	describe('shuttle:discovered-subjects', function () {
		const response = JSON.parse(
			getFixture('shuttle/get_shuttle_discovered_subjects')
		);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/shuttle_discovered_subjects')
				.query({ job_id: JOB_ID, limit: 5 })
				.reply(200, response)
		)
			.stdout()
			.command([
				'shuttle:discovered-subjects',
				`--job-id=${JOB_ID}`,
				'--max-items=5',
				'--json',
				'--token=test',
			])
			.it('lists the discovered subjects of a shuttle job', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response.entries);
			});
	});

	describe('shuttle:mapping-errors', function () {
		const response = JSON.parse(
			getFixture('shuttle/get_shuttle_mapping_errors')
		);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/shuttle_mapping_errors')
				.query({ job_id: JOB_ID, limit: 1000 })
				.reply(200, response)
		)
			.stdout()
			.command([
				'shuttle:mapping-errors',
				`--job-id=${JOB_ID}`,
				'--json',
				'--token=test',
			])
			.it('lists the mapping errors of a shuttle job', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response.entries);
			});
	});

	describe('shuttle:runs', function () {
		const response = JSON.parse(getFixture('shuttle/get_shuttle_runs'));

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/shuttle_runs')
				.query({ job_id: JOB_ID, limit: 1000 })
				.reply(200, response)
		)
			.stdout()
			.command([
				'shuttle:runs',
				`--job-id=${JOB_ID}`,
				'--json',
				'--token=test',
			])
			.it('lists the runs of a shuttle job', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response.entries);
			});

		const firstPageEntries = Array.from({ length: 1000 }, (_, index) => ({
			id: `${JOB_ID}:${index + 1}`,
			type: 'shuttle_run',
			job_id: JOB_ID,
			run_mode: 'transfer',
			state: 'completed',
		}));
		const secondPageEntries = [
			{
				id: `${JOB_ID}:1001`,
				type: 'shuttle_run',
				job_id: JOB_ID,
				run_mode: 'transfer',
				state: 'completed',
			},
		];

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/shuttle_runs')
				.query({ job_id: JOB_ID, limit: 1000 })
				.reply(200, {
					entries: firstPageEntries,
					limit: 1000,
					next_marker: 'next-page',
				})
				.get('/2.0/shuttle_runs')
				.query({ job_id: JOB_ID, limit: 1, marker: 'next-page' })
				.reply(200, { entries: secondPageEntries, limit: 1 })
		)
			.stdout()
			.command([
				'shuttle:runs',
				`--job-id=${JOB_ID}`,
				'--max-items=1001',
				'--json',
				'--token=test',
			])
			.it('follows next_marker until max-items is reached', (context) => {
				const output = JSON.parse(context.stdout);
				assert.lengthOf(output, 1001);
				assert.equal(output[0].id, `${JOB_ID}:1`);
				assert.equal(output[1000].id, `${JOB_ID}:1001`);
			});
	});

	describe('shuttle:runs:get', function () {
		const response = JSON.parse(getFixture('shuttle/get_shuttle_runs_id'));

		test.nock(TEST_API_ROOT, (api) =>
			api.get(RUN_PATH).reply(200, response)
		)
			.stdout()
			.command(['shuttle:runs:get', RUN_ID, '--json', '--token=test'])
			.it('gets a shuttle run by ID', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response);
			});
	});

	describe('shuttle:reports', function () {
		const response = JSON.parse(getFixture('shuttle/get_shuttle_reports'));

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/shuttle_reports')
				.query({ run_id: RUN_ID, limit: 1000 })
				.reply(200, response)
		)
			.stdout()
			.command([
				'shuttle:reports',
				`--run-id=${RUN_ID}`,
				'--json',
				'--token=test',
			])
			.it('lists the reports of a shuttle run', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response.entries);
			});
	});

	describe('shuttle:reports:get', function () {
		const response = JSON.parse(
			getFixture('shuttle/get_shuttle_reports_id')
		);

		test.nock(TEST_API_ROOT, (api) =>
			api.get(`/2.0/shuttle_reports/${REPORT_ID}`).reply(200, response)
		)
			.stdout()
			.command([
				'shuttle:reports:get',
				REPORT_ID,
				'--json',
				'--token=test',
			])
			.it('gets a shuttle report by ID', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response);
			});
	});

	describe('shuttle:reports:create', function () {
		const response = JSON.parse(getFixture('shuttle/post_shuttle_reports'));

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/shuttle_reports', {
					run_id: RUN_ID,
					format: 'xlsx',
					sections: ['transfer_overview', 'files_and_folders'],
					users_scope: 'all',
				})
				.reply(202, response)
		)
			.stdout()
			.command([
				'shuttle:reports:create',
				`--run-id=${RUN_ID}`,
				'--format=xlsx',
				'--section=transfer_overview',
				'--section=files_and_folders',
				'--users-scope=all',
				'--json',
				'--token=test',
			])
			.it('requests a report for a shuttle run', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response);
			});

		test.stderr()
			.command([
				'shuttle:reports:create',
				`--run-id=${RUN_ID}`,
				'--format=pdf',
				'--section=transfer_overview',
				'--token=test',
			])
			.it('rejects unsupported report formats', (context) => {
				assert.include(
					context.stderr,
					'Expected --format=pdf to be one of: xlsx, csv'
				);
			});

		test.stderr()
			.command([
				'shuttle:reports:create',
				`--run-id=${RUN_ID}`,
				'--format=csv',
				'--section=transfer_overview',
				'--users-scope=active',
				'--token=test',
			])
			.it('rejects unsupported users scopes', (context) => {
				assert.include(
					context.stderr,
					'Expected --users-scope=active to be one of: migrated, all'
				);
			});
	});

	describe('shuttle:systems', function () {
		const response = JSON.parse(getFixture('shuttle/get_shuttle_systems'));

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get('/2.0/shuttle_systems')
				.query({ limit: 1000 })
				.reply(200, response)
		)
			.stdout()
			.command(['shuttle:systems', '--json', '--token=test'])
			.it('lists shuttle systems', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response.entries);
			});
	});

	describe('shuttle:systems:get', function () {
		const response = JSON.parse(
			getFixture('shuttle/get_shuttle_systems_id')
		);

		test.nock(TEST_API_ROOT, (api) =>
			api.get(`/2.0/shuttle_systems/${SYSTEM_ID}`).reply(200, response)
		)
			.stdout()
			.command([
				'shuttle:systems:get',
				SYSTEM_ID,
				'--json',
				'--token=test',
			])
			.it('gets a shuttle system by ID', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response);
			});
	});

	describe('shuttle:systems:create', function () {
		const response = JSON.parse(getFixture('shuttle/post_shuttle_systems'));

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/shuttle_systems', {
					name: 'Finance file server',
					system_type: 'windows',
				})
				.reply(201, response)
		)
			.stdout()
			.command([
				'shuttle:systems:create',
				'Finance file server',
				'--system-type=windows',
				'--json',
				'--token=test',
			])
			.it('creates a Windows shuttle system', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response);
			});

		test.stderr()
			.command([
				'shuttle:systems:create',
				'Finance file server',
				'--system-type=sharepoint',
				'--token=test',
			])
			.it('rejects unsupported system types', (context) => {
				assert.include(
					context.stderr,
					'Expected --system-type=sharepoint to be one of: windows'
				);
			});
	});

	describe('shuttle:systems:update', function () {
		const response = JSON.parse(
			getFixture('shuttle/put_shuttle_systems_id')
		);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(`/2.0/shuttle_systems/${SYSTEM_ID}`, {
					name: 'Finance file server 2',
				})
				.reply(200, response)
		)
			.stdout()
			.command([
				'shuttle:systems:update',
				SYSTEM_ID,
				'--name=Finance file server 2',
				'--json',
				'--token=test',
			])
			.it('renames a shuttle system', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response);
			});

		test.stderr()
			.command(['shuttle:systems:update', SYSTEM_ID, '--token=test'])
			.it('requires at least one update flag', (context) => {
				assert.include(
					context.stderr,
					'Please provide at least one update flag.'
				);
			});
	});

	describe('shuttle:systems:delete', function () {
		test.nock(TEST_API_ROOT, (api) =>
			api.delete(`/2.0/shuttle_systems/${SYSTEM_ID}`).reply(204)
		)
			.stderr()
			.command(['shuttle:systems:delete', SYSTEM_ID, '--token=test'])
			.it('deletes a shuttle system by ID', (context) => {
				assert.equal(
					context.stderr,
					`Deleted shuttle system ${SYSTEM_ID}${os.EOL}`
				);
			});
	});

	describe('shuttle:systems:issue-registration-token', function () {
		const response = JSON.parse(
			getFixture(
				'shuttle/post_shuttle_systems_id_issue_registration_token'
			)
		);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post(`/2.0/shuttle_systems/${SYSTEM_ID}/issue_registration_token`)
				.reply(200, response)
		)
			.stdout()
			.command([
				'shuttle:systems:issue-registration-token',
				SYSTEM_ID,
				'--json',
				'--token=test',
			])
			.it('issues a registration token for a shuttle system', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response);
			});
	});
});
