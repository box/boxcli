`box folders`
=============

Manage folders

* [`box folders:collaborations ID`](#box-folderscollaborations-id)
* [`box folders:collaborations:add ID`](#box-folderscollaborationsadd-id)
* [`box folders:collaborations:delete ID`](#box-folderscollaborationsdelete-id)
* [`box folders:collaborations:list ID`](#box-folderscollaborationslist-id)
* [`box folders:collaborations:update ID`](#box-folderscollaborationsupdate-id)
* [`box folders:copy ID PARENTID`](#box-folderscopy-id-parentid)
* [`box folders:create PARENTID NAME`](#box-folderscreate-parentid-name)
* [`box folders:delete ID`](#box-foldersdelete-id)
* [`box folders:download ID`](#box-foldersdownload-id)
* [`box folders:get ID`](#box-foldersget-id)
* [`box folders:items ID`](#box-foldersitems-id)
* [`box folders:list-items ID`](#box-folderslist-items-id)
* [`box folders:locks ID`](#box-folderslocks-id)
* [`box folders:locks:create ID`](#box-folderslockscreate-id)
* [`box folders:locks:delete ID`](#box-folderslocksdelete-id)
* [`box folders:locks:list ID`](#box-folderslockslist-id)
* [`box folders:metadata ID`](#box-foldersmetadata-id)
* [`box folders:metadata:add ID`](#box-foldersmetadataadd-id)
* [`box folders:metadata:create ID`](#box-foldersmetadatacreate-id)
* [`box folders:metadata:delete ID`](#box-foldersmetadatadelete-id)
* [`box folders:metadata:get ID`](#box-foldersmetadataget-id)
* [`box folders:metadata:get-all ID`](#box-foldersmetadataget-all-id)
* [`box folders:metadata:remove ID`](#box-foldersmetadataremove-id)
* [`box folders:metadata:set ID`](#box-foldersmetadataset-id)
* [`box folders:metadata:update ID`](#box-foldersmetadataupdate-id)
* [`box folders:move ID PARENTID`](#box-foldersmove-id-parentid)
* [`box folders:rename ID NAME`](#box-foldersrename-id-name)
* [`box folders:share ID`](#box-foldersshare-id)
* [`box folders:shared-links:create ID`](#box-foldersshared-linkscreate-id)
* [`box folders:shared-links:delete ID`](#box-foldersshared-linksdelete-id)
* [`box folders:shared-links:update ID`](#box-foldersshared-linksupdate-id)
* [`box folders:unshare ID`](#box-foldersunshare-id)
* [`box folders:update ID`](#box-foldersupdate-id)
* [`box folders:upload PATH`](#box-foldersupload-path)

## `box folders:collaborations ID`

List all collaborations on a folder

```
USAGE
  $ box folders:collaborations ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the folder to get the collaborations on

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
  List all collaborations on a folder

ALIASES
  $ box folders:collaborations:list

EXAMPLES
  $ box folders:collaborations 22222
```

_See code: [src/commands/folders/collaborations/index.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/folders/collaborations/index.js)_

## `box folders:collaborations:add ID`

Create a collaboration for a folder

```
USAGE
  $ box folders:collaborations:add ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [-r
    editor|viewer|previewer|uploader|previewer_uploader|viewer_uploader|co-owner |  |  |  |  |  |  | ] [--user-id
    <value> | --group-id <value> | --login <value>] [--can-view-path] [--id-only] [--notify]

ARGUMENTS
  ID  ID of the folder to add a collaboration to

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
  Create a collaboration for a folder

EXAMPLES
  $ box folders:collaborations:add 22222 --role editor --user-id 33333
```

_See code: [src/commands/folders/collaborations/add.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/folders/collaborations/add.js)_

## `box folders:collaborations:delete ID`

Remove a collaboration

```
USAGE
  $ box folders:collaborations:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
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

## `box folders:collaborations:list ID`

List all collaborations on a folder

```
USAGE
  $ box folders:collaborations:list ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the folder to get the collaborations on

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
  List all collaborations on a folder

ALIASES
  $ box folders:collaborations:list

EXAMPLES
  $ box folders:collaborations 22222
```

## `box folders:collaborations:update ID`

Update a collaboration

```
USAGE
  $ box folders:collaborations:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
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

## `box folders:copy ID PARENTID`

Copy a folder to a different folder

```
USAGE
  $ box folders:copy ID PARENTID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--name <value>]
    [--id-only]

ARGUMENTS
  ID        ID of the folder to copy
  PARENTID  ID of the new parent folder to copy the folder into

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
      --id-only                    Return only an ID to output from this command
      --json                       Output formatted JSON
      --name=<value>               An optional new name for the folder
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Copy a folder to a different folder

EXAMPLES
  $ box folders:copy 22222 44444
```

_See code: [src/commands/folders/copy.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/folders/copy.js)_

## `box folders:create PARENTID NAME`

Create a new folder

```
USAGE
  $ box folders:create PARENTID NAME [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--description
    <value>] [--id-only]

ARGUMENTS
  PARENTID  ID of parent folder to add new folder to, use '0' for the root folder
  NAME      Name of new folder

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
      --description=<value>        A description for folder <DESCRIPTION>
      --fields=<value>             Comma separated list of fields to show
      --id-only                    Return only an ID to output from this command
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Create a new folder

EXAMPLES
  $ box folders:create 22222 "New Subfolder"
```

_See code: [src/commands/folders/create.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/folders/create.js)_

## `box folders:delete ID`

Delete a folder

```
USAGE
  $ box folders:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--etag <value>] [-r] [-f]

ARGUMENTS
  ID  ID of the folder to delete

FLAGS
  -f, --force                      Permanently delete the folder, bypassing the trash
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -r, --recursive                  Delete the folder, even if it still has items in it
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --etag=<value>               Only delete if etag value matches
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Delete a folder

EXAMPLES
  $ box folders:delete 22222
```

_See code: [src/commands/folders/delete.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/folders/delete.js)_

## `box folders:download ID`

Download a folder

```
USAGE
  $ box folders:download ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--destination <value>] [--zip] [--depth
    <value>] [--create-path] [--overwrite]

ARGUMENTS
  ID  ID of the folder to download

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --[no-]create-path           Recursively creates a path to a directory if it does not exist
      --csv                        Output formatted CSV
      --depth=<value>              Number of levels deep to recurse when downloading the folder tree
      --destination=<value>        The destination folder to download the Box folder into
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --[no-]overwrite             [default: true] Overwrite the folder if it already exists.
      --save-to-file-path=<value>  Override default file path to save report
      --zip                        Download the folder into a single .zip archive

DESCRIPTION
  Download a folder

EXAMPLES
  $ box folders:download 22222
```

_See code: [src/commands/folders/download.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/folders/download.js)_

## `box folders:get ID`

Get information about a folder

```
USAGE
  $ box folders:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of folder to get; use 0 for the root folder

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
  Get information about a folder

EXAMPLES
  $ box folders:get 22222
```

_See code: [src/commands/folders/get.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/folders/get.js)_

## `box folders:items ID`

List items in a folder

```
USAGE
  $ box folders:items ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>] [--direction
    ASC|DESC] [--sort id|name|date]

ARGUMENTS
  ID  ID of the folder to get the items in, use 0 for the root folder

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
      --direction=<option>         The direction to order returned items
                                   <options: ASC|DESC>
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report
      --sort=<option>              The parameter to sort returned items
                                   <options: id|name|date>

DESCRIPTION
  List items in a folder

ALIASES
  $ box folders:list-items

EXAMPLES
  $ box folders:items 22222
```

_See code: [src/commands/folders/items.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/folders/items.js)_

## `box folders:list-items ID`

List items in a folder

```
USAGE
  $ box folders:list-items ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>] [--direction
    ASC|DESC] [--sort id|name|date]

ARGUMENTS
  ID  ID of the folder to get the items in, use 0 for the root folder

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
      --direction=<option>         The direction to order returned items
                                   <options: ASC|DESC>
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report
      --sort=<option>              The parameter to sort returned items
                                   <options: id|name|date>

DESCRIPTION
  List items in a folder

ALIASES
  $ box folders:list-items

EXAMPLES
  $ box folders:items 22222
```

## `box folders:locks ID`

List all locks on a folder

```
USAGE
  $ box folders:locks ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the folder to get the locks on

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
  List all locks on a folder

ALIASES
  $ box folders:locks:list

EXAMPLES
  $ box folders:locks 22222
```

_See code: [src/commands/folders/locks/index.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/folders/locks/index.js)_

## `box folders:locks:create ID`

Create a lock on a folder

```
USAGE
  $ box folders:locks:create ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the folder to create a lock on

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
  Create a lock on a folder

EXAMPLES
  $ box folders:locks:create 22222
```

_See code: [src/commands/folders/locks/create.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/folders/locks/create.js)_

## `box folders:locks:delete ID`

Delete a lock on a folder

```
USAGE
  $ box folders:locks:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the folder lock to delete

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
  Delete a lock on a folder

EXAMPLES
  $ box folders:locks:delete 22222
```

_See code: [src/commands/folders/locks/delete.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/folders/locks/delete.js)_

## `box folders:locks:list ID`

List all locks on a folder

```
USAGE
  $ box folders:locks:list ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the folder to get the locks on

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
  List all locks on a folder

ALIASES
  $ box folders:locks:list

EXAMPLES
  $ box folders:locks 22222
```

## `box folders:metadata ID`

Get all metadata on a folder

```
USAGE
  $ box folders:metadata ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the folder to get all metadata on

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
  Get all metadata on a folder

ALIASES
  $ box folders:metadata:get-all

EXAMPLES
  $ box folders:metadata 22222
```

_See code: [src/commands/folders/metadata/index.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/folders/metadata/index.js)_

## `box folders:metadata:add ID`

Add metadata to a folder

```
USAGE
  $ box folders:metadata:add ID --data <value>... --template-key <value> [-t <value>] [--as-user <value>] [--no-color]
    [--json | --csv] [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y]
    [-q] [--scope <value>]

ARGUMENTS
  ID  ID of the folder to add metadata to

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
      --data=<value>...            (required) Metadata key and value, in the form "key=value".  Note: For float type,
                                   use "#" at the beginning of digits: key2=#1234.50
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report
      --scope=<value>              [default: enterprise] The scope of the metadata template to use
      --template-key=<value>       (required) The key of the metadata template to use

DESCRIPTION
  Add metadata to a folder

ALIASES
  $ box folders:metadata:create

EXAMPLES
  $ box folders:metadata:add 22222 --template-key employeeRecord --data "name=John Doe" --data department=Sales

  $ box folders:metadata:add 22222 --template-key myTemplate --data "multiselectkey1=[option1A,option1B]" --data "multiselectkey2=[option2A]"
```

_See code: [src/commands/folders/metadata/add.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/folders/metadata/add.js)_

## `box folders:metadata:create ID`

Add metadata to a folder

```
USAGE
  $ box folders:metadata:create ID --data <value>... --template-key <value> [-t <value>] [--as-user <value>] [--no-color]
    [--json | --csv] [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y]
    [-q] [--scope <value>]

ARGUMENTS
  ID  ID of the folder to add metadata to

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
      --data=<value>...            (required) Metadata key and value, in the form "key=value".  Note: For float type,
                                   use "#" at the beginning of digits: key2=#1234.50
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report
      --scope=<value>              [default: enterprise] The scope of the metadata template to use
      --template-key=<value>       (required) The key of the metadata template to use

DESCRIPTION
  Add metadata to a folder

ALIASES
  $ box folders:metadata:create

EXAMPLES
  $ box folders:metadata:add 22222 --template-key employeeRecord --data "name=John Doe" --data department=Sales

  $ box folders:metadata:add 22222 --template-key myTemplate --data "multiselectkey1=[option1A,option1B]" --data "multiselectkey2=[option2A]"
```

## `box folders:metadata:delete ID`

Delete metadata from a folder

```
USAGE
  $ box folders:metadata:delete ID --template-key <value> [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s
    | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--scope <value>]

ARGUMENTS
  ID  ID of the folder to remove metadata from

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
      --scope=<value>              [default: enterprise] The scope of the metadata template to remove
      --template-key=<value>       (required) The key of the metadata template to remove

DESCRIPTION
  Delete metadata from a folder

ALIASES
  $ box folders:metadata:delete

EXAMPLES
  $ box folders:metadata:remove 22222 --scope global --template-key properties
```

## `box folders:metadata:get ID`

Get information about a metadata object

```
USAGE
  $ box folders:metadata:get ID --template-key <value> [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s
    | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--scope <value>]

ARGUMENTS
  ID  ID of the folder to get metadata on

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
      --scope=<value>              [default: enterprise] The scope of the metadata template to retrieve
      --template-key=<value>       (required) The key of the metadata template to retrieve

DESCRIPTION
  Get information about a metadata object

EXAMPLES
  $ box folders:metadata:get 22222 --template-key employeeRecord
```

_See code: [src/commands/folders/metadata/get.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/folders/metadata/get.js)_

## `box folders:metadata:get-all ID`

Get all metadata on a folder

```
USAGE
  $ box folders:metadata:get-all ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the folder to get all metadata on

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
  Get all metadata on a folder

ALIASES
  $ box folders:metadata:get-all

EXAMPLES
  $ box folders:metadata 22222
```

## `box folders:metadata:remove ID`

Delete metadata from a folder

```
USAGE
  $ box folders:metadata:remove ID --template-key <value> [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s
    | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--scope <value>]

ARGUMENTS
  ID  ID of the folder to remove metadata from

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
      --scope=<value>              [default: enterprise] The scope of the metadata template to remove
      --template-key=<value>       (required) The key of the metadata template to remove

DESCRIPTION
  Delete metadata from a folder

ALIASES
  $ box folders:metadata:delete

EXAMPLES
  $ box folders:metadata:remove 22222 --scope global --template-key properties
```

_See code: [src/commands/folders/metadata/remove.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/folders/metadata/remove.js)_

## `box folders:metadata:set ID`

Set metadata on a folder

```
USAGE
  $ box folders:metadata:set ID --data <value>... --template-key <value> [-t <value>] [--as-user <value>] [--no-color]
    [--json | --csv] [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y]
    [-q] [--scope <value>]

ARGUMENTS
  ID  ID of the folder to add metadata to

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
      --data=<value>...            (required) Metadata key and value, in the form "key=value".  Note: For float type,
                                   use "#" at the beginning of digits: key2=#1234.50
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report
      --scope=<value>              [default: enterprise] The scope of the metadata template to use
      --template-key=<value>       (required) The key of the metadata template to use

DESCRIPTION
  Set metadata on a folder

EXAMPLES
  $ box folders:metadata:set 22222 --template-key employeeRecord --data "name=John Doe" --data department=Sales

  $ box folders:metadata:set 22222 --template-key myTemplate --data "multiselectkey1=[option1A,option1B]" --data "multiselectkey2=[option2A]"
```

_See code: [src/commands/folders/metadata/set.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/folders/metadata/set.js)_

## `box folders:metadata:update ID`

Update the metadata attached to a folder

```
USAGE
  $ box folders:metadata:update ID --template-key <value> [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s
    | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--scope <value>]
    [-a <value>...] [-c <value>...] [-m <value>...] [--remove <value>...] [--replace <value>...] [-t <value>...]

ARGUMENTS
  ID  ID of the folder to update metadata on

FLAGS
  -a, --add=<value>...             Add a key to the metadata document; must be in the form key=value
  -c, --copy=<value>...            Copy a metadata value to another key; must be in the form sourceKey>destinationKey
  -h, --help                       Show CLI help
  -m, --move=<value>...            Move a metadata value from one key to another; must be in the form
                                   sourceKey>destinationKey
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --test=<value>...            Test that a metadata key contains a specific value; must be in the form key=value
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --remove=<value>...          Remove a key from the metadata document
      --replace=<value>...         Replace the value of an existing metadata key; must be in the form key=value
      --save-to-file-path=<value>  Override default file path to save report
      --scope=<value>              [default: enterprise] The scope of the metadata template to update against
      --template-key=<value>       (required) The key of the metadata template to update against

DESCRIPTION
  Update the metadata attached to a folder

EXAMPLES
  $ box folders:metadata:update 22222 --template-key employeeRecord --replace department=Finance
```

_See code: [src/commands/folders/metadata/update.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/folders/metadata/update.js)_

## `box folders:move ID PARENTID`

Move a folder to a different folder

```
USAGE
  $ box folders:move ID PARENTID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--etag <value>]

ARGUMENTS
  ID        ID of folder to copy
  PARENTID  ID of the new parent folder to move the folder into

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
      --etag=<value>               Only move if etag value matches
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Move a folder to a different folder

EXAMPLES
  $ box folders:move 22222 44444
```

_See code: [src/commands/folders/move.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/folders/move.js)_

## `box folders:rename ID NAME`

Rename a folder

```
USAGE
  $ box folders:rename ID NAME [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--description
    <value>] [--etag <value>]

ARGUMENTS
  ID    ID of the folder to rename
  NAME  New name for the folder

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
      --description=<value>        Change the folder description
      --etag=<value>               Only rename if etag value matches
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Rename a folder

EXAMPLES
  $ box folders:rename 22222 "New Folder Name"
```

_See code: [src/commands/folders/rename.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/folders/rename.js)_

## `box folders:share ID`

Create a shared link for a folder

```
USAGE
  $ box folders:share ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--access <value>] [--password <value>]
    [--unshared-at <value>] [--can-download] [--vanity-name <value>]

ARGUMENTS
  ID  ID of the folder to share

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
  Create a shared link for a folder

ALIASES
  $ box folders:shared-links:create
  $ box folders:shared-links:update

EXAMPLES
  $ box folders:share 22222 --access company --vanity-name my-custom-name-123
```

_See code: [src/commands/folders/share.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/folders/share.js)_

## `box folders:shared-links:create ID`

Create a shared link for a folder

```
USAGE
  $ box folders:shared-links:create ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--access <value>] [--password <value>]
    [--unshared-at <value>] [--can-download] [--vanity-name <value>]

ARGUMENTS
  ID  ID of the folder to share

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
  Create a shared link for a folder

ALIASES
  $ box folders:shared-links:create
  $ box folders:shared-links:update

EXAMPLES
  $ box folders:share 22222 --access company --vanity-name my-custom-name-123
```

## `box folders:shared-links:delete ID`

Delete a shared link for a folder

```
USAGE
  $ box folders:shared-links:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the folder to unshare

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
  Delete a shared link for a folder

ALIASES
  $ box folders:shared-links:delete

EXAMPLES
  $ box folders:unshare 22222
```

## `box folders:shared-links:update ID`

Create a shared link for a folder

```
USAGE
  $ box folders:shared-links:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--access <value>] [--password <value>]
    [--unshared-at <value>] [--can-download] [--vanity-name <value>]

ARGUMENTS
  ID  ID of the folder to share

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
  Create a shared link for a folder

ALIASES
  $ box folders:shared-links:create
  $ box folders:shared-links:update

EXAMPLES
  $ box folders:share 22222 --access company --vanity-name my-custom-name-123
```

## `box folders:unshare ID`

Delete a shared link for a folder

```
USAGE
  $ box folders:unshare ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the folder to unshare

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
  Delete a shared link for a folder

ALIASES
  $ box folders:shared-links:delete

EXAMPLES
  $ box folders:unshare 22222
```

_See code: [src/commands/folders/unshare.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/folders/unshare.js)_

## `box folders:update ID`

Update a folder

```
USAGE
  $ box folders:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--name <value>]
    [--can-non-owners-invite] [--can-non-owners-view-collaborators] [--description <value>] [--upload-email-access
    open|collaborators] [--tags <value>] [--sync] [--restrict-collaboration] [--restrict-to-enterprise] [--etag <value>]

ARGUMENTS
  ID  ID of the folder to update

FLAGS
  -h, --help                                    Show CLI help
  -q, --quiet                                   Suppress any non-error output to stderr
  -s, --save                                    Save report to default reports folder on disk
  -t, --token=<value>                           Provide a token to perform this call
  -v, --verbose                                 Show verbose output, which can be helpful for debugging
  -y, --yes                                     Automatically respond yes to all confirmation prompts
      --as-user=<value>                         Provide an ID for a user
      --bulk-file-path=<value>                  File path to bulk .csv or .json objects
      --[no-]can-non-owners-invite              Specifies if users who are not the owner of the folder can invite new
                                                collaborators to the folder.
      --[no-]can-non-owners-view-collaborators  Restricts collaborators who are not the owner of this folder from
                                                viewing other collaborations on this folder.
      --csv                                     Output formatted CSV
      --description=<value>                     New description for folder
      --etag=<value>                            Only apply updates if the etag value matches
      --fields=<value>                          Comma separated list of fields to show
      --json                                    Output formatted JSON
      --name=<value>                            New name for folder
      --no-color                                Turn off colors for logging
      --[no-]restrict-collaboration             Restrict collaboration so only owners can invite new collaborators
      --[no-]restrict-to-enterprise             Restrict collaboration so only users in the folder owner's enterprise
                                                can be added
      --save-to-file-path=<value>               Override default file path to save report
      --[no-]sync                               Whether the folder is synced to desktop
      --tags=<value>                            Comma seperated tags
      --upload-email-access=<option>            Upload email access level
                                                <options: open|collaborators>

DESCRIPTION
  Update a folder

EXAMPLES
  $ box folders:update 22222 --name "New Folder Name"
```

_See code: [src/commands/folders/update.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/folders/update.js)_

## `box folders:upload PATH`

Upload a folder

```
USAGE
  $ box folders:upload PATH [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--folder-name <value>] [--id-only] [-p
    <value>]

ARGUMENTS
  PATH  Local path to the folder to upload

FLAGS
  -h, --help                       Show CLI help
  -p, --parent-folder=<value>      [default: 0] Folder to upload this folder into; defaults to the root folder
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --folder-name=<value>        Name to use for folder if not using local folder name
      --id-only                    Return only an ID to output from this command
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Upload a folder

EXAMPLES
  $ box folders:upload /path/to/folder
```

_See code: [src/commands/folders/upload.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/folders/upload.js)_
