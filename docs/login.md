`box login`
===========

Sign in with OAuth and set a new environment or update an existing if reauthorize flag is used

* [`box login`](#box-login)

## `box login`

Sign in with OAuth and set a new environment or update an existing if reauthorize flag is used

```
USAGE
  $ box login [--no-color] [-h] [-v] [-q] [-c] [-p <value>] [-r -n <value>]

FLAGS
  -c, --code          Manually visit authorize URL and input code
  -h, --help          Show CLI help
  -n, --name=<value>  [default: oauth] Set a name for the environment
  -p, --port=<value>  [default: 3000] Set the port number for the local OAuth callback server
  -q, --quiet         Suppress any non-error output to stderr
  -r, --reauthorize   Reauthorize the existing environment with given `name`
  -v, --verbose       Show verbose output, which can be helpful for debugging
      --no-color      Turn off colors for logging

DESCRIPTION
  Sign in with OAuth and set a new environment or update an existing if reauthorize flag is used
```

_See code: [src/commands/login.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/login.ts)_
