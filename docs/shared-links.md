`box shared-links`
==================

Manage shared links

* [`box shared-links:create ITEMID ITEMTYPE`](#box-shared-linkscreate-itemid-itemtype)
* [`box shared-links:delete ITEMID ITEMTYPE`](#box-shared-linksdelete-itemid-itemtype)
* [`box shared-links:get URL`](#box-shared-linksget-url)
* [`box shared-links:update ITEMID ITEMTYPE`](#box-shared-linksupdate-itemid-itemtype)

## `box shared-links:create ITEMID ITEMTYPE`

Create a shared link for a Box item

```
USAGE
  $ box shared-links:create ITEMID ITEMTYPE [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--access <value>]
    [--password <value>] [--unshared-at <value>] [--can-download] [--vanity-name <value>] [--can-edit]

ARGUMENTS
  ITEMID    ID of the Box item to share
  ITEMTYPE  (file|folder) Type of item for shared link: either file or folder

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --access=<value>             Shared link access level
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --[no-]can-download          Whether the shared link allows downloads
      --[no-]can-edit              Whether the shared link allows edits. Only Applicable for files.
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --password=<value>           Shared link password
      --save-to-file-path=<value>  Override default file path to save report
      --unshared-at=<value>        Time that this link will become disabled. Use s for seconds, m for minutes, h for
                                   hours, d for days, w for weeks, M for months. For example, 30 seconds is 30s from
                                   now.
      --vanity-name=<value>        Defines a custom vanity name to use in the shared link URL. It should be between 12
                                   and 30 characters. This field can contains only letters, numbers and hyphens.

DESCRIPTION
  Create a shared link for a Box item

ALIASES
  $ box shared-links:update

EXAMPLES
  $ box shared-links:create 22222 folder --access company --vanity-name my-custom-name-123
```

_See code: [src/commands/shared-links/create.js](https://github.com/box/boxcli/blob/v4.2.0/src/commands/shared-links/create.js)_

## `box shared-links:delete ITEMID ITEMTYPE`

Delete a shared link for a Box item

```
USAGE
  $ box shared-links:delete ITEMID ITEMTYPE [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ITEMID    ID of the Box item to remove the shared link from
  ITEMTYPE  (file|folder) Type of item for shared link: either file or folder

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Delete a shared link for a Box item

EXAMPLES
  $ box shared-links:delete 22222 folder
```

_See code: [src/commands/shared-links/delete.js](https://github.com/box/boxcli/blob/v4.2.0/src/commands/shared-links/delete.js)_

## `box shared-links:get URL`

Get information from a shared item URL

```
USAGE
  $ box shared-links:get URL [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--password <value>]

ARGUMENTS
  URL  Shared item URL to resolve

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --password=<value>           Shared item password
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Get information from a shared item URL

EXAMPLES
  $ box shared-links:get https://app.box.com/s/13ynxiqe3y4tup3j0yn4qairs5ebfxo3
```

_See code: [src/commands/shared-links/get.js](https://github.com/box/boxcli/blob/v4.2.0/src/commands/shared-links/get.js)_

## `box shared-links:update ITEMID ITEMTYPE`

Create a shared link for a Box item

```
USAGE
  $ box shared-links:update ITEMID ITEMTYPE [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--access <value>]
    [--password <value>] [--unshared-at <value>] [--can-download] [--vanity-name <value>] [--can-edit]

ARGUMENTS
  ITEMID    ID of the Box item to share
  ITEMTYPE  (file|folder) Type of item for shared link: either file or folder

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --access=<value>             Shared link access level
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --[no-]can-download          Whether the shared link allows downloads
      --[no-]can-edit              Whether the shared link allows edits. Only Applicable for files.
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --password=<value>           Shared link password
      --save-to-file-path=<value>  Override default file path to save report
      --unshared-at=<value>        Time that this link will become disabled. Use s for seconds, m for minutes, h for
                                   hours, d for days, w for weeks, M for months. For example, 30 seconds is 30s from
                                   now.
      --vanity-name=<value>        Defines a custom vanity name to use in the shared link URL. It should be between 12
                                   and 30 characters. This field can contains only letters, numbers and hyphens.

DESCRIPTION
  Create a shared link for a Box item

ALIASES
  $ box shared-links:update

EXAMPLES
  $ box shared-links:create 22222 folder --access company --vanity-name my-custom-name-123
```
