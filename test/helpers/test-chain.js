'use strict';

const { fancy } = require('fancy-test');
const { Config, toStandardizedId } = require('@oclif/core');
const path = require('node:path');

function traverseFilePathUntil(filename, predicate) {
	let current = filename;
	while (!predicate(current)) {
		current = path.dirname(current);
	}
	return current;
}

const root =
	process.env.OCLIF_TEST_ROOT ??
	Object.values(require.cache).find((m) => m?.children?.includes(module))
		?.filename ??
	traverseFilePathUntil(
		require.main?.path ?? module.path,
		(p) =>
			!(
				p.includes('node_modules') ||
				p.includes('.pnpm') ||
				p.includes('.yarn')
			)
	);

function loadConfig(opts = {}) {
	return {
		async run(ctx) {
			ctx.config = await Config.load(opts.root || root);
			return ctx.config;
		},
	};
}

const castArray = (input) => {
	if (input === undefined) return [];
	return Array.isArray(input) ? input : [input];
};

function command(args, opts = {}) {
	return {
		async run(ctx) {
			if (!ctx.config || opts.reset) {
				ctx.config = await loadConfig(opts).run(ctx);
			}
			args = castArray(args);
			const [id, ...extra] = args;
			let cmdId = toStandardizedId(id, ctx.config);
			if (cmdId === '.') cmdId = Symbol('SINGLE_COMMAND_CLI').toString();
			ctx.expectation ||= `runs ${args.join(' ')}`;
			await ctx.config.runHook('init', { argv: extra, id: cmdId });
			ctx.returned = await ctx.config.runCommand(cmdId, extra);
		},
	};
}

const test = fancy
	.register('loadConfig', loadConfig)
	.register('command', command)
	.env({ NODE_ENV: 'test' });

module.exports = { test };
