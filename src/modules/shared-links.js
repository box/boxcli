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
	createSharedLink(args, flags) {

		let updates = { shared_link: { permissions: {} } };

		if (flags.access) {
			updates.shared_link.access = flags.access;
		}
		if (flags.password) {
			updates.shared_link.password = flags.password;
		}
		if (flags['unshared-at']) {
			updates.shared_link.unshared_at = flags['unshared-at'];
		}
		if (flags.hasOwnProperty('can-download')) {
			updates.shared_link.permissions.can_download = flags['can-download'];
		}

		if (args.itemType === 'file') {
			return this.client.files.update(args.itemID, updates);
		} else if (args.itemType === 'folder') {
			return this.client.folders.update(args.itemID, updates);
		}
		throw new BoxCLIError(`Unsupported item type for shared link creation: ${args.itemType}`);
	}

	/**
     * Remove a shared link from an item
     *
     * @param {Object} args The parsed oclif command-line arguments
     * @returns {Promise<Object>} A promise resolving to the updated item object
     */
	removeSharedLink(args) {

		let updates = { shared_link: null };

		if (args.itemType === 'file') {
			return this.client.files.update(args.itemID, updates);
		} else if (args.itemType === 'folder') {
			return this.client.folders.update(args.itemID, updates);
		}
		throw new BoxCLIError(`Unsupported item type for shared link removal: ${args.itemType}`);
	}
}

module.exports = SharedLinksModule;
