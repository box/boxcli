`box trash`
===========

List all items in trash

* [`box trash`](#box-trash)
* [`box trash:delete TYPE ID`](#box-trashdelete-type-id)
* [`box trash:get TYPE ID`](#box-trashget-type-id)
* [`box trash:restore TYPE ID`](#box-trashrestore-type-id)

## `box trash`

List all items in trash

```
USAGE
  $ box trash

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

  --max-items=max-items                  A value that indicates the maximum number of results to return. This only
                                         specifies a maximum boundary and will not guarantee the minimum number of
                                         results returned. When the max-items (x) is greater than 1000, then the maximum
                                         ceil(x/1000) requests will be made.

  --no-color                             Turn off colors for logging

  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box trash:list

EXAMPLE
  box trash
```

_See code: [src/commands/trash/index.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/trash/index.js)_

## `box trash:delete TYPE ID`

Permanently delete an item

```
USAGE
  $ box trash:delete TYPE ID

ARGUMENTS
  TYPE  (file|folder|web_link) Type of the item to permanently delete
  ID    ID of the item to permanently delete

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
  box trash:delete folder 22222
```

_See code: [src/commands/trash/delete.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/trash/delete.js)_

## `box trash:get TYPE ID`

Get information about an item in trash

```
USAGE
  $ box trash:get TYPE ID

ARGUMENTS
  TYPE  (file|folder|web_link) Type of the item to get
  ID    ID of the item to get

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
  box trash:get folder 22222
```

_See code: [src/commands/trash/get.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/trash/get.js)_

## `box trash:restore TYPE ID`

Restore an item from trash

```
USAGE
  $ box trash:restore TYPE ID

ARGUMENTS
  TYPE  (file|folder|web_link) Type of the item to restore
  ID    ID of the item to restore

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
  --name=name                            The new name for the item
  --no-color                             Turn off colors for logging

  --parent-id=parent-id                  ID of a folder to restore the item to only when the original folder no longer
                                         exists

  --save-to-file-path=save-to-file-path  Override default file path to save report

EXAMPLE
  box trash:restore folder 22222
```

_See code: [src/commands/trash/restore.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/trash/restore.js)_
