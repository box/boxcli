`box trash`
===========

List all items in trash

* [`box trash`](#box-trash)
* [`box trash:delete TYPE ID`](#box-trashdelete-type-id)
* [`box trash:get TYPE ID`](#box-trashget-type-id)
* [`box trash:list`](#box-trashlist)
* [`box trash:restore TYPE ID`](#box-trashrestore-type-id)

## `box trash`

List all items in trash

```
USAGE
  $ box trash [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

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
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List all items in trash

ALIASES
  $ box trash:list

EXAMPLES
  $ box trash
```

_See code: [src/commands/trash/index.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/trash/index.ts)_

## `box trash:delete TYPE ID`

Permanently delete an item

```
USAGE
  $ box trash:delete TYPE ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  TYPE  (file|folder|web_link) Type of the item to permanently delete
  ID    ID of the item to permanently delete

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
  Permanently delete an item

EXAMPLES
  $ box trash:delete folder 22222
```

_See code: [src/commands/trash/delete.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/trash/delete.ts)_

## `box trash:get TYPE ID`

Get information about an item in trash

```
USAGE
  $ box trash:get TYPE ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  TYPE  (file|folder|web_link) Type of the item to get
  ID    ID of the item to get

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
  Get information about an item in trash

EXAMPLES
  $ box trash:get folder 22222
```

_See code: [src/commands/trash/get.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/trash/get.ts)_

## `box trash:list`

List all items in trash

```
USAGE
  $ box trash:list [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

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
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List all items in trash

ALIASES
  $ box trash:list

EXAMPLES
  $ box trash
```

## `box trash:restore TYPE ID`

Restore an item from trash

```
USAGE
  $ box trash:restore TYPE ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--name <value>]
    [--parent-id <value>]

ARGUMENTS
  TYPE  (file|folder|web_link) Type of the item to restore
  ID    ID of the item to restore

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
      --name=<value>               The new name for the item
      --no-color                   Turn off colors for logging
      --parent-id=<value>          ID of a folder to restore the item to only when the original folder no longer exists
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Restore an item from trash

EXAMPLES
  $ box trash:restore folder 22222
```

_See code: [src/commands/trash/restore.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/trash/restore.ts)_
