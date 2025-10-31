// prettier.config.js, .prettierrc.js, prettier.config.cjs, or .prettierrc.cjs

/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
	trailingComma: 'es5',
	tabWidth: 4,
	semi: true,
	singleQuote: true,
	overrides: [
		{
			files: '*.json',
			options: {
				useTabs: false,
			},
		},
	],
};

module.exports = config;
