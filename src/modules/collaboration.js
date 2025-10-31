'use strict';

/**
 * Module for shared code around collaboration endpoints
 */
class CollaborationModule {
	/**
	 * @param {BoxClient} client The client to use for API requests
	 * @constructor
	 */
	constructor(client) {
		this.client = client;
	}

	/**
	 * Create a collaboration on an item for a user
	 *
	 * @param {Object} args The parsed oclif command-line arguments
	 * @param {Object} flags The parsed oclif command-line flags
	 * @returns {Promise<Object>} A promise resolving to the created collaboration object
	 */
	createCollaboration(arguments_, flags) {
		let parameters = {
			body: {
				item: {
					type: arguments_.itemType,
					id: arguments_.itemID,
				},
				accessible_by: {},
			},
			qs: {},
		};

		if (flags.fields) {
			parameters.qs.fields = flags.fields;
		}
		if (flags.hasOwnProperty('notify')) {
			parameters.qs.notify = flags.notify;
		}
		if (flags.hasOwnProperty('can-view-path')) {
			parameters.body.can_view_path = flags['can-view-path'];
		}
		if (flags.role) {
			parameters.body.role = flags.role.replace('_', ' ');
		} else if (flags.editor) {
			parameters.body.role = this.client.collaborationRoles.EDITOR;
		} else if (flags.viewer) {
			parameters.body.role = this.client.collaborationRoles.VIEWER;
		} else if (flags.previewer) {
			parameters.body.role = this.client.collaborationRoles.PREVIEWER;
		} else if (flags.uploader) {
			parameters.body.role = this.client.collaborationRoles.UPLOADER;
		} else if (flags['previewer-uploader']) {
			parameters.body.role =
				this.client.collaborationRoles.PREVIEWER_UPLOADER;
		} else if (flags['viewer-uploader']) {
			parameters.body.role =
				this.client.collaborationRoles.VIEWER_UPLOADER;
		} else if (flags['co-owner']) {
			parameters.body.role = this.client.collaborationRoles.CO_OWNER;
		}
		if (!parameters.body.role) {
			throw new Error('Missing required flag for collaboration role');
		}

		if (flags['user-id']) {
			parameters.body.accessible_by.type = 'user';
			parameters.body.accessible_by.id = flags['user-id'];
		} else if (flags['group-id']) {
			parameters.body.accessible_by.type = 'group';
			parameters.body.accessible_by.id = flags['group-id'];
		} else if (flags.login) {
			parameters.body.accessible_by.type = 'user';
			parameters.body.accessible_by.login = flags.login;
		}

		// @TODO (2018-07-07): Should implement this using the Node SDK
		return this.client.wrapWithDefaultHandler(this.client.post)(
			'/collaborations',
			parameters
		);
	}
}

module.exports = CollaborationModule;
