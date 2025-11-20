`box collections`
=================

List your collections

* [`box collections`](#box-collections)
* [`box collections:add ITEMTYPE ITEMID COLLECTIONID`](#box-collectionsadd-itemtype-itemid-collectionid)
* [`box collections:items ID`](#box-collectionsitems-id)
* [`box collections:list`](#box-collectionslist)
* [`box collections:remove ITEMTYPE ITEMID COLLECTIONID`](#box-collectionsremove-itemtype-itemid-collectionid)

## `box collections`

List your collections

```
USAGE
  $ box collections [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

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
  List your collections

ALIASES
  $ box collections:list

EXAMPLES
  $ box collections
```

_See code: [src/commands/collections/index.js](https://github.com/box/boxcli/blob/v4.5.0/src/commands/collections/index.js)_

## `box collections:add ITEMTYPE ITEMID COLLECTIONID`

Add an item to a collection

```
USAGE
  $ box collections:add ITEMTYPE ITEMID COLLECTIONID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv]
    [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ITEMTYPE      (folder|file|web_link) Type of item
  ITEMID        ID of the of item
  COLLECTIONID  ID of collection

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
  Add an item to a collection

EXAMPLES
  $ box collections:add file 11111 12345
```

_See code: [src/commands/collections/add.js](https://github.com/box/boxcli/blob/v4.5.0/src/commands/collections/add.js)_

## `box collections:items ID`

Get items in a collection

```
USAGE
  $ box collections:items ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

ARGUMENTS
  ID  ID of the collection to retrieve the items of

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
  Get items in a collection

EXAMPLES
  $ box collections:items 12345
```

_See code: [src/commands/collections/items.js](https://github.com/box/boxcli/blob/v4.5.0/src/commands/collections/items.js)_

## `box collections:list`

List your collections

```
USAGE
  $ box collections:list [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

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
  List your collections

ALIASES
  $ box collections:list

EXAMPLES
  $ box collections
```

## `box collections:remove ITEMTYPE ITEMID COLLECTIONID`

Remove an item from a collection

```
USAGE
  $ box collections:remove ITEMTYPE ITEMID COLLECTIONID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv]
    [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ITEMTYPE      (folder|file) Type of item
  ITEMID        ID of item
  COLLECTIONID  ID of collection

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
  Remove an item from a collection

EXAMPLES
  $ box collections:remove file 11111 12345
```

_See code: [src/commands/collections/remove.js](https://github.com/box/boxcli/blob/v4.5.0/src/commands/collections/remove.js)_
