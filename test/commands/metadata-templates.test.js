'use strict';

const { test } = require('@oclif/test');
const assert = require('chai').assert;
const { getFixture, TEST_API_ROOT } = require('../helpers/test-helper');
const os = require('node:os');
const leche = require('leche');

describe('Metadata Templates', function () {
	describe('metadata-templates:cascade', function () {
		let folderID = '22222',
			scope = 'enterprise',
			templateKey = 'testTemplate',
			fixture = getFixture(
				'metadata-cascade-policies/post_metadata_cascade_policies_201'
			),
			yamlOutput = getFixture(
				'output/metadata_cascade_policies_create_yaml.txt'
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/metadata_cascade_policies', {
					scope,
					templateKey,
					folder_id: folderID,
				})
				.reply(201, fixture)
		)
			.stdout()
			.command([
				'metadata-templates:cascade',
				templateKey,
				`--folder=${folderID}`,
				'--json',
				'--token=test',
			])
			.it('should create cascade policy (JSON Output)', (context) => {
				assert.equal(context.stdout, fixture);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/metadata_cascade_policies', {
					scope,
					templateKey,
					folder_id: folderID,
				})
				.reply(201, fixture)
		)
			.stdout()
			.command([
				'metadata-templates:cascade',
				templateKey,
				`--folder=${folderID}`,
				'--token=test',
			])
			.it('should create cascade policy (YAML Output)', (context) => {
				assert.equal(context.stdout, yamlOutput);
			});

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/metadata_cascade_policies', {
					scope,
					templateKey,
					folder_id: folderID,
				})
				.reply(201, fixture)
		)
			.stdout()
			.command([
				'metadata-cascade-policies:create',
				templateKey,
				`--folder=${folderID}`,
				'--token=test',
			])
			.it('should create cascade policy (command alias)', (context) => {
				assert.equal(context.stdout, yamlOutput);
			});
	});

	describe('metadata-templates:get', function () {
		let scope = 'enterprise',
			templateKey = 'testTemplate',
			fixture = getFixture(
				'metadata-templates/get_metadata_templates_scope_template_schema'
			),
			yamlOutput = getFixture('output/metadata_templates_get_yaml.txt');

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/metadata_templates/${scope}/${templateKey}/schema`)
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'metadata-templates:get',
				templateKey,
				'--json',
				'--token=test',
			])
			.it(
				'should get information about a metadata template (JSON Output)',
				(context) => {
					assert.equal(context.stdout, fixture);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.get(`/2.0/metadata_templates/${scope}/${templateKey}/schema`)
				.reply(200, fixture)
		)
			.stdout()
			.command(['metadata-templates:get', templateKey, '--token=test'])
			.it(
				'should get information about a metadata template (YAML Output)',
				(context) => {
					assert.equal(context.stdout, yamlOutput);
				}
			);
	});

	describe('metadata-templates:delete', function () {
		let scope = 'enterprise',
			templateKey = 'testTemplate';

		test.nock(TEST_API_ROOT, (api) =>
			api
				.delete(
					`/2.0/metadata_templates/${scope}/${templateKey}/schema`
				)
				.reply(204)
		)
			.stderr()
			.command(['metadata-templates:delete', templateKey, '--token=test'])
			.it('should delete a metadata template', (context) => {
				assert.include(
					context.stderr,
					`Delete metadata template with scope ${scope} and identifier ${templateKey}`
				);
			});
	});

	leche.withData(
		['metadata-templates', 'metadata-templates:list'],
		function (command) {
			describe(command, function () {
				let scope = 'enterprise',
					fixture = getFixture(
						'metadata-templates/get_metadata_templates_scope_page_1'
					),
					fixture2 = getFixture(
						'metadata-templates/get_metadata_templates_scope_page_2'
					),
					jsonOutput = getFixture(
						'output/metadata_templates_list_json.txt'
					);

				test.nock(TEST_API_ROOT, (api) =>
					api
						.get(`/2.0/metadata_templates/${scope}`)
						.reply(200, fixture)
						.get(`/2.0/metadata_templates/${scope}`)
						.query({
							marker: 'ZDFARAFD',
						})
						.reply(200, fixture2)
				)
					.stdout()
					.command([command, '--json', '--token=test'])
					.it(
						'should get all metadata templates in your Enterprise (JSON Output)',
						(context) => {
							assert.equal(context.stdout, jsonOutput);
						}
					);
			});
		}
	);

	describe('metadata-templates:create', function () {
		let displayName = 'New Metadata Template',
			templateKey = 'newMetadata',
			fixture = getFixture(
				'metadata-templates/post_metadata_templates_schema'
			),
			yamlOutput = getFixture(
				'output/metadata_templates_create_yaml.txt'
			);

		let expectedBody = {
			scope: 'enterprise',
			displayName,
			fields: [],
		};

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/metadata_templates/schema', {
					...expectedBody,
					templateKey,
				})
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'metadata-templates:create',
				`--display-name=${displayName}`,
				`--template-key=${templateKey}`,
				'--json',
				'--token=test',
			])
			.it(
				'should create a new metadata template (JSON Output)',
				(context) => {
					assert.equal(context.stdout, fixture);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/metadata_templates/schema', {
					...expectedBody,
					templateKey,
				})
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'metadata-templates:create',
				`--display-name=${displayName}`,
				`--template-key=${templateKey}`,
				'--token=test',
			])
			.it(
				'should create a new metadata template (YAML Output)',
				(context) => {
					assert.equal(context.stdout, yamlOutput);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/metadata_templates/schema', {
					...expectedBody,
					templateKey,
				})
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'metadata-templates:create',
				`--display-name=${displayName}`,
				`--template-key=${templateKey}`,
				'--id-only',
				'--token=test',
			])
			.it(
				'should create a new metadata template (ID Output)',
				(context) => {
					assert.equal(
						context.stdout,
						`${JSON.parse(fixture).id}${os.EOL}`
					);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/metadata_templates/schema', {
					...expectedBody,
					hidden: true,
				})
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'metadata-templates:create',
				`--display-name=${displayName}`,
				'--hidden',
				'--json',
				'--token=test',
			])
			.it(
				'should send hidden param when --hidden flag is passed',
				(context) => {
					assert.equal(context.stdout, fixture);
				}
			);

		test.nock(TEST_API_ROOT, (api) =>
			api
				.post('/2.0/metadata_templates/schema', {
					...expectedBody,
					templateKey,
					hidden: true,
					copyInstanceOnItemCopy: true,
					fields: [
						{
							type: 'string',
							displayName: 'Full Name',
							hidden: false,
							key: 'name',
						},
						{
							type: 'date',
							displayName: 'Birthday',
							key: 'bday',
							hidden: true,
						},
						{
							type: 'enum',
							displayName: 'State of Residence',
							key: 'state',
							description: 'Where does this person live?',
							options: [
								{ key: 'WI' },
								{ key: 'CA' },
								{ key: 'NY' },
							],
							hidden: false,
						},
						{
							type: 'multiSelect',
							displayName: 'Programming Languages',
							options: [{ key: 'Python' }, { key: 'Java' }],
						},
						{
							type: 'float',
							displayName: 'Age',
						},
					],
				})
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'metadata-templates:create',
				`--display-name=${displayName}`,
				'--hidden',
				`--template-key=${templateKey}`,
				'--string=Full Name',
				'--no-hidden',
				'--field-key=name',
				'--date=Birthday',
				'--field-key=bday',
				'--hidden',
				'--enum=State of Residence',
				'--field-key=state',
				'--description=Where does this person live?',
				'--option=WI',
				'--option=CA',
				'--no-hidden',
				'--option=NY',
				'--multi-select=Programming Languages',
				'--option=Python',
				'--option=Java',
				'--number=Age',
				'--copy-instance-on-item-copy',
				'--token=test',
			])
			.it('should correctly parse field declarations');

		leche.withData(
			{
				'--field-key flag outside of field deifnition': [
					['--field-key=foo', '--string=Name'],
					'Unexpected --field-key flag outside of field definition',
				],
				'--description flag outside of field definition': [
					['--description=foo', '--string=Name'],
					'Unexpected --description flag outside of field definition',
				],
				'--option flag outside of field definition': [
					['--option=foo', '--string=Name'],
					'Unexpected --option flag outside of field definition',
				],
				'--option flag in incorrect field type': [
					['--string=Name', '--option=foo'],
					'--option flag can only be specified for enum and multi-select fields',
				],
			},
			function (flags, expectedErrorMessage) {
				test.stdout()
					.stderr()
					.command([
						'metadata-templates:create',
						`--display-name=${displayName}`,
						...flags,
						'--token=test',
					])
					.it('should output correct error message', (context) => {
						assert.equal(
							context.stderr,
							`${expectedErrorMessage}${os.EOL}`
						);
					});
			}
		);
	});

	describe('metadata-templates:update', function () {
		let scope = 'enterprise',
			templateKey = 'employeeRecord',
			fixture = getFixture(
				'metadata-templates/put_metadata_templates_scope_key_schema_200'
			);

		let expectedUpdates = [
			{
				op: 'editTemplate',
				data: {
					hidden: true,
					displayName: 'New Display Name',
					copyInstanceOnItemCopy: false,
				},
			},
			{
				op: 'addEnumOption',
				fieldKey: 'key1',
				data: {
					key: 'optionKey1',
				},
			},
			{
				op: 'addEnumOption',
				fieldKey: 'key1',
				data: {
					key: 'optionKey2',
				},
			},
			{
				op: 'addField',
				data: {
					type: 'enum',
					displayName: 'Field Display Name',
					description: 'My New Field',
					key: 'key2',
					options: [{ key: 'opt1' }, { key: 'opt2' }],
				},
			},
			{
				op: 'reorderEnumOptions',
				fieldKey: 'key2',
				enumOptionKeys: ['opt2', 'opt1'],
			},
			{
				op: 'reorderFields',
				fieldKeys: ['key2', 'key3', 'key1'],
			},
			{
				op: 'editField',
				fieldKey: 'key2',
				data: {
					displayName: 'Different Display Name',
				},
			},
			{
				op: 'editEnumOption',
				fieldKey: 'key2',
				enumOptionKey: 'opt2',
				data: {
					key: 'newOpt2',
				},
			},
			{
				op: 'removeEnumOption',
				fieldKey: 'key2',
				enumOptionKey: 'opt1',
			},
			{
				op: 'removeField',
				fieldKey: 'key2',
			},
			{
				op: 'addField',
				data: {
					type: 'multiSelect',
					displayName: 'foo',
					hidden: false,
					options: [{ key: 'bar' }, { key: 'baz' }],
				},
			},
			{
				op: 'addMultiSelectOption',
				fieldKey: 'foo',
				data: {
					key: 'bas',
				},
			},
			{
				op: 'addField',
				data: {
					type: 'float',
					displayName: 'Count',
				},
			},
			{
				op: 'addField',
				data: {
					type: 'date',
					displayName: 'Date',
				},
			},
		];

		test.nock(TEST_API_ROOT, (api) =>
			api
				.put(
					`/2.0/metadata_templates/${scope}/${templateKey}/schema`,
					expectedUpdates
				)
				.reply(200, fixture)
		)
			.stdout()
			.command([
				'metadata-templates:update',
				templateKey,
				`--scope=${scope}`,
				'--hidden',
				'--display-name=New Display Name',
				'--no-copy-instance-on-item-copy',
				'--add-enum-option=key1',
				'--option=optionKey1',
				'--option=optionKey2',
				'--enum=Field Display Name',
				'--description=My New Field',
				'--field-key=key2',
				'--option=opt1',
				'--option=opt2',
				'--reorder-enum-options=key2',
				'--option=opt2',
				'--option=opt1',
				'--reorder-fields=key2,key3,key1',
				'--edit-field=key2',
				'--display-name=Different Display Name',
				'--edit-enum-option=key2.opt2',
				'--option=newOpt2',
				'--remove-enum-option=key2.opt1',
				'--remove-field=key2',
				'--multi-select=foo',
				'--option=bar',
				'--option=baz',
				'--no-hidden',
				'--add-multi-select-option=foo',
				'--option=bas',
				'--number=Count',
				'--date=Date',
				'--json',
				'--token=test',
			])
			.it(
				'should update the metadata template (JSON Output)',
				(context) => {
					assert.equal(context.stdout, fixture);
				}
			);

		leche.withData(
			{
				'hidden flag in wrong location': [
					['--remove-field=key2', '--hidden'],
					'Unexpected --hidden flag outside of template or field edit operation',
				],
				'malformed option key in --edit-enum-option flag': [
					['--edit-enum-option=key-option'],
					'Enum option key must be formatted as fieldKey.optionKey',
				],
				'malformed option key in --remove-enum-option flag': [
					['--remove-enum-option=key-option'],
					'Enum option key must be formatted as fieldKey.optionKey',
				],
				'--option flag before any field operation': [
					['--option=foo'],
					'Unexpected --option flag outside of option-related operation',
				],
				'--option flag in unrelated operation': [
					['--edit-field=bar', '--option=opt'],
					'Unexpected --option flag outside of option-related operation',
				],
				'--option flag in incorrect field type': [
					['--string=Name', '--option=John Doe'],
					'Unexpected --option flag while specifying string field',
				],
				'--field-key flag outside of operation group': [
					['--field-key=quux'],
					'Unexpected --field-key flag outside of field operation',
				],
				'--field-key flag in incorrect operation group': [
					['--reorder-enum-options=foo', '--field-key=bar'],
					'Unexpected --field-key flag outside of field add or edit operation',
				],
				'--description flag outside of field operation': [
					['--description=Blah'],
					'Unexpected --description flag outside of field operation',
				],
				'--display-name field in incorrect operation group': [
					['--reorder-enum-options=foo', '--display-name=Wrong!'],
					'Unexpected --display-name flag outside of template or field edit operation',
				],
				'--copy-instance-on-item-copy flag in incorrect operation group':
					[
						['--edit-field=bar', '--copy-instance-on-item-copy'],
						'Unexpected --copy-instance-on-item-copy flag outside of template edit operation',
					],
			},
			function (flags, expectedErrorMessage) {
				test.stdout()
					.stderr()
					.command([
						'metadata-templates:update',
						templateKey,
						`--scope=${scope}`,
						...flags,
						'--token=test',
					])
					.it('should output correct error message', (context) => {
						assert.equal(
							context.stderr,
							`${expectedErrorMessage}${os.EOL}`
						);
					});
			}
		);
	});
});
