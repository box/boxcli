`box update`
============

Update the BoxCLI using GitHub

* [`box update [CHANNEL]`](#box-update-channel)

## `box update [CHANNEL]`

Update the BoxCLI using GitHub

```
USAGE
  $ box update [CHANNEL] [-a] [-v <value> | -i] [--force]

FLAGS
  -a, --available        Install a specific version.
  -i, --interactive      Interactively select version to install. This is ignored if a channel is provided.
  -v, --version=<value>  Install a specific version.
      --force            Force a re-download of the requested version.

DESCRIPTION
  Update the BoxCLI using GitHub

EXAMPLES
  Update to the stable channel:

    $ box update stable

  Update to a specific version:

    $ box update --version 1.0.0

  Interactively select version:

    $ box update --interactive

  See available versions:

    $ box update --available
```

_See code: [src/commands/update.js](https://github.com/box/boxcli/blob/v4.4.1/src/commands/update.js)_
