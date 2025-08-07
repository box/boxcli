`box file-requests`
===================

Copies existing file request to new folder

* [`box file-requests:copy ID FOLDERID`](#box-file-requestscopy-id-folderid)
* [`box file-requests:delete ID`](#box-file-requestsdelete-id)
* [`box file-requests:get ID`](#box-file-requestsget-id)
* [`box file-requests:update ID`](#box-file-requestsupdate-id)

## `box file-requests:copy ID FOLDERID`

Copies existing file request to new folder

```
USAGE
  $ box file-requests:copy ID FOLDERID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--description
    <value>] [--expires-at <value>] [--description-required] [--email-required] [--status active|inactive] [--title
    <value>]

ARGUMENTS
  ID        ID of the file request to copy
  FOLDERID  ID of folder to which file request will be copied

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
      --description=<value>        New description of file request
      --[no-]description-required  is file request submitter required to provide a description of the files they are
                                   submitting
      --[no-]email-required        New date when file request expires
      --expires-at=<value>         New date when file request expires
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report
      --status=<option>            New status of file request
                                   <options: active|inactive>
      --title=<value>              New title of file request

DESCRIPTION
  Copies existing file request to new folder

EXAMPLES
  $ box file-requests:copy 22222 44444
```

_See code: [src/commands/file-requests/copy.js](https://github.com/box/boxcli/blob/v4.3.0/src/commands/file-requests/copy.js)_

## `box file-requests:delete ID`

Delete individual file request

```
USAGE
  $ box file-requests:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the file request to delete

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
  Delete individual file request

EXAMPLES
  $ box file-requests:delete 12345
```

_See code: [src/commands/file-requests/delete.js](https://github.com/box/boxcli/blob/v4.3.0/src/commands/file-requests/delete.js)_

## `box file-requests:get ID`

Get information about an file request

```
USAGE
  $ box file-requests:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the file request to get

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
  Get information about an file request

EXAMPLES
  $ box file-requests:get 12345
```

_See code: [src/commands/file-requests/get.js](https://github.com/box/boxcli/blob/v4.3.0/src/commands/file-requests/get.js)_

## `box file-requests:update ID`

Update a file request

```
USAGE
  $ box file-requests:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--description <value>] [--expires-at
    <value>] [--description-required] [--email-required] [--status active|inactive] [--title <value>] [--etag <value>]

ARGUMENTS
  ID  ID of the file request to update

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
      --description=<value>        New description of file request
      --[no-]description-required  is file request submitter required to provide a description of the files they are
                                   submitting
      --[no-]email-required        New date when file request expires
      --etag=<value>               Pass in the item's last observed etag value into this header and the endpoint will
                                   fail with a 412 Precondition Failed if it has changed since.
      --expires-at=<value>         New date when file request expires
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report
      --status=<option>            New status of file request
                                   <options: active|inactive>
      --title=<value>              New title of file request

DESCRIPTION
  Update a file request

EXAMPLES
  $ box file-requests:update 12345 --description "New file request description!"
```

_See code: [src/commands/file-requests/update.js](https://github.com/box/boxcli/blob/v4.3.0/src/commands/file-requests/update.js)_
