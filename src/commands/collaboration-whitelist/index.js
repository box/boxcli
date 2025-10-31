'use strict';

const CollaborationAllowlistListCommand = require('../collaboration-allowlist');

class CollaborationWhitelistListCommand extends CollaborationAllowlistListCommand {}

for (const name of ['description', 'examples', '_endpoint', 'flags']) {
	CollaborationWhitelistListCommand[name] =
		CollaborationAllowlistListCommand[name];
}

CollaborationWhitelistListCommand.hidden = true;

module.exports = CollaborationWhitelistListCommand;
