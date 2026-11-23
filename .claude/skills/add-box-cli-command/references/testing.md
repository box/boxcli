# Testing commands

Tests use `@oclif/test` (`test` chains built on fancy-test), `nock` for HTTP mocks, and chai `assert`. Reference file: `test/commands/hubs.test.js`.

## Running

```bash
./node_modules/.bin/mocha test/commands/<topic>.test.js --grep "<command>"   # one command
./node_modules/.bin/mocha test/commands/<topic>.test.js                      # whole topic
```

`npm test -- <file>` still runs the whole suite, then lints. `--grep` matches the `describe` and `.it` titles, so name the inner `describe` after the command.

## File layout

```js
'use strict';

const { test } = require('@oclif/test');
const { assert } = require('chai');
const { TEST_API_ROOT, getFixture } = require('../helpers/test-helper');

describe('Hubs', function () {
	describe('hubs:get', function () {
		const response = JSON.parse(getFixture('hubs/get_hubs_id'));

		test.nock(TEST_API_ROOT, (api) =>
			api.get('/2.0/hubs/12345').reply(200, response)
		)
			.stdout()
			.command(['hubs:get', '12345', '--json', '--token=test'])
			.it('gets a hub by ID', (context) => {
				assert.deepEqual(JSON.parse(context.stdout), response);
			});
	});
});
```

Each case is a `test` chain placed directly inside a `describe`, ending in `.it(...)`. These two shapes never run, and the surrounding mocha test passes whatever they assert:

- `it('…', async function () { return test.command([...]).catch(...); })`: the chain has no `.it(...)`.
- `it('…', async function () { await test.command([...]).it('…'); })`: an `.it(...)` nested inside a running mocha `it` is never scheduled.

To set up stubs for one case, start the chain with `.do(() => { ... })`, which runs inside the test after `beforeEach`, instead of wrapping the chain in a mocha `it`. Pass `--token=test` so no stored credentials are used, and `--json` so output can be parsed.

## Recipes

### Request body

Give nock the expected body with API field names. A request with a different body does not match, and the test fails.

```js
test.nock(TEST_API_ROOT, (api) =>
	api
		.post('/2.0/hub_collaborations', {
			hub: { id: '12345', type: 'hubs' },
			accessible_by: { type: 'user', id: '22222' },
			role: 'editor',
		})
		.reply(200, response)
)
	.stdout()
	.command(['hubs:collaborations:create', '12345', '--role=editor', '--user-id=22222', '--json', '--token=test'])
	.it('creates a collaboration for a hub', (context) => {
		assert.deepEqual(JSON.parse(context.stdout), response);
	});
```

### List, single page

List calls always send `limit`: 1000 by default, or the `--max-items` value. Include it in `.query({...})`, and omit `next_marker` from the reply. List output is the array of entries, not the whole response.

```js
test.nock(TEST_API_ROOT, (api) =>
	api
		.get('/2.0/hubs')
		.query({ query: 'team', limit: 10 })
		.reply(200, { entries: [hubResponse], limit: 10 })
)
	.stdout()
	.command(['hubs', '--query=team', '--max-items=10', '--json', '--token=test'])
	.it('lists hubs with provided filters', (context) => {
		assert.deepEqual(JSON.parse(context.stdout), [hubResponse]);
	});
```

### List, multiple pages

Mock every page. The first reply carries `next_marker`, and the next request sends it as `marker` with `limit` reduced to the items still needed. See "follows next_marker until max-items is reached" in `test/commands/hubs.test.js`:

```js
api
	.get('/2.0/hubs')
	.query({ query: 'team', limit: 1000 })
	.reply(200, { entries: firstPageEntries, limit: 1000, next_marker: 'next-page' })
	.get('/2.0/hubs')
	.query({ query: 'team', limit: 1, marker: 'next-page' })
	.reply(200, { entries: secondPageEntries, limit: 1 });
```

### Delete

Delete commands print to stderr. Compare the whole line, ending in `os.EOL` rather than `\n`, because CI also runs on Windows:

```js
const os = require('node:os');

test.nock(TEST_API_ROOT, (api) =>
	api.delete('/2.0/hub_collaborations/99999').reply(204)
)
	.stderr()
	.command(['hubs:collaborations:delete', '99999', '--token=test'])
	.it('deletes a hub collaboration by ID', (context) => {
		assert.equal(context.stderr, `Deleted hub collaboration 99999${os.EOL}`);
	});
```

### Errors

Flag validation errors and errors thrown by the command are written to stderr, not thrown, so assert on stderr. No nock is needed when the command fails before calling the API.

```js
test
	.stderr()
	.command(['hubs:collaborations:create', '12345', '--role=owner', '--user-id=22222', '--token=test'])
	.it('rejects unsupported hub collaboration roles', (context) => {
		assert.include(context.stderr, 'Expected --role=owner to be one of: editor, viewer, co-owner');
	});
```

Cover each `options` list and each validation branch in the command (missing required key, unsupported value, no update flags) with one such test.

## Fixtures

- Name each file after `_endpoint`, e.g. `test/fixtures/hubs/post_hub_collaborations.json`, and load it with `getFixture('hubs/post_hub_collaborations')`.
- Use full payloads when output shape matters and minimal ones when only the request matters.
- Write fixtures with API field names (`snake_case`), as the API returns them.
- The SDK deserializes mocked responses, so enum fields need values its schema accepts. A hub needs `type: 'hubs'`. Check the response type in `schemas/` when unsure.
- Use placeholder identities such as `ceo@example.com`.

## When a test fails

- **`JSON.parse` fails or stdout is empty**: the command failed. Its error is printed to the terminal above the mocha failure, because only stdout was captured.
- **"Nock: No match for request"**: the path, query, or body differs from the mock. Compare them against what the command sends, including `limit` on list calls.
- **"Can't deserialize …"**: a fixture field has a value the SDK schema rejects.
- **Exact stderr comparison picks up a Node deprecation warning**: run with `NODE_OPTIONS=--no-deprecation`.

## Integration tests

Integration tests run the CLI (`bin/run`) against the real API, one file per topic in `test/integration/commands/<topic>.it.js`. Add one only when step 6 of the skill calls for it; unit tests are always required. Copy the pattern of `test/integration/commands/folders.it.js`:

- Use plain mocha `describe` and `async` `it` blocks. The `test` chains above are for nock-mocked tests only.
- In `before`, create one folder for the test file with `createFolder('0')`; in `after`, delete it with `deleteFolder(id)`, which removes everything inside it, then call `cleanup()` last. Name every created item with `uniqueName()`, which returns `cli-it-<uuid>`.
- Create every file, folder, and web link a case needs inside that folder: `createFolder(folder.id)`, never `createFolder('0')` again. `createFolder()` without a parent throws.
- Items outside the folder tree, such as metadata templates, groups, webhooks, or collaborations on other items, are not removed with the folder: delete each one explicitly in `after`, in a `try` block so one failed delete does not skip the rest.
- Do not change the shared folder from `before` in a case that other cases read, such as renaming it; create a child for that case instead.
- Use only the helpers of `test/integration/helpers` (`require('../helpers')`) to call the CLI and to create items. Do not write a wrapper around `run`, and do not catch its errors yourself:
    - `run(args)` adds `--json`, throws on a non-zero exit, and returns the parsed output as `output`. Pass `{ json: false }` for commands with no JSON output, such as deletes, and `{ asUser: true }` or `{ asAdmin: true }` to act as another identity; see "Test account" below.
    - `expectFailure(args, { status })` runs a command that must fail and checks the HTTP status, such as `404`. It throws when the command succeeds or fails with another status, so a case never passes on a `401` or `403`, which mean the account or the command is wrong.
    - `createFolder(parentId)` and `uploadFile(parentId, { name, content })` create a folder or a small text file inside the test's folder and return it; both are deleted with that folder. Neither accepts `'0'`, except `createFolder('0')` for the test file's own folder in `before`.
    - `waitFor(check, { timeoutSeconds })` repeats an async `check` until it returns a truthy value and returns that value; a `check` that throws counts as not ready. See the waiting rule below.
    - `deleteFolder(id)`, `uniqueName()` and `cleanup()` as above.
- A failure case comes next to a success case of the same command, not instead of it. For a `404`, use an item the test created and then deleted, never a made-up ID: a made-up ID may exist, or the API may answer `400` or `403` for it.
- Never expect a 5xx status: a server error is not how the command behaves, and such a test passes or fails with the API, not the CLI.
- Expect `400` only when the box-node-sdk integration test of that endpoint expects `400`. Check flag validation with a unit test instead: the command rejects bad input before it calls the API.
- Never use the ID of an item the test did not create: the shared account's items change and other runs delete theirs. The one exception is an item the box-node-sdk test itself reuses, found the same way, such as the enterprise's information barrier that the SDK test gets or creates once: use it as that test does, and never change its state further or delete it.
- After a command that changes an item, read the item back with a separate command, such as `folders:get`, and assert the change there too: the response of the changing command alone does not show that the change was stored.
- Assert on stable fields such as `type`, `id`, and the `cli-it-` name, not on whole payloads. The test account is shared and runs can overlap, so never assert on the length or total count of a shared listing; assert that the item the test created or reuses is present, also where the box-node-sdk test checks a count.
- Wait only where the box-node-sdk test waits. Where it calls `await delayInSeconds(N)` before a call, because the API needs time (search, metadata queries, AI, taxonomies), put that call and the check that follows it inside `waitFor(check, { timeoutSeconds: 3 * N })`. It repeats `check` until it returns a truthy value, so the test is not slower than needed. Never use `setTimeout`, a sleep, or a retry loop of your own, and never wait where the SDK test does not.
- Never print command output or credentials. Errors thrown by `run` and `expectFailure` are already redacted.

### Test account

The tests run on the same shared account as the box-node-sdk integration tests, with the same environment variables. Use them only through these helpers; never read `process.env` in a test, and never type, guess, or look up an ID:

| box-node-sdk test | CLI integration test |
| --- | --- |
| `getDefaultClient()` | `run(args)`: the service account of the JWT app |
| `getDefaultClientWithUserSubject(getEnvVar('USER_ID'))`, also when the test calls it `adminClient` | `run(args, { asUser: true })` |
| `getDefaultClientWithUserSubject(getEnvVar('ADMIN_USER_ID'))` | `run(args, { asAdmin: true })` |
| `getEnvVar('USER_ID')` as an argument | `userId()` |
| `getEnvVar('ADMIN_USER_ID')` as an argument | `adminUserId()` |
| `getEnvVar('ENTERPRISE_ID')` | `enterpriseId()`, or `enterpriseScope()` for a scope such as `enterprise_<id>` |

The helpers of the box-node-sdk tests, in their `commons.ts`, map to these:

| box-node-sdk helper | CLI integration test |
| --- | --- |
| `createNewFolder()` | `createFolder(folder.id)`, inside the test file's folder, not in the root |
| `uploadNewFile()`, `uploadFile(...)` | `uploadFile(folder.id)` |
| `getOrCreate…()`, such as `getOrCreateShieldInformationBarrier` or `getOrCreateClassificationTemplate` | the same steps with CLI commands: list, create only when there is none, use it. It is a long-lived item of the account: never delete it, and change it no further than the SDK test does |
| `delayInSeconds(N)` | `waitFor(...)`, see the waiting rule above |

`asUser` and `asAdmin` send the As-User header with the service account's token, the closest CLI equivalent of the SDK's user subject. When the API refuses it with `403` although the SDK test passes, the endpoint needs a user's own token: add no integration test, and give `needs-config` in the report.

The account has no other variables. When the box-node-sdk test reads any other one, such as `CLIENT_ID`, `CLIENT_SECRET`, `BOX_EXTERNAL_USER_ID`, `WORKFLOW_FOLDER_ID` or an `APP_ITEM_…` ID, add no integration test: the reason is `needs-fixture` for an item or user the test cannot create, otherwise `needs-config`, and the report names the variable.

`npm run test:integration` needs `JWT_CONFIG_BASE_64`, a base64-encoded Box JWT app config, and `USER_ID`, `ADMIN_USER_ID` and `ENTERPRISE_ID` for the tests that use them. Without `JWT_CONFIG_BASE_64`, check that the files load with `npx mocha --dry-run "test/integration/**/*.it.js"`. Commands that cannot run on a shared test account get no integration test; the report names the reason (`license`, `admin-wide`, `irreversible`, `needs-fixture`, or `needs-config`) and the configuration a test would need. When the task says integration tests are not requested, add none either; see step 6 of the skill.
