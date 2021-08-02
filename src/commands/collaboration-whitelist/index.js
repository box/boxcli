'use strict';

const CollaborationAllowlistListCommand = require('../collaboration-allowlist');

class CollaborationWhitelistListCommand extends CollaborationAllowlistListCommand {}

['description', 'examples', '_endpoint', 'flags'].forEach((name) => {
	CollaborationWhitelistListCommand[name] =
		CollaborationAllowlistListCommand[name];
});

CollaborationWhitelistListCommand.hidden = true;

module.exports = CollaborationWhitelistListCommand;
