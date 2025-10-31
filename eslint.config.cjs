// eslint.config.js
const js = require('@eslint/js');
const pluginPromise = require('eslint-plugin-promise');
const pluginUnicorn = require('eslint-plugin-unicorn');
const pluginN = require('eslint-plugin-n');
const prettier = require('eslint-config-prettier');

module.exports = [
	{
		ignores: ['dist/**', 'tmp/**', 'coverage/**'],
		plugins: {
			promise: pluginPromise,
			unicorn: pluginUnicorn,
			n: pluginN,
		},
	},
	prettier,
]
