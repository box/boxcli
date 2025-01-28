`box collaborations`
====================

Manage collaborations

* [`box collaborations:add ITEMID ITEMTYPE`](#box-collaborationsadd-itemid-itemtype)
* [`box collaborations:create ITEMID ITEMTYPE`](#box-collaborationscreate-itemid-itemtype)
* [`box collaborations:delete ID`](#box-collaborationsdelete-id)
* [`box collaborations:get ID`](#box-collaborationsget-id)
* [`box collaborations:get-pending`](#box-collaborationsget-pending)
* [`box collaborations:list-for-group ID`](#box-collaborationslist-for-group-id)
* [`box collaborations:pending`](#box-collaborationspending)
* [`box collaborations:update ID`](#box-collaborationsupdate-id)

## `box collaborations:add ITEMID ITEMTYPE`

Create a collaboration for a Box item

```
USAGE
  $ box collaborations:add ITEMID ITEMTYPE [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [-r
    editor|viewer|previewer|uploader|previewer_uploader|viewer_uploader|co-owner |  |  |  |  |  |  | ] [--user-id
    <value> | --group-id <value> | --login <value>] [--can-view-path] [--id-only] [--notify]

ARGUMENTS
  ITEMID    The ID of the Box item to add the collaboration to
  ITEMTYPE  (file|folder) The type of the Box item to add the collaboration to

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -r, --role=<option>              An option to manually enter the role
                                   <options:
                                   editor|viewer|previewer|uploader|previewer_uploader|viewer_uploader|co-owner>
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --[no-]can-view-path         Whether view path collaboration feature is enabled or not
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --group-id=<value>           Id for group to collaborate
      --id-only                    Return only an ID to output from this command
      --json                       Output formatted JSON
      --login=<value>              Login for user to collaborate
      --no-color                   Turn off colors for logging
      --[no-]notify                All users will receive email notification of the collaboration
      --save-to-file-path=<value>  Override default file path to save report
      --user-id=<value>            Id for user to collaborate

DESCRIPTION
  Create a collaboration for a Box item

ALIASES
  $ box collaborations:add

EXAMPLES
  $ box collaborations:create 22222 folder --role editor --user-id 33333
```

## `box collaborations:create ITEMID ITEMTYPE`

Create a collaboration for a Box item

```
USAGE
  $ box collaborations:create ITEMID ITEMTYPE [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [-r
    editor|viewer|previewer|uploader|previewer_uploader|viewer_uploader|co-owner |  |  |  |  |  |  | ] [--user-id
    <value> | --group-id <value> | --login <value>] [--can-view-path] [--id-only] [--notify]

ARGUMENTS
  ITEMID    The ID of the Box item to add the collaboration to
  ITEMTYPE  (file|folder) The type of the Box item to add the collaboration to

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -r, --role=<option>              An option to manually enter the role
                                   <options:
                                   editor|viewer|previewer|uploader|previewer_uploader|viewer_uploader|co-owner>
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --[no-]can-view-path         Whether view path collaboration feature is enabled or not
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --group-id=<value>           Id for group to collaborate
      --id-only                    Return only an ID to output from this command
      --json                       Output formatted JSON
      --login=<value>              Login for user to collaborate
      --no-color                   Turn off colors for logging
      --[no-]notify                All users will receive email notification of the collaboration
      --save-to-file-path=<value>  Override default file path to save report
      --user-id=<value>            Id for user to collaborate

DESCRIPTION
  Create a collaboration for a Box item

ALIASES
  $ box collaborations:add

EXAMPLES
  $ box collaborations:create 22222 folder --role editor --user-id 33333
```

_See code: [src/commands/collaborations/create.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/collaborations/create.js)_

## `box collaborations:delete ID`

Remove a collaboration

```
USAGE
  $ box collaborations:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  The ID of the collaboration to delete

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
  Remove a collaboration

ALIASES
  $ box files:collaborations:delete
  $ box folders:collaborations:delete

EXAMPLES
  $ box collaborations:delete 12345
```

_See code: [src/commands/collaborations/delete.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/collaborations/delete.js)_

## `box collaborations:get ID`

Get an individual collaboration

```
USAGE
  $ box collaborations:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the collaboration to get

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
  Get an individual collaboration

EXAMPLES
  $ box collaborations:get 12345
```

_See code: [src/commands/collaborations/get.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/collaborations/get.js)_

## `box collaborations:get-pending`

List all pending collaborations for a user

```
USAGE
  $ box collaborations:get-pending [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
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
  List all pending collaborations for a user

ALIASES
  $ box collaborations:get-pending

EXAMPLES
  $ box collaborations:pending
```

## `box collaborations:list-for-group ID`

List collaborations for a group

```
USAGE
  $ box collaborations:list-for-group ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the group to get collaborations for

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
  List collaborations for a group

ALIASES
  $ box groups:list-collaborations
  $ box collaborations:list-for-group

EXAMPLES
  $ box groups:collaborations 12345
```

## `box collaborations:pending`

List all pending collaborations for a user

```
USAGE
  $ box collaborations:pending [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
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
  List all pending collaborations for a user

ALIASES
  $ box collaborations:get-pending

EXAMPLES
  $ box collaborations:pending
```

_See code: [src/commands/collaborations/pending.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/collaborations/pending.js)_

## `box collaborations:update ID`

Update a collaboration

```
USAGE
  $ box collaborations:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [-r
    editor|viewer|previewer|uploader|previewer_uploader|viewer_uploader|co-owner|owner |  |  |  |  |  |  |  | ]
    [--status accepted|pending|rejected] [--can-view-path] [--expires-at <value>]

ARGUMENTS
  ID  The ID of the collaboration to update

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -r, --role=<option>              An option to manually enter the role
                                   <options:
                                   editor|viewer|previewer|uploader|previewer_uploader|viewer_uploader|co-owner|owner>
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --[no-]can-view-path         Whether view path collaboration feature is enabled or not
      --csv                        Output formatted CSV
      --expires-at=<value>         When the collaboration should expire
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report
      --status=<option>            Update the collaboration status
                                   <options: accepted|pending|rejected>

DESCRIPTION
  Update a collaboration

ALIASES
  $ box files:collaborations:update
  $ box folders:collaborations:update

EXAMPLES
  $ box collaborations:update 12345 --role viewer
```

_See code: [src/commands/collaborations/update.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/collaborations/update.js)_
