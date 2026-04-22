# AGENT Guide for `boxcli`

This repository is the Box CLI (`@box/cli`), a Node.js/Oclif command-line app.

## Project Basics

- Runtime: Node.js `>=18`
- Module system: CommonJS (`require`, `module.exports`)
- Main command base class: `src/box-command.js`
- CLI commands live in: `src/commands/`
- Tests live in: `test/**/*.test.js`

## Local Workflow

- Install deps: `npm install`
- Run tests (with coverage): `npm test`
- Lint/fix: `npm run lint`
- Format: `npm run prettier`

Note: `npm test` is followed by lint via `posttest`, so expect both test and lint feedback.

## Coding Conventions

- Follow `.editorconfig`:
	- Use tabs for indentation
	- Keep LF line endings
- Keep changes consistent with existing CommonJS style.
- Reuse existing command patterns in `src/commands/` and shared helpers in `src/`.
- Avoid broad refactors unless required by the task.

## Testing Expectations

- Add or update focused tests for behavior changes.
- Prefer updating existing test suites in `test/` when touching shared modules (for example `token-cache`, `box-command`, `util`).
- For command behavior changes, validate argument/flag parsing and user-facing output paths where applicable.

## Docs and Generated Output

- Command docs are generated from Oclif metadata (`docs/*.md`, `README.md` sections).
- If changing command signatures/help text, run the docs update flow:
	- `npm run updatemd`

## Security and Safety

- Never commit credentials, tokens, or environment secrets.
- Be careful around authentication and token cache behavior (`src/token-cache.js`, secure storage paths).
- Preserve backward compatibility for CLI output/flags unless a breaking change is explicitly intended.

## Agent PR Checklist

- Tests updated and passing for changed behavior
- Lint clean
- No secrets in diffs
- Docs regenerated when command surface changed
- Changes scoped to the user request
