---
name: add-box-cli-command
description: Use when adding or changing a Box CLI command under `src/commands`, including exposing a `box-node-sdk` manager method as a new command, or editing a command's tests, fixtures, or generated docs.
---

# Add Box CLI Command

Commands wrap `box-node-sdk` manager methods. Copy the shape of a nearby command, agree on the command's interface with the user, write the test first, and make the test prove the real CLI output.

## Inputs

- **SDK method** as `<manager>.<method>`, e.g. `hubCollaborations.createHubCollaborationV2025R0`. If the user describes the operation instead, find the method by its API path (step 1).

New commands always use the generated SDK (`box-node-sdk/sdk-gen`) through `this.tsClient`, even when the nearest sibling does not. Never call the legacy client `this.client` or use its managers in `node_modules/box-node-sdk/lib/managers/` for a new command.
- **Command name**, e.g. `hubs:collaborations:create`. If not given, propose one in step 4.
- **Anything else the user states**: allowed values, permissions, flag names, help text wording. User-stated facts override what you infer.

## Ask the user

Ask whenever a decision is not settled by the user's request, the SDK types, or an existing sibling command. Questions come before code: gather them, ask them in one batch, and wait for the answers.

Use the harness's structured question tool when it has one (`AskQuestion` in Cursor, `AskUserQuestion` in Claude Code), with your recommended option first and marked "(Recommended)". Otherwise ask in chat as a short numbered list.

Ask about:

- **Which SDK method**, when several match (e.g. a `V2025R0` method and an older one for the same path).
- **Command name and placement**: new top-level topic or nested under an existing one, and aliases such as `:list` or `:add` when siblings have them.
- **Accepted values** for fields the SDK types as plain `string`.
- **Defaults and required flags**, when the OpenAPI schema and SDK disagree or say nothing.
- **Permissions and scopes** the command needs, for the help text.
- **Flag names**, when the API field name reads badly as a flag (e.g. `is_ai_enabled` as `--is-ai-enabled` or `--ai-enabled`).
- **Output changes to a released command**: breaking change with `!` in the commit, or opt-in `--raw-json`.
- **An existing command for the same endpoint**: change it, add a new command beside it, or stop.

After the user approves the plan in step 4, work through the remaining steps without further questions unless a new decision comes up.

When no user can answer, as in a scheduled or background run, take the recommended option for each question and list every such choice under "Assumptions" in the step 8 report.

## Workflow

### 1. Resolve the SDK method

SDK sources live in `node_modules/box-node-sdk/lib/sdk-gen/`. Agent search tools respect `.gitignore` and skip `node_modules`, so use shell `grep` and `ls` there.

| File | Gives you |
| --- | --- |
| `managers/<manager>.d.ts` | Method signature, parameter and return types, and request body or query interfaces such as `CreateArchiveV2025R0RequestBody` |
| `managers/<manager>.js` | HTTP method and path, e.g. `'/2.0/hub_collaborations'` |
| `schemas/v2025R0/<type>.d.ts` or `schemas/<type>.d.ts` | Request and response fields |
| `client.d.ts` | Manager property name on `this.tsClient` |

To find a method from an API path: `grep -n "'/2.0/hub_collaborations" node_modules/box-node-sdk/lib/sdk-gen/managers/*.js`. To list a manager's methods with their signatures: `grep -E '^    [A-Za-z0-9]+\(' node_modules/box-node-sdk/lib/sdk-gen/managers/<manager>.d.ts | grep -v constructor`.

The HTTP method and path also give the `_endpoint` value and the fixture name: lowercase method, path after `/2.0/`, `/` replaced by `_`, path parameters replaced by `id`. `PUT /2.0/hub_collaborations/{id}` becomes `put_hub_collaborations_id`.

Check whether a command already covers the endpoint: `grep -rn "_endpoint = 'put_hub_collaborations_id'" src/commands`. A match turns the task into changing that command, so confirm with the user in step 4.

Done when you know the client property, method, HTTP method and path, the request and response types, and whether a command already exists.

### 2. Collect what the SDK does not encode

The SDK types many constrained fields as plain `string`. Hub collaboration `role` is `string` in the SDK, while the API accepts only `editor`, `viewer`, and `co-owner`. The SDK also omits required permissions and scopes, and which errors deserve an explanation in help text.

Read the endpoint in the [Box OpenAPI schema](https://github.com/box/box-openapi), which the SDK and the API reference are generated from. Its `openapi/` directory holds one JSON file per API version: `openapi.json` for endpoints without a version, and `openapi-v<version>.json` for each version. A method ending in `V<year>R<n>` is in `openapi-v<year>.<n>.json`, e.g. `V2025R0` in `openapi-v2025.0.json`. List the directory when unsure, since new versions add new files. Download the file:

```bash
curl -sL https://raw.githubusercontent.com/box/box-openapi/main/openapi/openapi-v2025.0.json -o /tmp/box-openapi.json
```

In it, read the operation under `paths`, keyed by the path without `/2.0` and the lowercase HTTP method, e.g. `paths["/hub_collaborations"].post`: its `parameters`, its `requestBody`, and every `$ref` they point to under `components`.

Take accepted values from `enum`, or from the description when it lists them instead, as it does for hub collaboration `role`. Take defaults from `default`, required fields from `required`, and admin-only endpoints from `x-box-requires-admin`. The schema has no structured scopes or permissions, so read them from the operation description and the [Box API reference](https://developer.box.com/reference/) page. Every gap left after that becomes a question for step 4.

Done when every flag has known accepted values, format, default, and permission requirements, or an open question.

### 3. Read the closest existing pair

Read the nearest sibling command in `src/commands/<topic>/`, its cases in `test/commands/<topic>.test.js`, its fixtures in `test/fixtures/<topic>/`, and `docs/<topic>.md`. Then read the section of [references/command-patterns.md](references/command-patterns.md) for your command kind (get, list, create, update, delete, compound flags).

Siblings show naming, flags, help text, mocked paths, and fixtures. Take test structure from [references/testing.md](references/testing.md) instead: a `test` chain returned or awaited inside a mocha `it(...)` never runs, so a sibling written that way, and any copy of it, passes whatever it asserts.

Most existing commands still call `this.client`, the legacy SDK client, with different method names and output handling. When the nearest sibling uses `this.client`, take its flag names and help text, and take the SDK call and output code from the reference commands named in command-patterns.md. When changing an existing command that uses `this.client`, keep it unless the user asks to migrate.

### 4. Propose the plan and ask

Show the user a short plan, then ask the open questions from steps 1–3 in the same message:

```text
Command:  box archives:create <name>
SDK:      this.tsClient.archives.createArchiveV2025R0(requestBody)
Endpoint: POST /2.0/archives  (_endpoint: post_archives)
Args:     name (required) - Name of the archive
Flags:    --description        Description of the archive
          --storage-policy-id  ID of the storage policy for the archive
Output:   created archive, API field names (rawData)
Files:    src/commands/archives/create.js, test/commands/archives.test.js,
          test/fixtures/archives/post_archives.json, docs/archives.md
```

Done when the user has approved the plan and answered every question.

### 5. Test first

Read [references/testing.md](references/testing.md), write the test, then run only it:

```bash
./node_modules/.bin/mocha test/commands/<topic>.test.js --grep "<command>"
```

Done when each new test fails for the expected reason: command not found, request mismatch, or wrong output. A test that passes before the command exists is not running; fix its structure before going on.

### 6. Implement, then go green

Write the minimum command code. Re-run the targeted test, then the whole topic file.

### 7. Lint and docs

```bash
./node_modules/.bin/eslint --fix <edited files>
npm run updatemd
```

Run `updatemd` whenever description, examples, flags, args, aliases, or command registration changed. It runs `oclif readme --multi` and then fixes the `.ts` links that oclif writes back to `.js`, so always use the npm script. Its `sed -i ''` is macOS syntax. On Linux, run the same two steps with GNU sed:

```bash
./node_modules/.bin/oclif readme --multi && find docs -type f -name '*.md' -exec sed -i 's/\.ts/\.js/g' {} +
```

Keep the diff to the topic's `docs/*.md` and `README.md`, and restore other regenerated files with `git checkout -- <file>`. For a new top-level topic, see "New topic" in [references/command-patterns.md](references/command-patterns.md).

### 8. Report

Summarize the new command, the files changed, and the test results. Suggest a conventional commit message: `feat: add archives:create command`, or `feat!: ...` when existing output or flags changed incompatibly. Use the same text as the pull request title, since CI checks the title's format and spelling. Commit only when the user asks.

## Command conventions

- Extend `BoxCommand`, `await this.parse(Command)`, call `this.tsClient.<manager>.<method>(...)`, `await this.output(...)`, `module.exports = Command`.
- Set `description`, `examples`, `_endpoint`, `flags` (spread `...BoxCommand.flags`), `args`, and `aliases` when siblings have them.
- The CLI is used mostly by AI agents. Descriptions state accepted values, formats, defaults, and required permissions.
- Restrict small value sets with Oclif `options`, list the values in the description, and add a negative test.
- Objects passed to the SDK use SDK field names (`accessibleBy`, `hubId`). Output, nock expectations, and fixtures use API field names (`accessible_by`, `hub_id`).

## JSON output

The SDK renames response fields to camelCase and wraps dates as `{ value: ... }`. The original API payload is kept on `rawData` of the top-level object only.

- New command: `await this.output(result.rawData ?? result);` and keep the `?? result` fallback.
- Released command with SDK-shaped output: switching to `rawData` breaks users. Add `...BoxCommand.rawJsonFlags` to `flags` and output `this.getOutputContentWithRawJsonSupport(result)`. Default output stays the same and `--raw-json` prints the API shape. Reference: `src/commands/ai/ask.js`.
- List: `this.markerPagination((query) => this.tsClient.<manager>.<listMethod>(query), queryParams)` returns raw entries and honors `--max-items`. Output its result directly and spread `...PaginationUtilities.flags` from `src/pagination-utils.js`.

## Done

- The user approved the plan and every question was answered.
- Every new test failed before the implementation and passes after it.
- The whole topic test file passes.
- Lint is clean on edited files.
- If help text changed, docs are regenerated and the diff is limited to the topic's docs and `README.md`.
