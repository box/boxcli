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
	createCollaboration(args, flags) {

		let params = {
			body: {
				item: {
					type: args.itemType,
					id: args.itemID,
				},
				accessible_by: {}
			},
			qs: {}
		};

		if (flags.fields) {
			params.qs.fields = flags.fields;
		}
		if (flags.hasOwnProperty('notify')) {
			params.qs.notify = flags.notify;
		}
		if (flags.hasOwnProperty('can-view-path')) {
			params.body.can_view_path = flags['can-view-path'];
		}
		if (flags.role) {
			params.body.role = flags.role.replace('_', ' ');
		} else if (flags.editor) {
			params.body.role = this.client.collaborationRoles.EDITOR;
		} else if (flags.viewer) {
			params.body.role = this.client.collaborationRoles.VIEWER;
		} else if (flags.previewer) {
			params.body.role = this.client.collaborationRoles.PREVIEWER;
		} else if (flags.uploader) {
			params.body.role = this.client.collaborationRoles.UPLOADER;
		} else if (flags['previewer-uploader']) {
			params.body.role = this.client.collaborationRoles.PREVIEWER_UPLOADER;
		} else if (flags['viewer-uploader']) {
			params.body.role = this.client.collaborationRoles.VIEWER_UPLOADER;
		} else if (flags['co-owner']) {
			params.body.role = this.client.collaborationRoles.CO_OWNER;
		}
		if (!params.body.role) {
			throw new Error(`Missing required flag for collaboration role`)
		}

		if (flags['user-id']) {
			params.body.accessible_by.type = 'user';
			params.body.accessible_by.id = flags['user-id'];
		} else if (flags['group-id']) {
			params.body.accessible_by.type = 'group';
			params.body.accessible_by.id = flags['group-id'];
		} else if (flags.login) {
			params.body.accessible_by.type = 'user';
			params.body.accessible_by.login = flags.login;
		}

		// @TODO (2018-07-07): Should implement this using the Node SDK
		return this.client.wrapWithDefaultHandler(this.client.post)('/collaborations', params);
	}
}

module.exports = CollaborationModule;
