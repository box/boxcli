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
