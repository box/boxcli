// eslint.config.js
const js = require('@eslint/js');
const pluginPromise = require('eslint-plugin-promise');
const pluginUnicorn = require('eslint-plugin-unicorn').default;
const pluginN = require('eslint-plugin-n');
const prettier = require('eslint-config-prettier');
const pluginMocha = require('eslint-plugin-mocha').default;
const globals = require('globals');

module.exports = [
	js.configs.recommended,
	{
		files: ['**/*.js'],
		ignores: ['dist/**', 'tmp/**', 'coverage/**'],
		languageOptions: {
			ecmaVersion: 2022,
			sourceType: 'commonjs',
			globals: {
				// Node.js globals
				...globals.node,
				...globals.mocha,
			},
		},
		plugins: {
			promise: pluginPromise,
			unicorn: pluginUnicorn,
			n: pluginN,
			mocha: pluginMocha,
		},
		rules: {
			...pluginPromise.configs.recommended.rules,
			...pluginN.configs.recommended.rules,
			...pluginUnicorn.configs.recommended.rules,
			...pluginMocha.configs.recommended.rules,
			// Give warnings for rules should fix in the future
			'no-prototype-builtins': 'warn',
			// Disable rules that don't fit this CommonJS project
			'unicorn/prefer-module': 'off',
			'unicorn/prevent-abbreviations': 'off',
			'unicorn/no-null': 'off',
			'unicorn/prefer-spread': 'warn',
			'unicorn/no-immediate-mutation': 'warn',
			'unicorn/prefer-single-call': 'warn',
			'unicorn/no-array-reduce': 'warn',
			'unicorn/no-await-expression-member': 'warn',
			'unicorn/prefer-structured-clone': 'warn',
			// Disable Mocha rule that doesn't fit existing test patterns
			'mocha/no-setup-in-describe': 'off',
		},
	},
	prettier,
];
