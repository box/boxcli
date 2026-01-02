'use strict';

const BoxCLIError = require('../cli-error');

/**
 * Module for shared code around shared links functionality
 */
class SharedLinksModule {
	/**
	 * @param {BoxClient} client The client to use for API requests
	 * @constructor
	 */
	constructor(client) {
		this.client = client;
	}

	/**
	 * Create a shared link for an item
	 *
	 * @param {Object} args The parsed oclif command-line arguments
	 * @param {Object} flags The parsed oclif command-line flags
	 * @returns {Promise<Object>} A promise resolving to the updated item object
	 */
	createSharedLink(arguments_, flags) {
		let updates = {
			shared_link: { permissions: {} },
			fields: 'shared_link',
		};

		if (flags.access) {
			updates.shared_link.access = flags.access;
		}
		if (flags.password) {
			updates.shared_link.password = flags.password;
		}
		if (flags['unshared-at']) {
			updates.shared_link.unshared_at = flags['unshared-at'];
		}
		if (Object.hasOwn(flags, 'can-download')) {
			updates.shared_link.permissions.can_download =
				flags['can-download'];
		}
		if (flags['vanity-name']) {
			updates.shared_link.vanity_name = flags['vanity-name'];
		}

		if (arguments_.itemType === 'file') {
			if (Object.hasOwn(flags, 'can-edit')) {
				updates.shared_link.permissions.can_edit = flags['can-edit'];
			}
			return this.client.files.update(arguments_.itemID, updates);
		} else if (arguments_.itemType === 'folder') {
			return this.client.folders.update(arguments_.itemID, updates);
		}
		throw new BoxCLIError(
			`Unsupported item type for shared link creation: ${arguments_.itemType}`
		);
	}

	/**
	 * Remove a shared link from an item
	 *
	 * @param {Object} args The parsed oclif command-line arguments
	 * @returns {Promise<Object>} A promise resolving to the updated item object
	 */
	removeSharedLink(arguments_) {
		let updates = { shared_link: null };

		if (arguments_.itemType === 'file') {
			return this.client.files.update(arguments_.itemID, updates);
		} else if (arguments_.itemType === 'folder') {
			return this.client.folders.update(arguments_.itemID, updates);
		}
		throw new BoxCLIError(
			`Unsupported item type for shared link removal: ${arguments_.itemType}`
		);
	}
}

module.exports = SharedLinksModule;
