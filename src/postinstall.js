'use strict';

const fs = require('node:fs');
const path = require('node:path');

fs.rmSync(path.join('node_modules', '@github', 'keytar', 'build'), {
	recursive: true,
	force: true,
});
