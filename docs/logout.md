`box logout`
============

Revoke the access token and clear local token cache.

For OAuth, run `box login` to authorize again.
For CCG and JWT, a new token is fetched automatically on the next command.

Use -f and --on-revoke-failure=clear or --on-revoke-failure=abort to skip the interactive prompt.

* [`box logout`](#box-logout)

## `box logout`

Revoke the access token and clear local token cache.

```
USAGE
  $ box logout [--no-color] [-h] [-v] [-q] [-f] [--on-revoke-failure clear|abort]

FLAGS
  -f, --force                       Skip confirmation prompt
  -h, --help                        Show CLI help
  -q, --quiet                       Suppress any non-error output to stderr
  -v, --verbose                     Show verbose output, which can be helpful for debugging
      --no-color                    Turn off colors for logging
      --on-revoke-failure=<option>  On revoke failure: "clear" clears local cache only, "abort" exits without clearing.
                                    Skips prompt.
                                    <options: clear|abort>

DESCRIPTION
  Revoke the access token and clear local token cache.

  For OAuth, run `box login` to authorize again.
  For CCG and JWT, a new token is fetched automatically on the next command.

  Use -f and --on-revoke-failure=clear or --on-revoke-failure=abort to skip the interactive prompt.
```

_See code: [src/commands/logout.js](https://github.com/box/boxcli/blob/v4.5.0/src/commands/logout.js)_
