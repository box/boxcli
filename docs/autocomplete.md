`box autocomplete`
==================

Display autocomplete installation instructions

* [`box autocomplete [SHELL]`](#box-autocomplete-shell)

## `box autocomplete [SHELL]`

Display autocomplete installation instructions.

```
USAGE
  $ box autocomplete [SHELL] [-r]

ARGUMENTS
  SHELL  (zsh|bash|powershell) Shell type

FLAGS
  -r, --refresh-cache  Refresh cache (ignores displaying instructions)

DESCRIPTION
  Display autocomplete installation instructions.

EXAMPLES
  $ box autocomplete

  $ box autocomplete bash

  $ box autocomplete zsh

  $ box autocomplete powershell

  $ box autocomplete --refresh-cache
```

_See code: [@oclif/plugin-autocomplete](https://github.com/oclif/plugin-autocomplete/blob/v3.2.18/src/commands/autocomplete/index.ts)_
