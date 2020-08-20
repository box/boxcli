`box tokens`
============

Get a token. Returns the service account token by default

* [`box tokens:exchange SCOPE`](#box-tokensexchange-scope)
* [`box tokens:get`](#box-tokensget)
* [`box tokens:revoke TOKEN`](#box-tokensrevoke-token)

## `box tokens:exchange SCOPE`

Get a token. Returns the service account token by default

```
USAGE
  $ box tokens:exchange SCOPE

ARGUMENTS
  SCOPE  The scope(s) for the new token, separated by a comma if multiple are present

OPTIONS
  -h, --help             Show CLI help
  -q, --quiet            Suppress any non-error output to stderr
  -t, --token=token      Specify the token to exchange
  -u, --user-id=user-id  Get a user token from a user ID
  -v, --verbose          Show verbose output, which can be helpful for debugging
  --file-id=file-id      Scope the token to a specific file
  --folder-id=folder-id  Scope the token to a specific folder
  --no-color             Turn off colors for logging
```

_See code: [src/commands/tokens/exchange.js](https://github.com/box/boxcli/blob/v2.6.0/src/commands/tokens/exchange.js)_

## `box tokens:get`

Get a token. Returns the service account token by default

```
USAGE
  $ box tokens:get

OPTIONS
  -h, --help             Show CLI help
  -q, --quiet            Suppress any non-error output to stderr
  -u, --user-id=user-id  Get a user token from a user ID
  -v, --verbose          Show verbose output, which can be helpful for debugging
  --no-color             Turn off colors for logging
```

_See code: [src/commands/tokens/get.js](https://github.com/box/boxcli/blob/v2.6.0/src/commands/tokens/get.js)_

## `box tokens:revoke TOKEN`

Revoke a token.  The token will no longer be valid for making API calls.

```
USAGE
  $ box tokens:revoke TOKEN

ARGUMENTS
  TOKEN  The token to revoke

OPTIONS
  -h, --help     Show CLI help
  -q, --quiet    Suppress any non-error output to stderr
  -v, --verbose  Show verbose output, which can be helpful for debugging
  --no-color     Turn off colors for logging
```

_See code: [src/commands/tokens/revoke.js](https://github.com/box/boxcli/blob/v2.6.0/src/commands/tokens/revoke.js)_
