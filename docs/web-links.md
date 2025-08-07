`box web-links`
===============

Manage web links

* [`box web-links:create URL`](#box-web-linkscreate-url)
* [`box web-links:delete ID`](#box-web-linksdelete-id)
* [`box web-links:get ID`](#box-web-linksget-id)
* [`box web-links:move ID PARENTID`](#box-web-linksmove-id-parentid)
* [`box web-links:update ID`](#box-web-linksupdate-id)

## `box web-links:create URL`

Create a new web link

```
USAGE
  $ box web-links:create URL --parent-id <value> [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [-d <value>] [-n
    <value>]

ARGUMENTS
  URL  The URL the web link points to. Must start with "http://" or "https://"

FLAGS
  -d, --description=<value>        Description of the web link
  -h, --help                       Show CLI help
  -n, --name=<value>               Name of the web link. Defaults to the URL if not set
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
      --parent-id=<value>          (required) ID of the folder to create the web link in
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Create a new web link

EXAMPLES
  $ box web-links:create http://example.com --parent-id 0
```

_See code: [src/commands/web-links/create.js](https://github.com/box/boxcli/blob/v4.3.0/src/commands/web-links/create.js)_

## `box web-links:delete ID`

Delete a web link

```
USAGE
  $ box web-links:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the web link to delete

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
  Delete a web link

EXAMPLES
  $ box web-links:delete 12345
```

_See code: [src/commands/web-links/delete.js](https://github.com/box/boxcli/blob/v4.3.0/src/commands/web-links/delete.js)_

## `box web-links:get ID`

Get information about a web link

```
USAGE
  $ box web-links:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the web link to get

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
  Get information about a web link

EXAMPLES
  $ box web-links:get 12345
```

_See code: [src/commands/web-links/get.js](https://github.com/box/boxcli/blob/v4.3.0/src/commands/web-links/get.js)_

## `box web-links:move ID PARENTID`

Move a web link

```
USAGE
  $ box web-links:move ID PARENTID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID        ID of the web link to move
  PARENTID  ID of the parent folder to move the web link into

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
  Move a web link

EXAMPLES
  $ box web-links:move 12345 22222
```

_See code: [src/commands/web-links/move.js](https://github.com/box/boxcli/blob/v4.3.0/src/commands/web-links/move.js)_

## `box web-links:update ID`

Update a web link

```
USAGE
  $ box web-links:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [-d <value>] [-n <value>] [-u <value>]

ARGUMENTS
  ID  ID of the web link to update

FLAGS
  -d, --description=<value>        Description of the web link
  -h, --help                       Show CLI help
  -n, --name=<value>               Name of the web link
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -u, --url=<value>                The URL the web link points to. Must start with "http://" or "https://"
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
  Update a web link

EXAMPLES
  $ box web-links:update 12345 --name "Example Site"
```

_See code: [src/commands/web-links/update.js](https://github.com/box/boxcli/blob/v4.3.0/src/commands/web-links/update.js)_
