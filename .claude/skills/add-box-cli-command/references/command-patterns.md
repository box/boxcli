# Command patterns

Patterns from the current TypeScript SDK commands. Read the section for your command kind, then copy the named file rather than these excerpts when they differ.

## Anatomy

`src/commands/hubs/get.js` is the smallest complete command:

```js
'use strict';

const { Args } = require('@oclif/core');
const BoxCommand = require('../../box-command');

class HubsGetCommand extends BoxCommand {
	async run() {
		const { args } = await this.parse(HubsGetCommand);
		const hub = await this.tsClient.hubs.getHubByIdV2025R0(args.id);
		await this.output(hub.rawData ?? hub);
	}
}

HubsGetCommand.description = 'Get details for a Box Hub';
HubsGetCommand.examples = ['box hubs:get 12345'];
HubsGetCommand._endpoint = 'get_hubs_id';

HubsGetCommand.flags = {
	...BoxCommand.flags,
};

HubsGetCommand.args = {
	id: Args.string({
		name: 'id',
		required: true,
		hidden: false,
		description: 'ID of the Box Hub',
	}),
};

module.exports = HubsGetCommand;
```

The file path is the command name: `src/commands/hubs/collaborations/create.js` is `hubs:collaborations:create`, and `index.js` is the topic itself (`src/commands/hubs/index.js` is `hubs`). The `require` depth for `box-command` follows the folder depth.

## Get

Reference: `src/commands/hubs/get.js`, `src/commands/hubs/collaborations/get.js`.

One required `id` arg, no extra flags, output `result.rawData ?? result`.

## List

Reference: `src/commands/hubs/index.js` (filters), `src/commands/hubs/collaborations/index.js` (parent ID).

- Put list commands in `index.js` and add a `:list` alias: `HubsListCommand.aliases = ['hubs:list'];`.
- Build `queryParams` from only the filter flags the user set, then call `markerPagination`:

```js
const queryParams = {};
if (flags.scope) {
	queryParams.scope = flags.scope;
}

const hubs = await this.markerPagination(
	(pageQueryParams) => this.tsClient.hubs.getHubsV2025R0(pageQueryParams),
	queryParams
);
await this.output(hubs);
```

- Spread `...PaginationUtilities.flags` (from `src/pagination-utils.js`) after `...BoxCommand.flags`. It adds `--max-items`.
- A parent ID arg goes into `queryParams` under its SDK name: `{ hubId: args.id }`.
- Endpoints that use offset pagination or return a single unpaged collection do not fit `markerPagination`. Find a sibling command that calls the same kind of endpoint, or ask the user.

## Create

Reference: `src/commands/hubs/collaborations/create.js`.

- Build `requestBody` with SDK field names and pass it to the SDK method.
- When the API accepts one of several alternatives (user ID, group ID, or login), give each its own flag, make them mutually `exclusive`, and build the nested object in a small helper above the class:

```js
function getAccessibleBy(flags) {
	if (flags['user-id']) {
		return { type: 'user', id: flags['user-id'] };
	}
	if (flags['group-id']) {
		return { type: 'group', id: flags['group-id'] };
	}
	if (flags.login) {
		return { type: 'user', login: flags.login };
	}
	throw new Error('Please provide one of --user-id, --group-id, or --login.');
}
```

- Add an `:add` alias when siblings have one.

## Update

Reference: `src/commands/hubs/update.js`.

- Send only the fields the user passed. Check string flags for a value and boolean flags with `Object.hasOwn`, so `--no-<flag>` sends `false`:

```js
const requestBody = {};
if (flags.title) {
	requestBody.title = flags.title;
}
if (Object.hasOwn(flags, 'ai-enabled')) {
	requestBody.isAiEnabled = flags['ai-enabled'];
}
if (Object.keys(requestBody).length === 0) {
	this.error('Please provide at least one update flag.');
}
```

- Boolean update flags use `allowNo: true`, which adds the `--no-<flag>` form.

## Delete

Reference: `src/commands/hubs/delete.js`, `src/commands/hubs/collaborations/delete.js`.

Call the SDK, then report on stderr with `this.info`, which `--quiet` suppresses:

```js
await this.tsClient.hubCollaborations.deleteHubCollaborationByIdV2025R0(args.id);
this.info(`Deleted hub collaboration ${args.id}`);
```

## Compound flags

Reference: `src/commands/hubs/items/manage.js`.

For repeated structured input such as `--add id=11111,type=file,parent-id=67890`:

- Declare the flag with `multiple: true` and a `parse(input)` function, so oclif returns already-built objects.
- Inside `parse`, call `utilities.parseStringToObject(input, ALLOWED_KEYS)` from `src/util.js`, check required keys, check enumerated values, and throw an `Error` naming the bad key or value.
- Put the format, the allowed values, and what each key means in the flag description.

## Flags and args

- Flag names are kebab-case versions of the API field names: `storage_policy_id` becomes `--storage-policy-id`. Bulk input (`--bulk-file-path`) matches CSV columns and JSON keys to arg and flag names, ignoring case, `-`, and `_`, so a `storage_policy_id` column fills `--storage-policy-id`.
- Common properties: `required`, `options` (allowed values), `multiple`, `exclusive`, `allowNo` (booleans), `char` (short form), `parse`.
- Free-text flags such as descriptions use `parse: utilities.unescapeSlashes` so `\n` typed in the shell becomes a newline.
- Global flags already use `char` values `t`, `s`, `h`, `v`, `y`, and `q`. Pick a different letter or omit `char`.
- Args use `Args.string({ name, required, hidden: false, description })`.
- Throw a plain `Error` or call `this.error(...)` for input errors. `BoxCommand` prints the message to stderr and sets exit code 2.

## Inherited global flags

Spreading `...BoxCommand.flags` gives every command these flags with no extra code:

| Flag | Effect |
| --- | --- |
| `--token`, `-t` | Use this access token |
| `--as-user` | Sends the `as-user` header through `this.tsClient` |
| `--json`, `--csv` | Output format, mutually exclusive. The default is human-readable key-value text |
| `--fields` | Keeps only the listed keys of the output, so it matches API field names only when the command outputs `rawData` |
| `--save`, `--save-to-file-path` | Write output to a file |
| `--bulk-file-path` | Run the command once per row of a CSV or JSON file |
| `--verbose`, `--quiet`, `--yes`, `--no-color` | Logging, prompts, and color |

## New topic

A command in a folder that does not exist yet creates a new topic.

- `npm run updatemd` creates `docs/<topic>.md` and adds a line under "Command Topics" in `README.md`.
- Check that line's description. If it does not describe the whole topic, add an entry under `oclif.topics` in `package.json`, e.g. `"archives": { "description": "Manage archives" }`, and run `npm run updatemd` again.
- Create `test/commands/<topic>.test.js` and `test/fixtures/<topic>/`.
