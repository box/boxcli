'use strict';

const fs = require('node:fs');
const path = require('node:path');

const keytarDir = path.dirname(
	require.resolve('@github/keytar/package.json')
);

fs.rmSync(path.join(keytarDir, 'build'), {
	recursive: true,
	force: true,
});
