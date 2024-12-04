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
  $ box tokens:exchange SCOPE [--no-color] [-h] [-v] [-q] [-u <value> | -t <value>] [--file-id <value> | --folder-id
    <value>]

ARGUMENTS
  SCOPE  The scope(s) for the new token, separated by a comma if multiple are present

FLAGS
  -h, --help               Show CLI help
  -q, --quiet              Suppress any non-error output to stderr
  -t, --token=<value>      Specify the token to exchange
  -u, --user-id=<value>    Get a user token from a user ID
  -v, --verbose            Show verbose output, which can be helpful for debugging
      --file-id=<value>    Scope the token to a specific file
      --folder-id=<value>  Scope the token to a specific folder
      --no-color           Turn off colors for logging

DESCRIPTION
  Get a token. Returns the service account token by default
```

_See code: [src/commands/tokens/exchange.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/tokens/exchange.ts)_

## `box tokens:get`

Get a token. Returns the service account token by default

```
USAGE
  $ box tokens:get [--no-color] [-h] [-v] [-q] [-u <value>]

FLAGS
  -h, --help             Show CLI help
  -q, --quiet            Suppress any non-error output to stderr
  -u, --user-id=<value>  Get a user token from a user ID
  -v, --verbose          Show verbose output, which can be helpful for debugging
      --no-color         Turn off colors for logging

DESCRIPTION
  Get a token. Returns the service account token by default
```

_See code: [src/commands/tokens/get.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/tokens/get.ts)_

## `box tokens:revoke TOKEN`

Revoke a token.  The token will no longer be valid for making API calls.

```
USAGE
  $ box tokens:revoke TOKEN [--no-color] [-h] [-v] [-q]

ARGUMENTS
  TOKEN  The token to revoke

FLAGS
  -h, --help      Show CLI help
  -q, --quiet     Suppress any non-error output to stderr
  -v, --verbose   Show verbose output, which can be helpful for debugging
      --no-color  Turn off colors for logging

DESCRIPTION
  Revoke a token.  The token will no longer be valid for making API calls.
```

_See code: [src/commands/tokens/revoke.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/tokens/revoke.ts)_
