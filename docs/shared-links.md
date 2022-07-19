`box shared-links`
==================

Manage shared links

* [`box shared-links:create ITEMID ITEMTYPE`](#box-shared-linkscreate-itemid-itemtype)
* [`box shared-links:delete ITEMID ITEMTYPE`](#box-shared-linksdelete-itemid-itemtype)
* [`box shared-links:get URL`](#box-shared-linksget-url)

## `box shared-links:create ITEMID ITEMTYPE`

Create a shared link for a Box item

```
USAGE
  $ box shared-links:create ITEMID ITEMTYPE

ARGUMENTS
  ITEMID    ID of the Box item to share
  ITEMTYPE  (file|folder) Type of item for shared link: either file or folder

OPTIONS
  -h, --help                             Show CLI help
  -q, --quiet                            Suppress any non-error output to stderr
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --access=access                        Shared link access level
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --[no-]can-download                    Whether the shared link allows downloads
  --[no-]can-edit                        Whether the shared link allows edits. Only Applicable for files.
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --password=password                    Shared link password
  --save-to-file-path=save-to-file-path  Override default file path to save report

  --unshared-at=unshared-at              Time that this link will become disabled. Use s for seconds, m for minutes, h
                                         for hours, d for days, w for weeks, M for months. For example, 30 seconds is
                                         30s from now.

ALIASES
  $ box shared-links:update

EXAMPLE
  box shared-links:create 22222 folder --access company
```

_See code: [src/commands/shared-links/create.js](https://github.com/box/boxcli/blob/v3.3.0/src/commands/shared-links/create.js)_

## `box shared-links:delete ITEMID ITEMTYPE`

Delete a shared link for a Box item

```
USAGE
  $ box shared-links:delete ITEMID ITEMTYPE

ARGUMENTS
  ITEMID    ID of the Box item to remove the shared link from
  ITEMTYPE  (file|folder) Type of item for shared link: either file or folder

OPTIONS
  -h, --help                             Show CLI help
  -q, --quiet                            Suppress any non-error output to stderr
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

EXAMPLE
  box shared-links:delete 22222 folder
```

_See code: [src/commands/shared-links/delete.js](https://github.com/box/boxcli/blob/v3.3.0/src/commands/shared-links/delete.js)_

## `box shared-links:get URL`

Get information from a shared item URL

```
USAGE
  $ box shared-links:get URL

ARGUMENTS
  URL  Shared item URL to resolve

OPTIONS
  -h, --help                             Show CLI help
  -q, --quiet                            Suppress any non-error output to stderr
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --password=password                    Shared item password
  --save-to-file-path=save-to-file-path  Override default file path to save report

EXAMPLE
  box shared-links:get https://app.box.com/s/13ynxiqe3y4tup3j0yn4qairs5ebfxo3
```

_See code: [src/commands/shared-links/get.js](https://github.com/box/boxcli/blob/v3.3.0/src/commands/shared-links/get.js)_
