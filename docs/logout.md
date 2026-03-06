`box logout`
===========

Sign out and clear local authentication state. Revokes the current session's access token on Box servers and removes cached tokens from the local machine. Only supported for OAuth environments. Prompts for confirmation unless `--force` is used.

* [`box logout`](#box-logout)

## `box logout`

Sign out and clear local authentication state. Revokes the current session's access token on Box servers and removes cached tokens from the local machine. Only supported for OAuth environments.

```
USAGE
  $ box logout [--no-color] [-h] [-v] [-q] [-f]

FLAGS
  -f, --force    Skip confirmation prompt
  -h, --help     Show CLI help
  -q, --quiet    Suppress any non-error output to stderr
  -v, --verbose  Show verbose output, which can be helpful for debugging
      --no-color Turn off colors for logging

DESCRIPTION
  Sign out and clear local authentication state. Revokes the current session's access token on Box servers and removes cached tokens from the local machine. Only supported for OAuth environments.
```

_See code: [src/commands/logout.js](https://github.com/box/boxcli/blob/main/src/commands/logout.js)_
