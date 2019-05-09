`box trash`
===========

List all items in trash

* [`box trash`](#box-trash)
* [`box trash:delete TYPE ID`](#box-trashdelete-type-id)

## `box trash`

List all items in trash

```
USAGE
  $ box trash

OPTIONS
  -h, --help                             Show CLI help
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

ALIASES
  $ box trash:list
```

_See code: [src/commands/trash/index.js](https://github.com/box/boxcli/blob/v2.2.0/src/commands/trash/index.js)_

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
```

_See code: [src/commands/trash/delete.js](https://github.com/box/boxcli/blob/v2.2.0/src/commands/trash/delete.js)_
