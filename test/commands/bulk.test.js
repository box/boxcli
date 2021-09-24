'use strict';

const { test } = require('@oclif/test');
const { assert } = require('chai');
const fs = require('fs-extra');
const path = require('path');
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('os');
const debug = require('debug');
const sinon = require('sinon');

describe('Bulk', () => {

	let boxItemId = '33333',
		login = 'steve.jobs@example.com',
		addCollaborationFixture1 = getFixture('bulk/post_collaborations_user_1'),
		addCollaborationFixture2 = getFixture('bulk/post_collaborations_user_2'),
		addCollaborationFixture3 = getFixture('bulk/post_collaborations_user_3'),
		jsonOutput = getFixture('output/bulk_output_json.txt');

	const sandbox = sinon.createSandbox();

	afterEach(() => {
		sandbox.verifyAndRestore();
	});

	describe('CSV Input', () => {
		let inputFilePath = path.join(__dirname, '..', 'fixtures/bulk/input.csv'),
			saveFilePath = path.join(__dirname, '..', 'fixtures/bulk/saveTest.txt'),
			csvOutput = getFixture('bulk/post_collaborations_csv.csv'),
			multipleFlagValuesInputFilePath = path.join(__dirname, '../fixtures/bulk/input_multiple_same_flag.csv'),
			emptyStringInputFilePath = path.join(__dirname, '../fixtures/bulk/input_with_empty_string.csv'),
			metadataUpdateInputFilePath = path.join(__dirname, '../fixtures/bulk/input_metadata_update.csv'),
			tableOutput = getFixture('bulk/post_collaborations_table.txt');

		let addCollaborationBody1 = {
			item: {
				type: 'folder',
				id: '11111'
			},
			accessible_by: {
				type: 'user',
				login
			},
			can_view_path: true
		};
		let addCollaborationBody2 = {
			item: {
				type: 'folder',
				id: '22222'
			},
			accessible_by: {
				type: 'user',
				login: 'roger.federer@example.com'
			},
			can_view_path: true
		};
		let addCollaborationBody3 = {
			item: {
				type: 'file',
				id: '33333'
			},
			accessible_by: {
				type: 'user',
				login: 'dominic.toretto@example.com'
			},
			can_view_path: false
		};

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/collaborations', addCollaborationBody1)
				.reply(200, addCollaborationFixture1)
				.post('/2.0/collaborations', addCollaborationBody2)
				.reply(200, addCollaborationFixture2)
				.post('/2.0/collaborations', addCollaborationBody3)
				.reply(200, addCollaborationFixture3)
			)
			.stdout()
			.stderr()
			.command([
				'collaborations:add',
				boxItemId,
				'--can-view-path',
				`--login=${login}`,
				`--bulk-file-path=${inputFilePath}`,
				'--json',
				'--no-color',
				'--token=test'
			])
			.it('should create multiple collaborations for multiple Box items with can-view-path and login flags passed (JSON Output)', ctx => {
				assert.equal(ctx.stdout, jsonOutput);
				assert.equal(ctx.stderr, `All bulk input entries processed successfully.${os.EOL}`);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/collaborations', addCollaborationBody1)
				.reply(200, addCollaborationFixture1)
				.post('/2.0/collaborations', addCollaborationBody2)
				.reply(200, addCollaborationFixture2)
				.post('/2.0/collaborations', addCollaborationBody3)
				.reply(200, addCollaborationFixture3)
			)
			.stdout()
			.stderr()
			.command([
				'collaborations:add',
				boxItemId,
				'--can-view-path',
				`--login=${login}`,
				`--bulk-file-path=${inputFilePath}`,
				'--csv',
				'--no-color',
				'--token=test'
			])
			.it('should create multiple collaborations for multiple Box items with can-view-path and login flags passed (CSV Output)', ctx => {
				assert.equal(ctx.stdout, csvOutput);
				assert.equal(ctx.stderr, `All bulk input entries processed successfully.${os.EOL}`);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/collaborations', addCollaborationBody1)
				.reply(200, addCollaborationFixture1)
				.post('/2.0/collaborations', addCollaborationBody2)
				.reply(200, addCollaborationFixture2)
				.post('/2.0/collaborations', addCollaborationBody3)
				.reply(200, addCollaborationFixture3)
			)
			.stdout()
			.stderr()
			.command([
				'collaborations:add',
				boxItemId,
				'--can-view-path',
				`--login=${login}`,
				`--bulk-file-path=${inputFilePath}`,
				'--no-color',
				'--token=test'
			])
			.it('should create multiple collaborations for multiple Box items with can-view-path and login flags passed (Table Output)', ctx => {
				assert.equal(ctx.stdout, tableOutput);
				assert.equal(ctx.stderr, `All bulk input entries processed successfully.${os.EOL}`);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/collaborations', addCollaborationBody1)
				.reply(200, addCollaborationFixture1)
				.post('/2.0/collaborations', addCollaborationBody2)
				.reply(200, addCollaborationFixture2)
				.post('/2.0/collaborations', addCollaborationBody3)
				.reply(200, addCollaborationFixture3)
			)
			.stdout()
			.stderr()
			.command([
				'collaborations:add',
				boxItemId,
				'--can-view-path',
				`--login=${login}`,
				`--bulk-file-path=${inputFilePath}`,
				`--save-to-file-path=${saveFilePath}`,
				'-y',
				'--json',
				'--no-color',
				'--token=test'
			])
			.it('should create multiple collaborations for multiple Box items with can-view-path and login flags passed (Save JSON Output To File)', ctx => {
				/* eslint-disable no-sync */
				let savedFileContents = fs.readFileSync(saveFilePath, 'utf8');
				/* eslint-enable no-sync */
				assert.equal(savedFileContents, jsonOutput);

				let expectedMessage = `Output written to ${saveFilePath}${os.EOL}`;
				expectedMessage += `All bulk input entries processed successfully.${os.EOL}`;
				assert.equal(ctx.stderr, expectedMessage);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/collaborations', addCollaborationBody1)
				.reply(200, addCollaborationFixture1)
				.post('/2.0/collaborations', addCollaborationBody2)
				.reply(200, addCollaborationFixture2)
				.post('/2.0/collaborations', addCollaborationBody3)
				.reply(200, addCollaborationFixture3)
			)
			.stdout()
			.stderr()
			.command([
				'collaborations:add',
				boxItemId,
				'--can-view-path',
				`--login=${login}`,
				`--bulk-file-path=${path.join(__dirname, '../fixtures/bulk/input_key_casing.csv')}`,
				'--json',
				'--token=test'
			])
			.it('should permit keys that do not use flag punctuation');

		let folderLockBody = {
			folder: {
				type: 'folder',
				id: '1243215'
			}
		};
		let folderLockBodyString = JSON.stringify(folderLockBody);
		let folderLockInputFilePath = path.join(__dirname, '../fixtures/bulk/input_manual_request_folder_lock.csv');
		let folderLockBodyFixture = getFixture('bulk/post_folders_lock.json');
		test
			.nock(TEST_API_ROOT, api => api
				.matchHeader('Content-Type', 'application/json;version=1')
				.matchHeader('Accept', 'application/json;version=1')
				.post('/2.0/folder_locks', folderLockBody)
				.reply(200, folderLockBodyFixture)
			)
			.stdout()
			.stderr()
			.command([
				'request',
				`--body=${folderLockBodyString}`,
				'--header=Content-Type: application/json;version=1',
				'--header=Accept: application/json;version=1',
				`--bulk-file-path=${folderLockInputFilePath}`,
				'--json',
				'--token=test'
			])
			.it('should allow flags that can be specified multiple times in a single command to be passed through the command line for bulk commands');

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/search')
				.query({
					mdfilters: '[{"scope":"enterprise","templateKey":"myTemplate","filters":{"name":"Matt","age":{"lt":30,"gt":30}}}]',
					limit: 100,
					query: '',
				})
				.reply(200, { entries: [] })
			)
			.stdout()
			.stderr()
			.command([
				'search',
				`--bulk-file-path=${multipleFlagValuesInputFilePath}`,
				'--json',
				'--token=test'
			])
			.it('should process number-postfixed columns as multiple uses of same flag', ctx => {
				assert.equal(ctx.stdout, `[]${os.EOL}`);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put('/2.0/files/1234/metadata/enterprise/testTemplate', [
					{
						op: 'add',
						path: '/foo',
						value: 'bar',
					},
					{
						op: 'test',
						path: '/baz',
						value: [
							'stuff',
							'nonsense'
						],
					},
					{
						op: 'add',
						path: '/anotherOne',
						value: -2.5,
					},
					{
						op: 'copy',
						from: '/sou~1rce/0',
						path: '/destination'
					}
				])
				.reply(200, {})
			)
			.stdout()
			.stderr()
			.command([
				'files:metadata:update',
				'1234',
				'--template-key=testTemplate',
				`--bulk-file-path=${metadataUpdateInputFilePath}`,
				'--json',
				'--token=test'
			])
			.it('should preserve the absolute order of columns in command arguments');

		test
			.nock(TEST_API_ROOT, api => api
				.put('/2.0/files/11111', {
					name: 'dat.dat',
				})
				.reply(200, {
					type: 'file',
					id: '11111',
					name: 'dat.dat',
					description: 'Still here!',
				})
				.put('/2.0/files/22222', {
					name: 'doc.docx',
					description: '',
				})
				.reply(200, {
					type: 'file',
					id: '22222',
					name: 'doc.docx',
					description: '',
				})
			)
			.stdout()
			.stderr()
			.command([
				'files:rename',
				`--bulk-file-path=${emptyStringInputFilePath}`,
				'--json',
				'--token=test'
			])
			.it('should correctly parse empty field and empty string value');

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/collaborations', addCollaborationBody1)
				.reply(200, addCollaborationFixture1)
			)
			.stdout()
			.stderr()
			.command([
				'collaborations:add',
				`--login=${login}`,
				`--bulk-file-path=${path.join(__dirname, '../fixtures/bulk/input_bogus_keys.csv')}`,
				'--json',
				'--token=test'
			])
			.it('should ignore CSV keys that do not map to valid args or flags');

		let folderCollabInput = path.join(__dirname, '..', 'fixtures/bulk/folder_collab_input.csv');
		let fakeCollab1 = {
			type: 'collaboration',
			id: '12345',
		};
		let fakeCollab2 = {
			type: 'collaboration',
			id: '54321',
		};
		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/collaborations', {
					item: {
						type: 'folder',
						id: '11111',
					},
					accessible_by: {
						type: 'user',
						login: 'mario@example.com',
					},
					role: 'viewer',
				})
				.query({ fields: 'id' })
				.reply(200, fakeCollab1)
				.post('/2.0/collaborations', {
					item: {
						type: 'folder',
						id: '22222',
					},
					accessible_by: {
						type: 'user',
						login: 'wario@example.com'
					},
					role: 'viewer',
				})
				.query({ fields: 'id' })
				.reply(409, {
					type: 'error',
					status: 409,
					code: 'collaboration_already_exists',
					context_info: {
						conflicts: [
							{
								type: 'collaboration',
								id: '871642494',
							}
						]
					},
					help_url: 'http://developers.box.com/docs/#errors',
					message: '',
					request_id: '170397861659135cc65a65'
				})
				.post('/2.0/collaborations', {
					item: {
						type: 'folder',
						id: '33333',
					},
					accessible_by: {
						type: 'user',
						login: 'peach@example.com'
					},
					role: 'viewer',
				})
				.query({ fields: 'id' })
				.reply(200, fakeCollab2)
			)
			.stdout()
			.stderr()
			.command([
				'folders:collaborations:add',
				`--bulk-file-path=${folderCollabInput}`,
				'--json',
				'--fields=id',
				'--no-color',
				'--token=test'
			])
			.it('should catch and report errors in subcommands without stopping bulk execution', ctx => {
				let expectedOutput = JSON.stringify([
					fakeCollab1,
					fakeCollab2
				], null, 4);

				let expectedErrorOutput = `1 entry failed!${os.EOL}`;
				expectedErrorOutput += `----------${os.EOL}`;
				expectedErrorOutput += `Entry 2 (${os.EOL}`;
				expectedErrorOutput += `    id=22222${os.EOL}`;
				expectedErrorOutput += `    login=wario@example.com${os.EOL}`;
				expectedErrorOutput += `    role=viewer${os.EOL}`;
				expectedErrorOutput += `) failed with error:${os.EOL}`;
				expectedErrorOutput += `Unexpected API Response [409 Conflict | 170397861659135cc65a65] collaboration_already_exists${os.EOL}`;
				expectedErrorOutput += os.EOL;

				assert.equal(ctx.stdout, expectedOutput + os.EOL);
				assert.equal(ctx.stderr, expectedErrorOutput);
			});

			test
				.stdout()
				.stderr()
				.command([
					'folders:collaborations:add',
					'12345',
					`--bulk-file-path=${path.join(__dirname, '..', 'fixtures/bulk/folder_collab_input_no_header.csv')}`,
					'--json',
					'--fields=id',
					'--no-color',
					'--token=test'
				])
				.it('should report errors on missing headers', ctx => {
					let expectedErrorOutput = `1 entry failed!${os.EOL}`;
					expectedErrorOutput += `----------${os.EOL}`;
					expectedErrorOutput += `Entry 2 (${os.EOL}`;
					expectedErrorOutput += `    id=22222${os.EOL}`;
					expectedErrorOutput += `    login=wario@example.com${os.EOL}`;
					expectedErrorOutput += `) failed with error:${os.EOL}`;
					expectedErrorOutput += `Unexpected API Response [409 Conflict | 170397861659135cc65a65] collaboration_already_exists${os.EOL}`;
					expectedErrorOutput += os.EOL;

					assert.equal(ctx.stderr, `CSV input file should contain the headers row and at least on data row${os.EOL}`);
				});

			test
				.stdout()
				.stderr()
				.command([
					'folders:collaborations:add',
					'12345',
					`--bulk-file-path=${path.join(__dirname, '..', 'fixtures/bulk/folder_collab_input_no_header_multiple.csv')}`,
					'--json',
					'--fields=id',
					'--no-color',
					'--token=test'
				])
				.it('should report errors on missing headers if specified multiple rows', ctx => {
					let expectedErrorOutput = `2 entries failed!${os.EOL}`;
					expectedErrorOutput += `----------${os.EOL}`;
					expectedErrorOutput += `Entry 1 (${os.EOL}`;
					expectedErrorOutput += os.EOL;
					expectedErrorOutput += `) failed with error:${os.EOL}`;
					expectedErrorOutput += `Missing required flag:${os.EOL}`;
					expectedErrorOutput += ` -r, --role ROLE  An option to manually enter the role${os.EOL}`;
					expectedErrorOutput += `See more help with --help${os.EOL}`;
					expectedErrorOutput += os.EOL;
					expectedErrorOutput += `----------${os.EOL}`;
					expectedErrorOutput += `Entry 2 (${os.EOL}`;
					expectedErrorOutput += os.EOL;
					expectedErrorOutput += `) failed with error:${os.EOL}`;
					expectedErrorOutput += `Missing required flag:${os.EOL}`;
					expectedErrorOutput += ` -r, --role ROLE  An option to manually enter the role${os.EOL}`;
					expectedErrorOutput += `See more help with --help${os.EOL}`;
					expectedErrorOutput += os.EOL;

					assert.equal(ctx.stderr, expectedErrorOutput);
				});
		});

	describe('JSON Input', () => {
		let entriesInputFilePath = path.join(__dirname, '../fixtures/bulk/input_entries.json'),
			bareArrayInputFilePath = path.join(__dirname, '../fixtures/bulk/input_array.json'),
			singleObjectInputFilePath = path.join(__dirname, '../fixtures/bulk/input_object.json'),
			wrongExtensionInputFilePath = path.join(__dirname, '../fixtures/bulk/input.txt'),
			invalidInputFilePath = path.join(__dirname, '../fixtures/bulk/input_invalid.json'),
			multipleFlagValuesInputFilePath = path.join(__dirname, '../fixtures/bulk/input_multiple_same_flag.json'),
			metadataUpdateInputFilePath = path.join(__dirname, '../fixtures/bulk/input_metadata_update.json'),
			saveFilePath = path.join(__dirname, '..', 'fixtures/bulk/saveTest.txt');

		let addCollaborationBody1 = {
			item: {
				type: 'folder',
				id: '11111'
			},
			accessible_by: {
				type: 'user',
				login
			},
			can_view_path: true
		};
		let addCollaborationBody2 = {
			item: {
				type: 'folder',
				id: '22222'
			},
			accessible_by: {
				type: 'user',
				login: 'roger.federer@example.com'
			},
			can_view_path: true
		};
		let addCollaborationBody3 = {
			item: {
				type: 'file',
				id: '33333'
			},
			accessible_by: {
				type: 'user',
				login: 'dominic.toretto@example.com'
			},
			can_view_path: false
		};

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/collaborations', addCollaborationBody1)
				.reply(200, addCollaborationFixture1)
				.post('/2.0/collaborations', addCollaborationBody2)
				.reply(200, addCollaborationFixture2)
				.post('/2.0/collaborations', addCollaborationBody3)
				.reply(200, addCollaborationFixture3)
			)
			.stdout()
			.stderr()
			.command([
				'collaborations:add',
				boxItemId,
				'--can-view-path',
				`--login=${login}`,
				`--bulk-file-path=${entriesInputFilePath}`,
				'--json',
				'--no-color',
				'--token=test'
			])
			.it('should process multiple inputs from JSON file with entries property (JSON Output)', ctx => {
				assert.equal(ctx.stdout, jsonOutput);
				assert.equal(ctx.stderr, `All bulk input entries processed successfully.${os.EOL}`);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/collaborations', addCollaborationBody1)
				.reply(200, addCollaborationFixture1)
				.post('/2.0/collaborations', addCollaborationBody2)
				.reply(200, addCollaborationFixture2)
				.post('/2.0/collaborations', addCollaborationBody3)
				.reply(200, addCollaborationFixture3)
			)
			.stdout()
			.stderr()
			.command([
				'collaborations:add',
				boxItemId,
				'--can-view-path',
				`--login=${login}`,
				`--bulk-file-path=${bareArrayInputFilePath}`,
				'--json',
				'--no-color',
				'--token=test'
			])
			.it('should process multiple inputs from JSON file with top-level array', ctx => {
				assert.equal(ctx.stdout, jsonOutput);
				assert.equal(ctx.stderr, `All bulk input entries processed successfully.${os.EOL}`);
			});

		test
			.stdout()
			.stderr()
			.command([
				'collaborations:add',
				boxItemId,
				'--can-view-path',
				`--login=${login}`,
				`--bulk-file-path=${singleObjectInputFilePath}`,
				'--json',
				'--token=test'
			])
			.it('should output error when input file does not contain inputs array', ctx => {
				assert.equal(ctx.stdout, '');
				assert.include(ctx.stderr, `Expected input file to contain an array of input objects, but none found${os.EOL}`);
			});

		test
			.stdout()
			.stderr()
			.command([
				'collaborations:add',
				boxItemId,
				'--can-view-path',
				`--login=${login}`,
				`--bulk-file-path=${wrongExtensionInputFilePath}`,
				'--json',
				'--token=test'
			])
			.it('should output error when input file does not have appropriate extension', ctx => {
				assert.equal(ctx.stdout, '');
				assert.include(ctx.stderr, `Input file had extension ".txt", but only .json and .csv are supported${os.EOL}`);
			});

		test
			.stdout()
			.stderr()
			.command([
				'collaborations:add',
				boxItemId,
				'--can-view-path',
				`--login=${login}`,
				`--bulk-file-path=${invalidInputFilePath}`,
				'--json',
				'--token=test'
			])
			.it('should output CLI error message when input file is not valid JSON', ctx => {
				assert.equal(ctx.stdout, '');
				assert.equal(ctx.stderr, `Could not parse JSON input file ${invalidInputFilePath}${os.EOL}`);
			});

		test
			.stdout()
			.stderr()
			.command([
				'collaborations:add',
				boxItemId,
				'--can-view-path',
				`--login=${login}`,
				`--bulk-file-path=${invalidInputFilePath}`,
				'--json',
				'--verbose',
				'--token=test'
			])
			.it('should output wrapped error when input file is not valid JSON and verbose flag is passed', ctx => {
				debug.disable();
				assert.equal(ctx.stdout, '');
				assert.include(ctx.stderr, `BoxCLIError: Could not parse JSON input file ${invalidInputFilePath}${os.EOL}`);
				assert.include(ctx.stderr, 'Caused by: SyntaxError: ');
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/collaborations', addCollaborationBody1)
				.reply(200, addCollaborationFixture1)
				.post('/2.0/collaborations', addCollaborationBody2)
				.reply(200, addCollaborationFixture2)
				.post('/2.0/collaborations', addCollaborationBody3)
				.reply(200, addCollaborationFixture3)
			)
			.stdout()
			.stderr()
			.command([
				'collaborations:add',
				boxItemId,
				'--can-view-path',
				`--login=${login}`,
				`--bulk-file-path=${entriesInputFilePath}`,
				`--save-to-file-path=${saveFilePath}`,
				'-y',
				'--json',
				'--token=test'
			])
			.it('should process multiple inputs from JSON file with entries property (Save JSON Output To File)', ctx => {
				/* eslint-disable no-sync */
				let savedFileContents = fs.readFileSync(saveFilePath, 'utf8');
				/* eslint-enable no-sync */
				assert.equal(savedFileContents, jsonOutput);

				let expectedMessage = `Output written to ${saveFilePath}${os.EOL}`;
				expectedMessage += `All bulk input entries processed successfully.${os.EOL}`;
				assert.equal(ctx.stderr, expectedMessage);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/collaborations', addCollaborationBody1)
				.reply(200, addCollaborationFixture1)
				.post('/2.0/collaborations', addCollaborationBody2)
				.reply(200, addCollaborationFixture2)
				.post('/2.0/collaborations', addCollaborationBody3)
				.reply(200, addCollaborationFixture3)
			)
			.do(() => {
				/* eslint-disable no-sync */
				fs.writeFileSync(saveFilePath, 'foo', 'utf8');
				/* eslint-enable no-sync */
			})
			.stdout()
			.stderr()
			.stdin(`y${os.EOL}`, 500)
			.command([
				'collaborations:add',
				boxItemId,
				'--can-view-path',
				`--login=${login}`,
				`--bulk-file-path=${entriesInputFilePath}`,
				`--save-to-file-path=${saveFilePath}`,
				'--json',
				'--no-color',
				'--token=test'
			])
			.it('should prompt when overwriting existing file', ctx => {
				/* eslint-disable no-sync */
				let savedFileContents = fs.readFileSync(saveFilePath, 'utf8');
				/* eslint-enable no-sync */
				assert.equal(savedFileContents, jsonOutput);
				assert.include(ctx.stdout, '(y/N) y');

				let expectedMessage = `Output written to ${saveFilePath}${os.EOL}`;
				expectedMessage += `All bulk input entries processed successfully.${os.EOL}`;
				assert.equal(ctx.stderr, expectedMessage);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/collaborations', addCollaborationBody1)
				.reply(200, addCollaborationFixture1)
				.post('/2.0/collaborations', addCollaborationBody2)
				.reply(200, addCollaborationFixture2)
				.post('/2.0/collaborations', addCollaborationBody3)
				.reply(200, addCollaborationFixture3)
			)
			.stdout()
			.stderr()
			.do(() => {
				// @NOTE: This date is 2018-11-18T12:34:56.000 (the Date constructor takes zero-indexed month)
				let currentTime = new Date(2018, 10, 18, 12, 34, 56, 0);
				sandbox.useFakeTimers(currentTime);
			})
			.command([
				'collaborations:create',
				boxItemId,
				'--can-view-path',
				`--login=${login}`,
				`--bulk-file-path=${entriesInputFilePath}`,
				`--save-to-file-path=${path.dirname(saveFilePath)}`,
				'-y',
				'--json',
				'--token=test'
			])
			.it('should write file with default name when save path is a directory', ctx => {
				let expectedFilename = 'collaborations-create-2018-11-18_12_34_56_000.json';
				let filePath = path.join(path.dirname(saveFilePath), expectedFilename);
				/* eslint-disable no-sync */
				let savedFileContents = fs.readFileSync(filePath, 'utf8');
				fs.unlinkSync(filePath);
				/* eslint-enable no-sync */
				assert.equal(savedFileContents, jsonOutput);

				let expectedMessage = `Output written to ${filePath}${os.EOL}`;
				expectedMessage += `All bulk input entries processed successfully.${os.EOL}`;
				assert.equal(ctx.stderr, expectedMessage);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/collaborations', addCollaborationBody1)
				.reply(200, addCollaborationFixture1)
				.post('/2.0/collaborations', addCollaborationBody2)
				.reply(200, addCollaborationFixture2)
				.post('/2.0/collaborations', addCollaborationBody3)
				.reply(200, addCollaborationFixture3)
			)
			.stdout()
			.stderr()
			.command([
				'collaborations:add',
				boxItemId,
				'--can-view-path',
				`--login=${login}`,
				`--bulk-file-path=${path.join(__dirname, '../fixtures/bulk/input_key_casing.json')}`,
				'--json',
				'--token=test'
			])
			.it('should permit keys that do not use flag punctuation');

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/search')
				.query({
					mdfilters: '[{"scope":"enterprise","templateKey":"myTemplate","filters":{"name":"Matt","age":{"lt":30,"gt":30}}}]',
					limit: 100,
					query: '',
				})
				.reply(200, { entries: [] })
			)
			.stdout()
			.stderr()
			.command([
				'search',
				`--bulk-file-path=${multipleFlagValuesInputFilePath}`,
				'--json',
				'--token=test'
			])
			.it('should process array as multiple uses of same flag', ctx => {
				assert.equal(ctx.stdout, `[]${os.EOL}`);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.put('/2.0/files/1234/metadata/enterprise/testTemplate', [
					{
						op: 'add',
						path: '/foo',
						value: 'bar',
					},
					{
						op: 'test',
						path: '/baz',
						value: [
							'stuff',
							'nonsense'
						],
					},
					{
						op: 'add',
						path: '/anotherOne',
						value: -2.5,
					},
					{
						op: 'copy',
						from: '/sou~1rce/0',
						path: '/destination'
					}
				])
				.reply(200, {})
			)
			.stdout()
			.stderr()
			.command([
				'files:metadata:update',
				'1234',
				'--template-key=testTemplate',
				`--bulk-file-path=${metadataUpdateInputFilePath}`,
				'--json',
				'--token=test'
			])
			.it('should preserve the absolute order of columns in command arguments');

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/collaborations', addCollaborationBody1)
				.reply(200, addCollaborationFixture1)
			)
			.stdout()
			.stderr()
			.command([
				'collaborations:add',
				`--login=${login}`,
				`--bulk-file-path=${path.join(__dirname, '../fixtures/bulk/input_nested_keys.json')}`,
				'--json',
				'--token=test'
			])
			.it('should process nested keys into top-level args');

		test
			.nock(TEST_API_ROOT, api => api
				.post('/2.0/collaborations', addCollaborationBody1)
				.reply(200, addCollaborationFixture1)
			)
			.stdout()
			.stderr()
			.command([
				'collaborations:add',
				`--login=${login}`,
				`--bulk-file-path=${path.join(__dirname, '../fixtures/bulk/input_bogus_keys.json')}`,
				'--json',
				'--token=test'
			])
			.it('should ignore JSON keys that do not map to valid args or flags');
	});

	describe('Output formatting', () => {

		let inputFilePath = path.join(__dirname, '../fixtures/bulk/bulk_files_tasks_list_input.json'),
			fixture = getFixture('files/get_files_id_tasks_page_1'),
			fixture2 = getFixture('files/get_files_id_tasks_page_2'),
			fixture3 = getFixture('folders/get_folders_id_items'),
			jsonCollectionOutput = getFixture('output/bulk_collection_output_json.txt'),
			tableCollectionOutput = getFixture('output/bulk_collection_output_table.txt'),
			csvCollectionOutput = getFixture('output/bulk_collection_output_csv.txt'),
			csvItemsOutput = getFixture('output/bulk_items_output_csv.txt');

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/files/123/tasks')
				.reply(200, fixture)
				.get('/2.0/files/123/tasks')
				.query({
					offset: 1
				})
				.reply(200, fixture2)
				.get('/2.0/files/456/tasks')
				.reply(200, fixture)
				.get('/2.0/files/456/tasks')
				.query({
					offset: 1
				})
				.reply(200, fixture2)
				.get('/2.0/files/789/tasks')
				.reply(200, fixture)
				.get('/2.0/files/789/tasks')
				.query({
					offset: 1
				})
				.reply(200, fixture2)
			)
			.stdout()
			.stderr()
			.command([
				'files:tasks:list',
				`--bulk-file-path=${inputFilePath}`,
				'--json',
				'--token=test'
			])
			.it('should flatten output objects array when each command run returns an array (JSON Output)', ctx => {
				assert.equal(ctx.stdout, jsonCollectionOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/files/123/tasks')
				.reply(200, fixture)
				.get('/2.0/files/123/tasks')
				.query({
					offset: 1
				})
				.reply(200, fixture2)
				.get('/2.0/files/456/tasks')
				.reply(200, fixture)
				.get('/2.0/files/456/tasks')
				.query({
					offset: 1
				})
				.reply(200, fixture2)
				.get('/2.0/files/789/tasks')
				.reply(200, fixture)
				.get('/2.0/files/789/tasks')
				.query({
					offset: 1
				})
				.reply(200, fixture2)
			)
			.stdout()
			.stderr()
			.command([
				'files:tasks:list',
				`--bulk-file-path=${inputFilePath}`,
				'--token=test'
			])
			.it('should output flattened table when each command run returns an array (Table Output)', ctx => {
				assert.equal(ctx.stdout, tableCollectionOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/files/123/tasks')
				.reply(200, fixture)
				.get('/2.0/files/123/tasks')
				.query({
					offset: 1
				})
				.reply(200, fixture2)
				.get('/2.0/files/456/tasks')
				.reply(200, fixture)
				.get('/2.0/files/456/tasks')
				.query({
					offset: 1
				})
				.reply(200, fixture2)
				.get('/2.0/files/789/tasks')
				.reply(200, fixture)
				.get('/2.0/files/789/tasks')
				.query({
					offset: 1
				})
				.reply(200, fixture2)
			)
			.stdout()
			.stderr()
			.command([
				'files:tasks:list',
				`--bulk-file-path=${inputFilePath}`,
				'--csv',
				'--token=test'
			])
			.it('should output flattened CSV when each command run returns an array (CSV Output)', ctx => {
				assert.equal(ctx.stdout, csvCollectionOutput);
			});

		test
			.nock(TEST_API_ROOT, api => api
				.get('/2.0/folders/0/items')
				.query({ usemarker: true })
				.reply(200, fixture3)
			)
			.stdout()
			.stderr({print: true})
			.command([
				'folders:items',
				'0',
				'--csv',
				'--token=test'
			])
			.it('should output flattened CSV with union of all fields present in each item when each command run returns an array (CSV Output)', ctx => {
				assert.equal(ctx.stdout, csvItemsOutput);
			});

	});

});
