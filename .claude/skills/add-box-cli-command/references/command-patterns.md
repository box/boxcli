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
- A parent ID goes into `queryParams` under its SDK name: `{ hubId: args.id }` in `hubs:collaborations`, and `{ jobId: flags['job-id'] }` in a new command; see "Request fields".
- Endpoints that use offset pagination or return a single unpaged collection do not fit `markerPagination`. Find a sibling command that calls the same kind of endpoint, or ask the user.

## Create

Reference: `src/commands/hubs/collaborations/create.js`.

- Build `requestBody` with SDK field names and pass it to the SDK method.
- For `accessible_by`, which accepts a user ID, a group ID, or a login, give each its own flag, make them mutually `exclusive`, and build the nested object in a small helper above the class:

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
- `parseStringToObject` ends a value where the name of any allowed key appears in it, so `path=/a/type/b` breaks when `type` is a key. Use a compound flag only when its values are IDs, numbers or values from a fixed list.

## Command names

Name a new command after the API path, so that every run picks the same name:

- Each resource path is a sub-topic of the topic, named after the path without the topic's prefix, in kebab-case: in the `shuttle` topic, `/shuttle_job_schedules` is `shuttle:job-schedules`. Resources stay side by side; nest one under another only when its path is nested, as `/hubs/{id}/...` would be.
- The collection and its items give the verbs: `GET` on the collection is the sub-topic's `index.js` with a `:list` alias, `POST` on it is `:create`, and `GET`, `PUT` and `DELETE` on `/{id}` are `:get`, `:update` and `:delete`.
- A last path segment that names an action is a verb on the resource: `POST /shuttle_jobs/{id}/start` is `shuttle:jobs:start`, and `POST /shuttle_systems/{id}/issue_registration_token` is `shuttle:systems:issue-registration-token`.
- Every other path follows the same rules, also a collection that takes only `POST`: `POST /shuttle_path_mapping_imports` is `shuttle:path-mapping-imports:create`.

## Request fields

Turn each field of the endpoint's OpenAPI facts into an arg or a flag by these rules. A choice they settle is not a guess.

Args:

- The `{id}` of the path is the required arg `id`.
- On create, a required `name` or `title` is an arg too, after `id` when the path has one, as in `folders:create <parentID> <name>` and `hubs:create <title>`.
- Every other field is a flag, also the ID of a parent resource that the endpoint takes in the query or the body: `job_id` is `--job-id`. Older commands such as `hubs:collaborations` take the hub ID as the `id` arg; leave them as they are.

Flag names:

- A field's flag is its name in kebab-case: `storage_policy_id` is `--storage-policy-id`. A boolean named `is_…` or `are_…` drops that prefix and gets `allowNo: true`: `is_ai_enabled` is `--ai-enabled`, as in `hubs:update`.
- A field of a nested object takes its own name: `settings.max_file_versions` is `--max-file-versions`, `settings.are_deletions_mirrored` is `--deletions-mirrored`, `trigger.start_at` is `--start-at`. It gets the name of its parent object in front only when:
    - its name, without the boolean prefix, is `id`, `type`, `name`, `enabled`, `path`, `email`, `state` or `mode`: `trigger.type` is `--trigger-type`, `account_mapping.is_enabled` is `--account-mapping-enabled`, `target.id` is `--target-id`; or
    - another field of the request would get the same flag: `source.path` and `target.path` are `--source-path` and `--target-path`. When the parent's name does not tell them apart either, use the whole path: `source.account.id` is `--source-account-id`.

Flags by the shape of the field. Count the flags a nested field would give from all its values at every depth; the depth itself does not matter:

| Field | Flags |
| --- | --- |
| A value | One flag |
| An object that gives at most 10 flags, at any depth, such as `settings` (9) or `source` with `source.account.id` (7) | One flag per value, named as above. Build the object from the passed flags only, and send it only when one of them is passed |
| An object with variants chosen by its `type`, whose variants hold values, and at most 10 flags with the fields of every variant counted | `--<field>-type` with the variant types as `options`, and one flag per variant field. A field of several variants is one flag. The command checks that the chosen variant's required flags are passed and refuses the flags of other variants, as `retention-policies:assign` checks `--assign-to-id`. A user-or-group target is the same: `--target-type` with `user` and `group`, and `--target-id`. Only `accessible_by` keeps the older `--user-id`, `--group-id` and `--login` of "Create" |
| An array of strings or IDs | `multiple: true`, one value per flag, named in the singular: `--tag` for `tags`, `--section` for `sections`. The request keeps the API field name |
| An array of flat objects | A repeatable compound flag; see "Compound flags" |
| An object that would give more than 10 flags, with the fields of every variant counted; or that has variants inside variants, an array of objects that hold objects or arrays, or a map with free-form keys, whatever its size | One JSON flag named after the field; see "JSON flags". The other fields of the request stay flags |
| `enum`, or a closed list of values in the description | `options`. A list that the description calls open or growing gets no `options`; name the documented values in the description |
| Required in OpenAPI but optional in the SDK | A required flag, because the API rejects the request without it. When it allows exactly one value, give it `options` and `default` of that value instead, so it is always sent |
| A field the API description lets you set to `null` to clear it | Also `--clear-<field>`, a boolean `exclusive` with the field's flags, that sends `null`: `--clear-target` |

- Never invent a default. For an optional field with an OpenAPI `default`, send nothing when the flag is not passed, and name the default in the description.
- Update commands take the flags of create, none of them required, and send only what was passed; see "Update". A variant object is sent only when `--<field>-type` is passed, and is then checked as on create.
- When a field fits none of these rows, ask; a run without a user lists it under "Review notes".

## JSON flags

Reference: `parseJsonFlag` in `src/util.js`.

A JSON flag takes the field in the shape of the API: snake_case field names, as the API reference and the `--json` output show them, so that an object from a `get` command can be pasted. In the flag's `parse`, call `utilities.parseJsonFlag` with the SDK `serialize` and `deserialize` functions of the field's type. They are in `box-node-sdk/sdk-gen/schemas/`, in the version folder of a versioned type (`v2026R0/`), in the module of the type with a lowercase first letter; a `…Field` type is in the module of the type that declares it.

```js
const {
	serializeAiExtractStructuredAgent,
	deserializeAiExtractStructuredAgent,
} = require('box-node-sdk/sdk-gen/schemas/aiExtractStructuredAgent');

	'ai-agent': Flags.string({
		description:
			'AI agent configuration as JSON with API field names. Example: {"type":"ai_agent_extract_structured","basic_text":{"model":"azure__openai__gpt_4o_mini"}}',
		parse: (input) =>
			utilities.parseJsonFlag(input, {
				flag: 'ai-agent',
				serialize: serializeAiExtractStructuredAgent,
				deserialize: deserializeAiExtractStructuredAgent,
			}),
	}),
```

- `parseJsonFlag` returns the object the SDK method takes; put it in the request as it is. It fails, naming the flag, on invalid JSON, on a value the type rejects, and on fields the SDK would drop, such as typos or SDK names like `basicText`. Do not convert keys or check fields yourself.
- For an array of such objects, make the flag `multiple: true`, one object per value, parsed with the item type's functions.
- The description says the value is JSON with API field names and gives the shortest valid example. On update, it also says that the value replaces the whole object.
- Test one case that sends the example and checks the request body, and one with an unknown field that expects the error.

## Flags and args

- Flag names follow "Request fields" above. Bulk input (`--bulk-file-path`) matches CSV columns and JSON keys to arg and flag names, ignoring case, `-`, and `_`, so a `storage_policy_id` column fills `--storage-policy-id`.
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
- In a run that cannot execute commands, skip `npm run updatemd` and leave `docs/**` and `README.md` to the later step that regenerates them. Add the `oclif.topics` entry anyway, since you cannot check the generated line.
- Create `test/commands/<topic>.test.js` and `test/fixtures/<topic>/`.
