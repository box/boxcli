'use strict';

const chai = require('chai');
const assert = require('chai').assert;
const mockery = require('mockery');
const leche = require('leche');
const sinon = require('sinon');
const process = require('node:process');
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');
const chaiAsPromised = require('chai-as-promised');
const { getDriveLetter, isWin } = require('./helpers/test-helper');

chai.use(chaiAsPromised);

describe('Utilities', function () {
	const MODULE_UNDER_TEST = '../src/util';

	let sandbox = sinon.createSandbox();

	let mockOS, cliUtilities;

	const isWindows = isWin();

	const driveLetter = isWindows ? getDriveLetter() : '';

	beforeEach(function () {
		mockery.enable({
			useCleanCache: true,
			warnOnUnregistered: false,
		});

		mockOS = {
			homedir: sandbox.stub().returns('/home/user'),
		};

		mockery.registerMock('os', mockOS);

		mockery.registerAllowable(MODULE_UNDER_TEST, true);
		cliUtilities = require(MODULE_UNDER_TEST);
	});

	afterEach(function () {
		sandbox.verifyAndRestore();
		mockery.deregisterAll();
		mockery.disable();
	});

	describe('parsePath()', function () {
		leche.withData(
			{
				'bare tilde': [
					'~',
					path.join(os.homedir()),
				],
				'subdirectory of tilde': [
					'~/foo/bar',
					path.join(os.homedir(), 'foo', 'bar'),
				],
				'absolute path with interior tilde': [
					'/var/~/bar',
					...(isWindows
						? [String.raw`${driveLetter}\var\~\bar`]
						: ['/var/~/bar']),
				],
				'relative path with interior tilde': [
					'./~/bar',
					...(isWindows
						? [String.raw`${process.cwd()}\~\bar`]
						: [`${process.cwd()}/~/bar`]),
				],
				'absolute path': [
					'/var/box/files',
					...(isWindows
						? [String.raw`${driveLetter}\var\box\files`]
						: ['/var/box/files']),
				],
				'relative path': [
					'./foo',
					...(isWindows
						? [String.raw`${process.cwd()}\foo`]
						: [`${process.cwd()}/foo`]),
				],
				'root directory': [
					'/',
					...(isWindows ? [`${driveLetter}\\`] : ['/']),
				],
				'relative path that REALLY should be the root': [
					'../../../../../../../../../../../../../../../../../../../../../../../../../../../../../../../../..',
					...(isWindows ? [`${driveLetter}\\`] : ['/']),
				],
				'absolute file path': [
					'/foo/bar/doc.pdf',
					...(isWindows
						? [String.raw`${driveLetter}\foo\bar\doc.pdf`]
						: ['/foo/bar/doc.pdf']),
				],
				'relative file path': [
					'./pic.jpg',
					...(isWindows
						? [String.raw`${process.cwd()}\pic.jpg`]
						: [`${process.cwd()}/pic.jpg`]),
				],
				'file in current directory': [
					'essay.docx',
					...(isWindows
						? [String.raw`${process.cwd()}\essay.docx`]
						: [`${process.cwd()}/essay.docx`]),
				],
				'relative file path that REALLY should be in the root directory':
					[
						'../../../../../../../../../../../../../../../../../../../../../../../../../../../../../../../../a.txt',
						...(isWindows
							? [String.raw`${driveLetter}\a.txt`]
							: ['/a.txt']),
					],
				'folder name with spaces in it': [
					'/A/Folder/With/Spaces In It',
					...(isWindows
						? [
								String.raw`${driveLetter}\A\Folder\With\Spaces In It`,
							]
						: ['/A/Folder/With/Spaces In It']),
				],
				'file name with spaces in it': [
					'/home/otheruser/Secret Stuff.pdf',
					...(isWindows
						? [
								String.raw`${driveLetter}\home\otheruser\Secret Stuff.pdf`,
							]
						: ['/home/otheruser/Secret Stuff.pdf']),
				],
				'absolute path to folder with trailing slash': [
					'/foo/bar/baz/',
					...(isWindows
						? [String.raw`${driveLetter}\foo\bar\baz`]
						: ['/foo/bar/baz']),
				],
				'dot for current directory': ['.', process.cwd()],
				'dot with trailing slash for current directory': [
					'./',
					process.cwd(),
				],
			},
			function (path, expectedOutput) {
				it('should correctly parse to absolute path', function () {
					let parsedPath = cliUtilities.parsePath(path);
					assert.strictEqual(parsedPath, expectedOutput);
				});
			}
		);
	});

	describe('parseMetadata()', function () {
		leche.withData(
			{
				'string value': ['foo=bar', { foo: 'bar' }],
				'string value with spaces': [
					'foo=bar and such',
					{ foo: 'bar and such' },
				],
				'string value with equal sign': ['foo=a=b=c', { foo: 'a=b=c' }],
				'string value with spaces and equal sign': [
					'foo=When x=2, then...',
					{ foo: 'When x=2, then...' },
				],
				'integer value': ['bar=#100', { bar: 100 }],
				'float value': ['bar=#98.6', { bar: 98.6 }],
				'empty array value': ['baz=[]', { baz: [] }],
				'string array values': [
					'baz=[foo,bar]',
					{
						baz: ['foo', 'bar'],
					},
				],
				'string array values with equals sign': [
					'quux=[x=2,y=5]',
					{
						quux: ['x=2', 'y=5'],
					},
				],
				'string array values with escaped comma': [
					String.raw`quux=[comma (\,),period (.)]`,
					{
						quux: ['comma (,)', 'period (.)'],
					},
				],
				'key with escaped equal sign': [
					String.raw`x\=y?=yes`,
					{ 'x=y?': 'yes' },
				],
				'string value with leading octothrope': [
					'hexColor=#ffffff',
					{ hexColor: '#ffffff' },
				],
				'string value with escaped leading octothorpe': [
					String.raw`hexColor=\#123456`,
					{ hexColor: '#123456' },
				],
				'string value with escaped leading bracket': [
					String.raw`quux=\[sic]`,
					{ quux: '[sic]' },
				],
				'array value with special characters in elements': [
					'blah=[#@%$,[stuff]]',
					{
						blah: ['#@%$', '[stuff]'],
					},
				],
				'string value with leading literal backslash and octothorpe': [
					String.raw`grawlix=\\#*(^`,
					{ grawlix: String.raw`\#*(^` },
				],
				'string value with leading literal backslash and bracket': [
					String.raw`grawlix=\\[^%$#!]`,
					{ grawlix: String.raw`\[^%$#!]` },
				],
				'key with trailing backslash': [
					String.raw`ugh\\=escapes`,
					{ 'ugh\\': 'escapes' },
				],
				'string value of octothorpe': ['pound=#', { pound: '#' }],
				'string value of opening bracket': [
					'bracket=[',
					{ bracket: '[' },
				],
				'combination of many edge cases': [
					String.raw`x\=y=[#fff,#333]`,
					{
						'x=y': ['#fff', '#333'],
					},
				],
				'numeric value with unnecessary escape': [
					String.raw`foo=#3\33`,
					{ foo: 333 },
				],
				'string value that looks like number': [
					'foo=#3cc',
					{ foo: '#3cc' },
				],
				'negative numeric value': ['foo=#-1', { foo: -1 }],
				'decimal numeric value without leading zero': [
					'bar=#.5',
					{ bar: 0.5 },
				],
				'negative decimal value without leading zero': [
					'delta=#-.5',
					{ delta: -0.5 },
				],
				'string value that looks like negative decimal without digits':
					['emoticon=#-.', { emoticon: '#-.' }],
			},
			function (value, expectedOutput) {
				it('should correctly parse metadata key-value pair', function () {
					let parsedPair = cliUtilities.parseMetadata(value);
					assert.deepEqual(parsedPair, expectedOutput);
				});
			}
		);
	});

	describe('parseMetadataOp()', function () {
		leche.withData(
			{
				'path with string value': [
					'/foo=bar',
					{
						path: '/foo',
						value: 'bar',
					},
				],
				'path with string value with spaces': [
					'/foo=bar and such',
					{
						path: '/foo',
						value: 'bar and such',
					},
				],
				'path with string value with equal sign': [
					'/foo=a=b=c',
					{
						path: '/foo',
						value: 'a=b=c',
					},
				],
				'path with string value with spaces and equal sign': [
					'/foo=When x=2, then...',
					{
						path: '/foo',
						value: 'When x=2, then...',
					},
				],
				'path with integer value': [
					'/bar=#100',
					{
						path: '/bar',
						value: 100,
					},
				],
				'path with float value': [
					'/bar=#98.6',
					{
						path: '/bar',
						value: 98.6,
					},
				],
				'path with empty array value': [
					'/baz=[]',
					{
						path: '/baz',
						value: [],
					},
				],
				'path with string array values': [
					'/baz=[foo,bar]',
					{
						path: '/baz',
						value: ['foo', 'bar'],
					},
				],
				'path with string array values with equals sign': [
					'/quux=[x=2,y=5]',
					{
						path: '/quux',
						value: ['x=2', 'y=5'],
					},
				],
				'path with string array values with escaped comma': [
					String.raw`/quux=[comma (\,),period (.)]`,
					{
						path: '/quux',
						value: ['comma (,)', 'period (.)'],
					},
				],
				'path with escaped equal sign': [
					String.raw`/x\=y?=yes`,
					{
						path: '/x=y?',
						value: 'yes',
					},
				],
				'path with string value with leading octothrope': [
					'/hexColor=#ffffff',
					{
						path: '/hexColor',
						value: '#ffffff',
					},
				],
				'path with string value with escaped leading octothorpe': [
					String.raw`/hexColor=\#123456`,
					{
						path: '/hexColor',
						value: '#123456',
					},
				],
				'path with string value with escaped leading bracket': [
					String.raw`/quux=\[sic]`,
					{
						path: '/quux',
						value: '[sic]',
					},
				],
				'path with array value with special characters in elements': [
					'/blah=[#@%$,[stuff]]',
					{
						path: '/blah',
						value: ['#@%$', '[stuff]'],
					},
				],
				'path with string value with leading literal backslash and octothorpe':
					[
						String.raw`/grawlix=\\#*(^`,
						{
							path: '/grawlix',
							value: String.raw`\#*(^`,
						},
					],
				'path with string value with leading literal backslash and bracket':
					[
						String.raw`/grawlix=\\[^%$#!]`,
						{
							path: '/grawlix',
							value: String.raw`\[^%$#!]`,
						},
					],
				'path with trailing backslash': [
					String.raw`/ugh\\=escapes`,
					{
						path: '/ugh\\',
						value: 'escapes',
					},
				],
				'path with string value of octothorpe': [
					'/pound=#',
					{
						path: '/pound',
						value: '#',
					},
				],
				'path string value of opening bracket': [
					'/bracket=[',
					{
						path: '/bracket',
						value: '[',
					},
				],
				'path with value, both having a combination of many edge cases':
					[
						String.raw`/x\=y=[#fff,#333]`,
						{
							path: '/x=y',
							value: ['#fff', '#333'],
						},
					],
				'path with numeric value with unnecessary escape': [
					String.raw`/foo=#3\33`,
					{
						path: '/foo',
						value: 333,
					},
				],
				'path with string value that looks like number': [
					'/foo=#3cc',
					{
						path: '/foo',
						value: '#3cc',
					},
				],
				'path with negative numeric value': [
					'/foo=#-1',
					{
						path: '/foo',
						value: -1,
					},
				],
				'path with decimal numeric value without leading zero': [
					'/bar=#.5',
					{
						path: '/bar',
						value: 0.5,
					},
				],
				'path with negative decimal value without leading zero': [
					'/delta=#-.5',
					{
						path: '/delta',
						value: -0.5,
					},
				],
				'path with string value that looks like negative decimal without digits':
					[
						'/emoticon=#-.',
						{
							path: '/emoticon',
							value: '#-.',
						},
					],
				'paths from and to': [
					'/foo>/bar',
					{
						from: '/foo',
						path: '/bar',
					},
				],
				'path from and to with escaped equal sign': [
					String.raw`/x\=y?>/y\=x?`,
					{
						from: '/x=y?',
						path: '/y=x?',
					},
				],
				'paths with escaped angle bracket': [
					String.raw`/x\>y?>/y<\=x?`,
					{
						from: '/x>y?',
						path: '/y<=x?',
					},
				],
				'single path': [
					'/foo',
					{
						path: '/foo',
					},
				],
				'single path with escaped characters': [
					String.raw`/x\>\=y?`,
					{
						path: '/x>=y?',
					},
				],
				'simple key': [
					'foo',
					{
						path: '/foo',
					},
				],
				'key with string value': [
					'foo=bar',
					{
						path: '/foo',
						value: 'bar',
					},
				],
				'path with nested index': [
					'/options/0=new option',
					{
						path: '/options/0',
						value: 'new option',
					},
				],
				'path with nested key': [
					'/foo/bar=baz',
					{
						path: '/foo/bar',
						value: 'baz',
					},
				],
				'path with terminal': [
					'/options/-=next',
					{
						path: '/options/-',
						value: 'next',
					},
				],
				'key with subscript index': [
					'foo[0]=bar',
					{
						path: '/foo/0',
						value: 'bar',
					},
				],
				'key with subscript key': [
					'foo[bar]=baz',
					{
						path: '/foo/bar',
						value: 'baz',
					},
				],
				'key with terminal': [
					'foo[]=quux',
					{
						path: '/foo/-',
						value: 'quux',
					},
				],
				'path with escaped slash': [
					String.raw`/foo\/bar=baz`,
					{
						path: '/foo~1bar',
						value: 'baz',
					},
				],
				'path with tilde escape code': [
					'/foo~0bar=wat',
					{
						path: '/foo~0bar',
						value: 'wat',
					},
				],
				'path with slash escape code': [
					'/foo~1bar=huh',
					{
						path: '/foo~1bar',
						value: 'huh',
					},
				],
				'path with escaped tilde in segment': [
					String.raw`/foo\~bar=ugh`,
					{
						path: '/foo~0bar',
						value: 'ugh',
					},
				],
			},
			function (value, expectedOutput) {
				it('should correctly parse op input', function () {
					let parsedOp = cliUtilities.parseMetadataOp(value);
					assert.deepEqual(parsedOp, expectedOutput);
				});
			}
		);
	});

	describe('checkDir()', function () {
		it('should create directory if create flag is true', async function () {
			const destination = `${process.cwd()}/temp`;
			await cliUtilities.checkDir(destination, true);
			assert.isTrue(fs.existsSync(destination));
			fs.rmdirSync(destination);
		});

		it('should create nested directory if create flag is true', async function () {
			const destination = `${process.cwd()}/nestedTemp`;
			const nestedDestination = `${destination}/temp`;
			await cliUtilities.checkDir(nestedDestination, true);
			assert.isTrue(fs.existsSync(nestedDestination));
			fs.rmdirSync(nestedDestination);
			fs.rmdirSync(destination);
		});

		it('should throw expection if directory does not exist and create flag is false', function () {
			const destination = `${process.cwd()}/nonExistingPath`;
			const retrieveException = async () => {
				await cliUtilities.checkDir(destination, false);
			};
			return assert.isRejected(retrieveException(), Error);
		});
	});
});
