'use strict';

const { Flags } = require('@oclif/core');
const utilities = require('../util');

const SCHEDULE_RUN_MODES = ['transfer', 'simulation', 'analysis'];
const SCHEDULE_STATES = ['enabled', 'paused'];
const TRIGGER_TYPES = ['by_time', 'by_job'];
const TRIGGER_REPEATS = ['none', 'daily', 'weekly', 'weekdays', 'weekends'];
const TRIGGER_LAST_RUN_CONDITIONS = ['always', 'on_success', 'on_finish'];
const PERMISSION_CONFLICT_STRATEGIES = [
	'preserve_structure_restrict_sharing',
	'preserve_structure_expand_sharing',
	'preserve_sharing_modify_structure',
	'warn_permissions_conflicts',
];
const LOCATION_TYPES = ['account', 'shared_space'];
const SUBJECT_TARGET_TYPES = ['user', 'group'];

const TRIGGER_VARIANTS = {
	by_time: {
		flags: ['start-at', 'time-zone', 'repeat'],
		required: ['start-at', 'time-zone', 'repeat'],
	},
	by_job: {
		flags: ['triggered-by-job-id', 'last-run-condition'],
		required: ['triggered-by-job-id', 'last-run-condition'],
	},
};

const SUBJECT_TARGET_VARIANTS = {
	user: { flags: ['target-id'], required: ['target-id'] },
	group: { flags: ['target-id'], required: ['target-id'] },
};

const ACCOUNT_MAPPING_FIELDS = {
	'account-mapping-enabled': 'isEnabled',
	'permission-conflict-strategy': 'permissionConflictStrategy',
	'external-shares-mapped': 'areExternalSharesMapped',
	'permissions-mapped': 'arePermissionsMapped',
};

const SETTINGS_FIELDS = {
	'bandwidth-limit-bytes-per-sec': 'bandwidthLimitBytesPerSec',
	'deletions-mirrored': 'areDeletionsMirrored',
	'file-versions-synced': 'areFileVersionsSynced',
	'max-file-versions': 'maxFileVersions',
	'overwrite-enabled': 'isOverwriteEnabled',
	'completed-mappings-skipped-on-rerun': 'areCompletedMappingsSkippedOnRerun',
	'content-scanning-enabled': 'isContentScanningEnabled',
	'include-shared-source-folders': 'includeSharedSourceFolders',
	'include-shared-destination-folders': 'includeSharedDestinationFolders',
};

function jobIdFlag(description) {
	return Flags.string({ description, required: true });
}

function runIdFlag(description) {
	return Flags.string({ description, required: true });
}

/**
 * Checks the flags of an object with variants chosen by --<field>-type.
 * Returns false when neither the type nor any variant flag was passed.
 *
 * @param {Object} flags Parsed flags
 * @param {string} field Flag prefix of the object, such as "trigger"
 * @param {Object} variants Allowed, required and required-one-of flags per type
 * @returns {boolean} Whether the object is sent
 */
function checkVariantFlags(flags, field, variants) {
	const typeFlag = `${field}-type`;
	const type = flags[typeFlag];
	const variantFlags = [
		...new Set(Object.values(variants).flatMap((variant) => variant.flags)),
	];
	const passed = variantFlags.filter((name) => Object.hasOwn(flags, name));

	if (type === undefined) {
		if (passed.length > 0) {
			throw new Error(`--${passed[0]} requires --${typeFlag}.`);
		}
		return false;
	}

	const variant = variants[type];
	const foreign = passed.find((name) => !variant.flags.includes(name));
	if (foreign) {
		throw new Error(
			`--${foreign} cannot be used with --${typeFlag}=${type}.`
		);
	}

	const missing = (variant.required || []).filter(
		(name) => !Object.hasOwn(flags, name)
	);
	if (missing.length > 0) {
		throw new Error(
			`--${typeFlag}=${type} requires ${missing.map((name) => `--${name}`).join(', ')}.`
		);
	}

	if (
		variant.requiredOneOf &&
		!variant.requiredOneOf.some((name) => Object.hasOwn(flags, name))
	) {
		throw new Error(
			`--${typeFlag}=${type} requires ${variant.requiredOneOf.map((name) => `--${name}`).join(' or ')}.`
		);
	}

	return true;
}

/**
 * Copies the passed flags to SDK fields. A passed --clear-<flag> sends null.
 *
 * @param {Object} flags Parsed flags
 * @param {Object} fields SDK field name per flag name
 * @returns {Object|undefined} The object, or undefined when no flag was passed
 */
function pickFields(flags, fields) {
	const result = {};
	for (const [flag, field] of Object.entries(fields)) {
		if (Object.hasOwn(flags, flag)) {
			result[field] = flags[flag];
		}
		if (flags[`clear-${flag}`]) {
			result[field] = null;
		}
	}
	return Object.keys(result).length > 0 ? result : undefined;
}

function clearFlag(flag, description) {
	return {
		[`clear-${flag}`]: Flags.boolean({
			description,
			exclusive: [flag],
		}),
	};
}

function jobScheduleFlags({ update = false } = {}) {
	return {
		'run-mode': Flags.string({
			description:
				'Kind of run the schedule starts. One of: transfer, simulation, analysis. scan is not a valid schedule run mode',
			options: SCHEDULE_RUN_MODES,
			required: !update,
		}),
		state: Flags.string({
			description: update
				? 'Whether the schedule is active. One of: enabled, paused'
				: 'Whether the schedule is active. One of: enabled, paused. The API uses enabled when omitted',
			options: SCHEDULE_STATES,
		}),
		description: Flags.string({
			description: 'Human-readable description of the schedule',
			parse: utilities.unescapeSlashes,
		}),
		...(update
			? clearFlag(
					'description',
					'Remove the description of the schedule (sends null)'
				)
			: {}),
		'trigger-type': Flags.string({
			description: update
				? 'When the schedule starts a run. One of: by_time (at a wall-clock time; needs --start-at, --time-zone and --repeat), by_job (after a run of another job; needs --triggered-by-job-id and --last-run-condition). The trigger is sent only with --trigger-type, together with all flags of that trigger type, and replaces the whole trigger'
				: 'When the schedule starts a run. One of: by_time (at a wall-clock time; needs --start-at, --time-zone and --repeat), by_job (after a run of another job; needs --triggered-by-job-id and --last-run-condition)',
			options: TRIGGER_TYPES,
			required: !update,
		}),
		'start-at': Flags.string({
			description:
				'Local wall-clock time of the first run, without an offset or Z suffix, such as 2030-01-01T09:00:00. Combined with --time-zone. Only with --trigger-type=by_time',
		}),
		'time-zone': Flags.string({
			description:
				'IANA time zone that gives --start-at its meaning, such as America/Los_Angeles. Recurrence and DST are evaluated in this zone. Only with --trigger-type=by_time',
		}),
		repeat: Flags.string({
			description:
				'How often the schedule repeats after --start-at. One of: none, daily, weekly, weekdays, weekends. Only with --trigger-type=by_time',
			options: TRIGGER_REPEATS,
		}),
		'triggered-by-job-id': Flags.string({
			description:
				'ID of the shuttle job whose run starts this schedule. Only with --trigger-type=by_job',
		}),
		'last-run-condition': Flags.string({
			description:
				'When to start a run relative to the last run of the triggering job. One of: always, on_success, on_finish. Only with --trigger-type=by_job',
			options: TRIGGER_LAST_RUN_CONDITIONS,
		}),
	};
}

function buildTrigger(flags) {
	if (!checkVariantFlags(flags, 'trigger', TRIGGER_VARIANTS)) {
		return;
	}
	if (flags['trigger-type'] === 'by_time') {
		return {
			type: 'by_time',
			startAt: flags['start-at'],
			timeZone: flags['time-zone'],
			repeat: flags.repeat,
		};
	}
	return {
		type: 'by_job',
		triggeredByJobId: flags['triggered-by-job-id'],
		lastRunCondition: flags['last-run-condition'],
	};
}

function jobFlags({ update = false } = {}) {
	return {
		comment: Flags.string({
			description: 'Free-form comment describing the shuttle job',
			parse: utilities.unescapeSlashes,
		}),
		...(update
			? clearFlag(
					'comment',
					'Remove the comment of the shuttle job (sends null)'
				)
			: {}),
		tag: Flags.string({
			description: update
				? 'Free-form tag of the shuttle job. Repeat the flag for several tags. --tag replaces the whole tag list'
				: 'Free-form tag of the shuttle job. Repeat the flag for several tags',
			multiple: true,
		}),
		'account-mapping-enabled': Flags.boolean({
			description: update
				? 'Enable or disable account mapping, which translates source identities and permissions into Box'
				: 'Enable or disable account mapping, which translates source identities and permissions into Box. The API disables it when no account mapping flag is passed',
			allowNo: true,
		}),
		'permission-conflict-strategy': Flags.string({
			description:
				'Strategy that resolves permission conflicts. One of: preserve_structure_restrict_sharing, preserve_structure_expand_sharing, preserve_sharing_modify_structure, warn_permissions_conflicts',
			options: PERMISSION_CONFLICT_STRATEGIES,
		}),
		...(update
			? clearFlag(
					'permission-conflict-strategy',
					'Unset the permission conflict strategy (sends null)'
				)
			: {}),
		'external-shares-mapped': Flags.boolean({
			description: 'Map external shares during the migration',
			allowNo: true,
		}),
		'permissions-mapped': Flags.boolean({
			description: 'Map permissions during the migration',
			allowNo: true,
		}),
		'bandwidth-limit-bytes-per-sec': Flags.integer({
			description: 'Maximum transfer bandwidth in bytes per second',
		}),
		...(update
			? clearFlag(
					'bandwidth-limit-bytes-per-sec',
					'Remove the bandwidth limit, making it unlimited (sends null)'
				)
			: {}),
		'deletions-mirrored': Flags.boolean({
			description: 'Mirror deletions in the source system in Box',
			allowNo: true,
		}),
		'file-versions-synced': Flags.boolean({
			description: 'Sync prior file versions during the migration',
			allowNo: true,
		}),
		'max-file-versions': Flags.integer({
			description: 'Maximum number of file versions to sync',
		}),
		...(update
			? clearFlag(
					'max-file-versions',
					'Remove the file version limit, making it unlimited (sends null)'
				)
			: {}),
		'overwrite-enabled': Flags.boolean({
			description: 'Overwrite existing files in Box',
			allowNo: true,
		}),
		'completed-mappings-skipped-on-rerun': Flags.boolean({
			description:
				'Skip mappings that already completed successfully when the job is rerun',
			allowNo: true,
		}),
		'content-scanning-enabled': Flags.boolean({
			description:
				'Scan migrated content during the migration. Ignored when the source system does not support content scanning',
			allowNo: true,
		}),
		'include-shared-source-folders': Flags.boolean({
			description:
				'Include shared folders on the source in the migration. Ignored when the source system does not support shared folders',
			allowNo: true,
		}),
		'include-shared-destination-folders': Flags.boolean({
			description:
				'Include shared folders on the destination in the migration. Ignored when the destination system does not support shared folders',
			allowNo: true,
		}),
	};
}

/**
 * Adds the comment, tags, account mapping and settings of a shuttle job
 * create or update request from the passed flags.
 *
 * @param {Object} flags Parsed flags
 * @param {Object} requestBody The request body to add to
 * @returns {Object} The request body
 */
function buildJobFields(flags, requestBody) {
	Object.assign(requestBody, pickFields(flags, { comment: 'comment' }));
	if (Object.hasOwn(flags, 'tag')) {
		requestBody.tags = flags.tag;
	}
	const accountMapping = pickFields(flags, ACCOUNT_MAPPING_FIELDS);
	if (accountMapping) {
		requestBody.accountMapping = accountMapping;
	}
	const settings = pickFields(flags, SETTINGS_FIELDS);
	if (settings) {
		requestBody.settings = settings;
	}
	return requestBody;
}

function locationVariants(side) {
	const prefixed = (names) => names.map((name) => `${side}-${name}`);
	const common =
		side === 'source'
			? ['path', 'path-id', 'directory']
			: ['path', 'path-id'];
	return {
		account: {
			flags: prefixed([...common, 'account-id', 'account-email']),
			required: prefixed(['path']),
			requiredOneOf: prefixed(['account-id', 'account-email']),
		},
		shared_space: {
			flags: prefixed([...common, 'space']),
			required: prefixed(['path']),
		},
	};
}

function locationFlags(side, { required = false, update = false } = {}) {
	const label = side === 'source' ? 'source location' : 'destination';
	const flags = {
		[`${side}-type`]: Flags.string({
			description: `Type of the ${label}. One of: account (needs --${side}-path and --${side}-account-id or --${side}-account-email), shared_space (needs --${side}-path)${update ? `. The ${side} is sent only with --${side}-type, together with all flags of that type, and replaces the whole ${side}` : ''}`,
			options: LOCATION_TYPES,
			required,
		}),
		[`${side}-path`]: Flags.string({
			description: `Human-readable path of the ${label}, relative to the account root or the shared container`,
		}),
		[`${side}-path-id`]: Flags.string({
			description: `Stable identifier of the ${label}, as path_id from shuttle:path-entries`,
		}),
		[`${side}-account-id`]: Flags.string({
			description: `Platform-native ID of the account that owns the ${label}. Only with --${side}-type=account`,
		}),
		[`${side}-account-email`]: Flags.string({
			description: `Email address of the account that owns the ${label}. Only with --${side}-type=account`,
		}),
		[`${side}-space`]: Flags.string({
			description: `Display name of the shared container of the ${label}. Required for systems with several containers. Only with --${side}-type=shared_space`,
		}),
	};
	if (side === 'source') {
		flags['source-directory'] = Flags.boolean({
			description:
				'Whether the source location is a directory (--no-source-directory for a file). When set, the destination must be the same kind of object',
			allowNo: true,
		});
	}
	return flags;
}

function buildLocation(flags, side) {
	if (!checkVariantFlags(flags, side, locationVariants(side))) {
		return;
	}
	const flag = (name) => `${side}-${name}`;
	const type = flags[flag('type')];
	const location = { type, path: flags[flag('path')] };

	if (Object.hasOwn(flags, flag('path-id'))) {
		location.pathId = flags[flag('path-id')];
	}
	if (type === 'account') {
		location.account = {};
		if (Object.hasOwn(flags, flag('account-id'))) {
			location.account.id = flags[flag('account-id')];
		}
		if (Object.hasOwn(flags, flag('account-email'))) {
			location.account.email = flags[flag('account-email')];
		}
	}
	if (Object.hasOwn(flags, flag('space'))) {
		location.space = flags[flag('space')];
	}
	if (Object.hasOwn(flags, flag('directory'))) {
		location.isDirectory = flags[flag('directory')];
	}
	return location;
}

function pathMappingFlags({ update = false } = {}) {
	return {
		'path-skipped': Flags.boolean({
			description: update
				? 'Skip the source path during the migration'
				: 'Skip the source path during the migration. The API uses false when omitted',
			allowNo: true,
		}),
		...locationFlags('source', { required: !update, update }),
		...locationFlags('target', { update }),
	};
}

function subjectMappingFlags({ update = false } = {}) {
	return {
		'subject-skipped': Flags.boolean({
			description: update
				? 'Skip the subject during the migration. Changing only this flag keeps the existing target'
				: 'Skip the subject during the migration. The API uses false when omitted',
			allowNo: true,
		}),
		'target-type': Flags.string({
			description: `Whether the Box target is a user or a group. One of: user, group. Needs --target-id${update ? '. The target is sent only with --target-type and --target-id, and replaces the whole target' : ''}`,
			options: SUBJECT_TARGET_TYPES,
		}),
		'target-id': Flags.string({
			description: 'ID of the Box user or group to map to',
		}),
	};
}

function buildSubjectTarget(flags) {
	if (!checkVariantFlags(flags, 'target', SUBJECT_TARGET_VARIANTS)) {
		return;
	}
	return { type: flags['target-type'], id: flags['target-id'] };
}

function mappingImportFlags(kind) {
	return {
		'job-id': jobIdFlag(
			`ID of the shuttle job whose ${kind} mappings are replaced`
		),
		'file-id': Flags.string({
			description:
				'ID of the Box file holding the mapping workbook. The file is read as the calling user, who must be able to download it',
			required: true,
		}),
	};
}

module.exports = {
	jobIdFlag,
	runIdFlag,
	jobScheduleFlags,
	buildTrigger,
	jobFlags,
	buildJobFields,
	buildLocation,
	pathMappingFlags,
	subjectMappingFlags,
	buildSubjectTarget,
	mappingImportFlags,
};
