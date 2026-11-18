'use strict';

const assert = require('chai').assert;
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const shuttle = require('../../src/modules/shuttle');

describe('Shuttle module helpers', function () {
	describe('snakeToCamel', function () {
		it('converts nested snake_case keys to camelCase', function () {
			assert.deepEqual(
				shuttle.snakeToCamel({
					job_id: 'j1',
					account_mapping: {
						is_enabled: true,
						permission_conflict_strategy: 'warn_permissions_conflicts',
					},
					tags: ['a', 'b'],
				}),
				{
					jobId: 'j1',
					accountMapping: {
						isEnabled: true,
						permissionConflictStrategy: 'warn_permissions_conflicts',
					},
					tags: ['a', 'b'],
				}
			);
		});

		it('leaves camelCase keys unchanged', function () {
			assert.deepEqual(shuttle.snakeToCamel({ jobId: 'j1' }), {
				jobId: 'j1',
			});
		});
	});

	describe('resolveBody', function () {
		it('prefers --body JSON and converts snake_case', function () {
			const body = shuttle.resolveBody(
				{ body: '{"job_id":"abc","job_type":"transfer"}' },
				() => {
					throw new Error('builder should not run');
				}
			);
			assert.deepEqual(body, { jobId: 'abc', jobType: 'transfer' });
		});

		it('reads --body-file and converts snake_case', function () {
			const filePath = path.join(os.tmpdir(), `boxcli-shuttle-body-${Date.now()}.json`);
			fs.writeFileSync(
				filePath,
				JSON.stringify({ source_system_id: 'sys1', name: 'Job' })
			);
			try {
				const body = shuttle.resolveBody({ 'body-file': filePath }, () => {
					throw new Error('builder should not run');
				});
				assert.deepEqual(body, {
					sourceSystemId: 'sys1',
					name: 'Job',
				});
			} finally {
				fs.unlinkSync(filePath);
			}
		});

		it('uses flag builder when no body override is set', function () {
			const body = shuttle.resolveBody({}, () => ({ jobType: 'analysis' }));
			assert.deepEqual(body, { jobType: 'analysis' });
		});

		it('rejects non-object --body', function () {
			assert.throws(
				() => shuttle.resolveBody({ body: '[1,2]' }, () => ({})),
				/--body must be a JSON object/
			);
		});
	});

	describe('buildPathLocation', function () {
		it('builds an account location with camelCase fields', function () {
			const location = shuttle.buildPathLocation(
				{
					'source-type': 'account',
					'source-path': '/Finance',
					'source-path-id': 'pid',
					'source-account-email': 'a@b.com',
					'source-is-directory': true,
				},
				'source',
				{ allowIsDirectory: true }
			);
			assert.deepEqual(location, {
				type: 'account',
				path: '/Finance',
				pathId: 'pid',
				isDirectory: true,
				account: { email: 'a@b.com' },
			});
		});

		it('builds a shared_space location', function () {
			const location = shuttle.buildPathLocation(
				{
					'target-type': 'shared_space',
					'target-path': '/Shared',
					'target-space': 'Team Drive',
				},
				'target'
			);
			assert.deepEqual(location, {
				type: 'shared_space',
				path: '/Shared',
				space: 'Team Drive',
			});
		});

		it('returns undefined when no location flags are set', function () {
			assert.isUndefined(shuttle.buildPathLocation({}, 'source'));
		});

		it('errors when required location flags are incomplete', function () {
			const errors = [];
			assert.throws(
				() =>
					shuttle.buildPathLocation(
						{ 'source-type': 'account' },
						'source',
						{
							command: {
								error(message) {
									errors.push(message);
									throw new Error(message);
								},
							},
						}
					),
				/--source-type and --source-path are required/
			);
			assert.lengthOf(errors, 1);
		});
	});

	describe('buildSubjectTarget', function () {
		it('builds a target', function () {
			assert.deepEqual(
				shuttle.buildSubjectTarget({
					'target-type': 'user',
					'target-id': '123',
				}),
				{ type: 'user', id: '123' }
			);
		});

		it('returns null for --clear-target', function () {
			assert.isNull(
				shuttle.buildSubjectTarget({ 'clear-target': true })
			);
		});

		it('returns undefined when target flags are omitted', function () {
			assert.isUndefined(shuttle.buildSubjectTarget({}));
		});
	});

	describe('buildScheduleTrigger', function () {
		it('builds a by_time trigger', function () {
			assert.deepEqual(
				shuttle.buildScheduleTrigger({
					'trigger-type': 'by_time',
					'start-at': '2026-03-16T09:00:00',
					'time-zone': 'America/Los_Angeles',
					repeat: 'daily',
				}),
				{
					type: 'by_time',
					startAt: '2026-03-16T09:00:00',
					timeZone: 'America/Los_Angeles',
					repeat: 'daily',
				}
			);
		});

		it('builds a by_job trigger', function () {
			assert.deepEqual(
				shuttle.buildScheduleTrigger({
					'trigger-type': 'by_job',
					'triggered-by-job-id': 'job2',
					'last-run-condition': 'on_success',
				}),
				{
					type: 'by_job',
					triggeredByJobId: 'job2',
					lastRunCondition: 'on_success',
				}
			);
		});
	});

	describe('buildAccountMapping / buildSettings', function () {
		it('builds account mapping in camelCase', function () {
			assert.deepEqual(
				shuttle.buildAccountMapping({
					'account-mapping-enabled': true,
					'permission-conflict-strategy':
						'warn_permissions_conflicts',
					'are-permissions-mapped': false,
				}),
				{
					isEnabled: true,
					permissionConflictStrategy: 'warn_permissions_conflicts',
					arePermissionsMapped: false,
				}
			);
		});

		it('builds settings in camelCase', function () {
			assert.deepEqual(
				shuttle.buildSettings({
					'is-overwrite-enabled': true,
					'bandwidth-limit-bytes-per-sec': 1000,
				}),
				{
					isOverwriteEnabled: true,
					bandwidthLimitBytesPerSec: 1000,
				}
			);
		});

		it('returns undefined when no related flags are set', function () {
			assert.isUndefined(shuttle.buildAccountMapping({}));
			assert.isUndefined(shuttle.buildSettings({}));
		});
	});

	describe('flag bundles', function () {
		it('exports expected flag groups', function () {
			assert.property(shuttle.bodyFlags, 'body');
			assert.property(shuttle.bodyFlags, 'body-file');
			assert.property(shuttle.jobAccountMappingFlags, 'account-mapping-enabled');
			assert.property(shuttle.jobSettingsFlags, 'is-overwrite-enabled');
			assert.property(shuttle.scheduleTriggerFlags, 'trigger-type');
			assert.property(shuttle.subjectTargetFlags, 'target-type');
			assert.property(
				shuttle.pathLocationFlags('source', { allowIsDirectory: true }),
				'source-is-directory'
			);
		});
	});

	describe('official box-node-sdk ShuttleManager', function () {
		it('exposes all V2026R0 methods used by CLI commands', function () {
			const {
				BoxClient,
				BoxDeveloperTokenAuth,
			} = require('box-node-sdk/sdk-gen');
			const client = new BoxClient({
				auth: new BoxDeveloperTokenAuth({ token: 'test' }),
			});
			assert.ok(client.shuttle, 'BoxClient.shuttle should exist on 4.19+');

			const expected = [
				'createShuttleSystemV2026R0',
				'getShuttleSystemsV2026R0',
				'getShuttleSystemByIdV2026R0',
				'updateShuttleSystemByIdV2026R0',
				'deleteShuttleSystemByIdV2026R0',
				'createShuttleSystemIssueRegistrationTokenV2026R0',
				'createShuttleJobV2026R0',
				'getShuttleJobsV2026R0',
				'getShuttleJobByIdV2026R0',
				'updateShuttleJobByIdV2026R0',
				'deleteShuttleJobByIdV2026R0',
				'createShuttleJobStartV2026R0',
				'createShuttleJobStopV2026R0',
				'createShuttleJobPrepareMigrationV2026R0',
				'createShuttleJobScheduleV2026R0',
				'getShuttleJobSchedulesV2026R0',
				'getShuttleJobScheduleByIdV2026R0',
				'updateShuttleJobScheduleByIdV2026R0',
				'deleteShuttleJobScheduleByIdV2026R0',
				'getShuttleRunsV2026R0',
				'getShuttleRunByIdV2026R0',
				'createShuttleReportV2026R0',
				'getShuttleReportsV2026R0',
				'getShuttleReportByIdV2026R0',
				'createShuttlePathMappingV2026R0',
				'getShuttlePathMappingsV2026R0',
				'getShuttlePathMappingByIdV2026R0',
				'updateShuttlePathMappingByIdV2026R0',
				'deleteShuttlePathMappingByIdV2026R0',
				'createShuttlePathMappingImportV2026R0',
				'createShuttleSubjectMappingV2026R0',
				'getShuttleSubjectMappingsV2026R0',
				'getShuttleSubjectMappingByIdV2026R0',
				'updateShuttleSubjectMappingByIdV2026R0',
				'deleteShuttleSubjectMappingByIdV2026R0',
				'createShuttleSubjectMappingImportV2026R0',
				'getShuttlePathEntriesV2026R0',
				'getShuttleMappingErrorsV2026R0',
				'getShuttleDiscoveredSubjectsV2026R0',
			];

			for (const method of expected) {
				assert.isFunction(
					client.shuttle[method],
					`missing ShuttleManager.${method}`
				);
			}
			assert.lengthOf(expected, 39);
		});
	});
});
