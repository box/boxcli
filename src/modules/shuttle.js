'use strict';

/**
 * Shared helpers for Shuttle CLI commands: oclif flag defs and sdk-gen request
 * body builders (camelCase). Not a client wrapper — commands call
 * `this.tsClient.shuttle.*` directly (same pattern as hubs).
 */

const fs = require('node:fs');
const { Flags } = require('@oclif/core');

function parseJsonValue(raw, flagName) {
	if (raw === undefined || raw === null || raw === '') {
		return;
	}
	try {
		return JSON.parse(raw);
	} catch (error) {
		throw new Error(`Invalid JSON for --${flagName}: ${error.message}`);
	}
}

/**
 * Convert wire-format (snake_case) JSON keys to sdk-gen camelCase.
 * Safe for already-camelCase input (keys without `_` are unchanged).
 */
function snakeToCamelKey(key) {
	return key.replaceAll(/_([a-z0-9])/g, (_, ch) => ch.toUpperCase());
}

function snakeToCamel(value) {
	if (Array.isArray(value)) {
		return value.map((item) => snakeToCamel(item));
	}
	if (
		value &&
		typeof value === 'object' &&
		Object.getPrototypeOf(value) === Object.prototype
	) {
		const out = {};
		for (const [key, child] of Object.entries(value)) {
			out[snakeToCamelKey(key)] = snakeToCamel(child);
		}
		return out;
	}
	return value;
}

function readBodyOverride(flags) {
	if (flags.body !== undefined) {
		const parsed = parseJsonValue(flags.body, 'body');
		if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
			throw new Error('--body must be a JSON object');
		}
		return snakeToCamel(parsed);
	}
	if (flags['body-file']) {
		const content = fs.readFileSync(flags['body-file'], 'utf8');
		const parsed = parseJsonValue(content, 'body-file');
		if (parsed === null || typeof parsed !== 'object' || Array.isArray(parsed)) {
			throw new Error('--body-file must contain a JSON object');
		}
		return snakeToCamel(parsed);
	}
	return null;
}

function resolveBody(flags, buildFromFlags) {
	const override = readBodyOverride(flags);
	if (override) {
		return override;
	}
	return buildFromFlags();
}

const bodyFlags = Object.freeze({
	body: Flags.string({
		description:
			'Escape hatch: full JSON request body (snake_case or camelCase). When set, other body-building flags are ignored.',
	}),
	'body-file': Flags.string({
		description:
			'Escape hatch: path to a JSON file used as the full request body.',
		exclusive: ['body'],
	}),
});

function flagSet(flags, name) {
	return Object.hasOwn(flags, name);
}

function hasAny(flags, names) {
	return names.some((name) => flagSet(flags, name));
}

/** Appended to Shuttle command descriptions for agent-oriented help. */
const SHUTTLE_PERMISSIONS =
	'Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).';

/**
 * Flat flags for a path-mapping location (source or target).
 * @param {'source'|'target'} prefix
 * @param {{ allowIsDirectory?: boolean }} [options]
 */
function pathLocationFlags(prefix, options = {}) {
	const { allowIsDirectory = false } = options;
	const flags = {
		[`${prefix}-type`]: Flags.string({
			description: `${prefix} location type. Accepted values: account, shared_space`,
			options: ['account', 'shared_space'],
		}),
		[`${prefix}-path`]: Flags.string({
			description: `${prefix} path`,
		}),
		[`${prefix}-path-id`]: Flags.string({
			description: `${prefix} path ID from browsing`,
		}),
		[`${prefix}-account-id`]: Flags.string({
			description: `${prefix} account id (account type)`,
		}),
		[`${prefix}-account-email`]: Flags.string({
			description: `${prefix} account email (account type)`,
		}),
		[`${prefix}-space`]: Flags.string({
			description: `${prefix} shared container name (shared_space type)`,
		}),
	};
	if (allowIsDirectory) {
		flags[`${prefix}-is-directory`] = Flags.boolean({
			description: `Whether the ${prefix} path is a directory`,
			allowNo: true,
		});
	}
	return flags;
}

/**
 * Build a path location object (sdk-gen camelCase), or undefined if none set.
 * @param {Object} flags
 * @param {'source'|'target'} prefix
 * @param {{ required?: boolean, allowIsDirectory?: boolean, command?: { error: Function } }} [options]
 */
function buildPathLocation(flags, prefix, options = {}) {
	const { required = false, allowIsDirectory = false, command } = options;
	const typeKey = `${prefix}-type`;
	const pathKey = `${prefix}-path`;
	const pathIdKey = `${prefix}-path-id`;
	const accountIdKey = `${prefix}-account-id`;
	const accountEmailKey = `${prefix}-account-email`;
	const spaceKey = `${prefix}-space`;
	const isDirectoryKey = `${prefix}-is-directory`;

	const relevant = [
		typeKey,
		pathKey,
		pathIdKey,
		accountIdKey,
		accountEmailKey,
		spaceKey,
	];
	if (allowIsDirectory) {
		relevant.push(isDirectoryKey);
	}

	if (!hasAny(flags, relevant)) {
		if (required && command) {
			command.error(
				`--${typeKey} and --${pathKey} are required (or pass --body / --body-file).`
			);
		}
		return;
	}

	const type = flags[typeKey];
	const path = flags[pathKey];
	if (!type || !path) {
		if (command) {
			command.error(
				`--${typeKey} and --${pathKey} are required when setting a ${prefix} location.`
			);
		}
		throw new Error(`Missing --${typeKey} or --${pathKey}`);
	}

	const location = { type, path };
	if (flags[pathIdKey] !== undefined) {
		location.pathId = flags[pathIdKey];
	}
	if (allowIsDirectory && flagSet(flags, isDirectoryKey)) {
		location.isDirectory = flags[isDirectoryKey];
	}

	if (type === 'account') {
		const account = {};
		if (flags[accountIdKey] !== undefined) {
			account.id = flags[accountIdKey];
		}
		if (flags[accountEmailKey] !== undefined) {
			account.email = flags[accountEmailKey];
		}
		if (Object.keys(account).length === 0) {
			if (command) {
				command.error(
					`--${accountIdKey} and/or --${accountEmailKey} are required when --${typeKey}=account.`
				);
			}
			throw new Error(`Missing account fields for ${prefix}`);
		}
		location.account = account;
	} else if (type === 'shared_space' && flags[spaceKey] !== undefined) {
			location.space = flags[spaceKey];
		}

	return location;
}

const subjectTargetFlags = Object.freeze({
	'target-type': Flags.string({
		description: 'Box target subject type. Accepted values: user, group',
		options: ['user', 'group'],
	}),
	'target-id': Flags.string({
		description: 'Box target subject ID',
	}),
	'clear-target': Flags.boolean({
		description: 'Set target to null (e.g. when skipping the subject)',
		default: false,
	}),
});

function buildSubjectTarget(flags, options = {}) {
	const { command } = options;
	if (flags['clear-target']) {
		return null;
	}
	if (flags['target-type'] === undefined && flags['target-id'] === undefined) {
		return;
	}
	if (!flags['target-type'] || !flags['target-id']) {
		if (command) {
			command.error(
				'--target-type and --target-id are required together (or use --clear-target).'
			);
		}
		throw new Error('Incomplete subject target flags');
	}
	return {
		type: flags['target-type'],
		id: flags['target-id'],
	};
}

const scheduleTriggerFlags = Object.freeze({
	'trigger-type': Flags.string({
		description: 'Schedule trigger type. Accepted values: by_time, by_job',
		options: ['by_time', 'by_job'],
	}),
	'start-at': Flags.string({
		description:
			'Local start time for by_time trigger (YYYY-MM-DDTHH:MM:SS, no Z)',
	}),
	'time-zone': Flags.string({
		description: 'IANA time zone for by_time trigger',
	}),
	repeat: Flags.string({
		description:
			'Repeat cadence for by_time trigger. Accepted values: none, daily, weekly, weekdays, weekends',
		options: ['none', 'daily', 'weekly', 'weekdays', 'weekends'],
	}),
	'triggered-by-job-id': Flags.string({
		description: 'Triggering job ID for by_job trigger',
	}),
	'last-run-condition': Flags.string({
		description:
			'Condition on the triggering job last run. Accepted values: always, on_success, on_finish',
		options: ['always', 'on_success', 'on_finish'],
	}),
});

function buildScheduleTrigger(flags, options = {}) {
	const { required = false, command } = options;
	const relevant = [
		'trigger-type',
		'start-at',
		'time-zone',
		'repeat',
		'triggered-by-job-id',
		'last-run-condition',
	];
	if (!hasAny(flags, relevant)) {
		if (required && command) {
			command.error(
				'--trigger-type and matching trigger fields are required (or pass --body / --body-file).'
			);
		}
		return;
	}

	const type = flags['trigger-type'];
	if (!type) {
		if (command) {
			command.error('--trigger-type is required when setting a trigger.');
		}
		throw new Error('Missing --trigger-type');
	}

	if (type === 'by_time') {
		if (!flags['start-at'] || !flags['time-zone'] || !flags.repeat) {
			if (command) {
				command.error(
					'--start-at, --time-zone, and --repeat are required for --trigger-type=by_time.'
				);
			}
			throw new Error('Incomplete by_time trigger');
		}
		return {
			type: 'by_time',
			startAt: flags['start-at'],
			timeZone: flags['time-zone'],
			repeat: flags.repeat,
		};
	}

	if (type === 'by_job') {
		if (!flags['triggered-by-job-id'] || !flags['last-run-condition']) {
			if (command) {
				command.error(
					'--triggered-by-job-id and --last-run-condition are required for --trigger-type=by_job.'
				);
			}
			throw new Error('Incomplete by_job trigger');
		}
		return {
			type: 'by_job',
			triggeredByJobId: flags['triggered-by-job-id'],
			lastRunCondition: flags['last-run-condition'],
		};
	}

	if (command) {
		command.error(`Unsupported --trigger-type: ${type}`);
	}
	throw new Error(`Unsupported trigger type: ${type}`);
}

const jobAccountMappingFlags = Object.freeze({
	'account-mapping-enabled': Flags.boolean({
		description: 'Enable account mapping for the job',
		allowNo: true,
	}),
	'permission-conflict-strategy': Flags.string({
		description:
			'Permission conflict strategy. Accepted values: preserve_structure_restrict_sharing, preserve_structure_expand_sharing, preserve_sharing_modify_structure, warn_permissions_conflicts',
		options: [
			'preserve_structure_restrict_sharing',
			'preserve_structure_expand_sharing',
			'preserve_sharing_modify_structure',
			'warn_permissions_conflicts',
		],
	}),
	'are-external-shares-mapped': Flags.boolean({
		description: 'Map external shares',
		allowNo: true,
	}),
	'are-permissions-mapped': Flags.boolean({
		description: 'Map permissions',
		allowNo: true,
	}),
});

function buildAccountMapping(flags) {
	const body = {};
	if (flagSet(flags, 'account-mapping-enabled')) {
		body.isEnabled = flags['account-mapping-enabled'];
	}
	if (flagSet(flags, 'permission-conflict-strategy')) {
		body.permissionConflictStrategy =
			flags['permission-conflict-strategy'];
	}
	if (flagSet(flags, 'are-external-shares-mapped')) {
		body.areExternalSharesMapped = flags['are-external-shares-mapped'];
	}
	if (flagSet(flags, 'are-permissions-mapped')) {
		body.arePermissionsMapped = flags['are-permissions-mapped'];
	}
	return Object.keys(body).length > 0 ? body : undefined;
}

const jobSettingsFlags = Object.freeze({
	'bandwidth-limit-bytes-per-sec': Flags.integer({
		description: 'Max transfer bandwidth in bytes/sec',
	}),
	'are-deletions-mirrored': Flags.boolean({
		description: 'Mirror source deletions in Box',
		allowNo: true,
	}),
	'are-file-versions-synced': Flags.boolean({
		description: 'Sync prior file versions',
		allowNo: true,
	}),
	'max-file-versions': Flags.integer({
		description: 'Max file versions to sync',
	}),
	'is-overwrite-enabled': Flags.boolean({
		description: 'Overwrite existing files in Box',
		allowNo: true,
	}),
	'are-completed-mappings-skipped-on-rerun': Flags.boolean({
		description: 'Skip completed mappings on rerun',
		allowNo: true,
	}),
	'is-content-scanning-enabled': Flags.boolean({
		description: 'Enable content scanning when supported',
		allowNo: true,
	}),
	'include-shared-source-folders': Flags.boolean({
		description: 'Include shared folders on the source',
		allowNo: true,
	}),
	'include-shared-destination-folders': Flags.boolean({
		description: 'Include shared folders on the destination',
		allowNo: true,
	}),
});

function buildSettings(flags) {
	const map = {
		'bandwidth-limit-bytes-per-sec': 'bandwidthLimitBytesPerSec',
		'are-deletions-mirrored': 'areDeletionsMirrored',
		'are-file-versions-synced': 'areFileVersionsSynced',
		'max-file-versions': 'maxFileVersions',
		'is-overwrite-enabled': 'isOverwriteEnabled',
		'are-completed-mappings-skipped-on-rerun':
			'areCompletedMappingsSkippedOnRerun',
		'is-content-scanning-enabled': 'isContentScanningEnabled',
		'include-shared-source-folders': 'includeSharedSourceFolders',
		'include-shared-destination-folders': 'includeSharedDestinationFolders',
	};
	const body = {};
	for (const [flagName, apiName] of Object.entries(map)) {
		if (flagSet(flags, flagName)) {
			body[apiName] = flags[flagName];
		}
	}
	return Object.keys(body).length > 0 ? body : undefined;
}

module.exports = {
	SHUTTLE_PERMISSIONS,
	flagSet,
	parseJsonValue,
	snakeToCamel,
	readBodyOverride,
	resolveBody,
	bodyFlags,
	pathLocationFlags,
	buildPathLocation,
	subjectTargetFlags,
	buildSubjectTarget,
	scheduleTriggerFlags,
	buildScheduleTrigger,
	jobAccountMappingFlags,
	buildAccountMapping,
	jobSettingsFlags,
	buildSettings,
};
