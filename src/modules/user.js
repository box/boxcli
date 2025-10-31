'use strict';

/**
 * Module for shared code around user endpoints
 */
class UserModule {
	/**
	 * @param {BoxClient} client The client to use for API requests
	 * @constructor
	 */
	constructor(client) {
		this.client = client;
	}

	/**
	 * List the users in an enterprise using optional filters
	 *
	 * @param {Object} flags The parsed oclif command-line flags
	 * @returns {Promise<Object>} A promise resolving to the collection of user objects
	 */
	listUsers(flags) {
		let options = {};

		if (flags.fields) {
			options.fields = flags.fields;
		}

		if (flags['all-users']) {
			options.user_type = 'all';
		} else if (flags['managed-users']) {
			options.user_type = 'managed';
		} else if (flags['app-users']) {
			options.filter_term = 'AppUser_';
		} else if (flags['external-users']) {
			options.user_type = 'external';
		}

		if (flags.limit) {
			options.limit = flags.limit;
		}

		// forcing offset based pagination for now. Using filter_term causes infinite loop because next_marker is never null
		// if (flags.usemarker) {
		// 	options.usemarker = flags.usemarker;
		// }

		if (flags.filter) {
			options.filter_term = flags.filter;
		}

		return this.client.enterprise.getUsers(options);
	}
}

module.exports = UserModule;
