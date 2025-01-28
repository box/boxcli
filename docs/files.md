`box files`
===========

Manage files

* [`box files:collaborations ID`](#box-filescollaborations-id)
* [`box files:collaborations:add ID`](#box-filescollaborationsadd-id)
* [`box files:collaborations:delete ID`](#box-filescollaborationsdelete-id)
* [`box files:collaborations:list ID`](#box-filescollaborationslist-id)
* [`box files:collaborations:update ID`](#box-filescollaborationsupdate-id)
* [`box files:comments ID`](#box-filescomments-id)
* [`box files:copy ID PARENTID`](#box-filescopy-id-parentid)
* [`box files:delete ID`](#box-filesdelete-id)
* [`box files:download ID`](#box-filesdownload-id)
* [`box files:get ID`](#box-filesget-id)
* [`box files:lock ID`](#box-fileslock-id)
* [`box files:metadata ID`](#box-filesmetadata-id)
* [`box files:metadata:add ID`](#box-filesmetadataadd-id)
* [`box files:metadata:create ID`](#box-filesmetadatacreate-id)
* [`box files:metadata:delete ID`](#box-filesmetadatadelete-id)
* [`box files:metadata:get ID`](#box-filesmetadataget-id)
* [`box files:metadata:get-all ID`](#box-filesmetadataget-all-id)
* [`box files:metadata:remove ID`](#box-filesmetadataremove-id)
* [`box files:metadata:set ID`](#box-filesmetadataset-id)
* [`box files:metadata:update ID`](#box-filesmetadataupdate-id)
* [`box files:move ID PARENTID`](#box-filesmove-id-parentid)
* [`box files:rename ID NAME`](#box-filesrename-id-name)
* [`box files:share ID`](#box-filesshare-id)
* [`box files:shared-links:create ID`](#box-filesshared-linkscreate-id)
* [`box files:shared-links:delete ID`](#box-filesshared-linksdelete-id)
* [`box files:shared-links:update ID`](#box-filesshared-linksupdate-id)
* [`box files:tasks ID`](#box-filestasks-id)
* [`box files:tasks:list ID`](#box-filestaskslist-id)
* [`box files:unlock ID`](#box-filesunlock-id)
* [`box files:unshare ID`](#box-filesunshare-id)
* [`box files:update ID`](#box-filesupdate-id)
* [`box files:update-lock ID`](#box-filesupdate-lock-id)
* [`box files:upload PATH`](#box-filesupload-path)
* [`box files:versions FILEID`](#box-filesversions-fileid)
* [`box files:versions:delete FILEID FILEVERSIONID`](#box-filesversionsdelete-fileid-fileversionid)
* [`box files:versions:download FILEID FILEVERSIONID`](#box-filesversionsdownload-fileid-fileversionid)
* [`box files:versions:list FILEID`](#box-filesversionslist-fileid)
* [`box files:versions:promote FILEID FILEVERSIONID`](#box-filesversionspromote-fileid-fileversionid)
* [`box files:versions:upload FILEID PATH`](#box-filesversionsupload-fileid-path)
* [`box files:zip NAME`](#box-fileszip-name)

## `box files:collaborations ID`

List all collaborations on a file

```
USAGE
  $ box files:collaborations ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

ARGUMENTS
  ID  ID of the file to get collaborations for

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
  List all collaborations on a file

ALIASES
  $ box files:collaborations:list

EXAMPLES
  $ box files:collaborations 11111
```

_See code: [src/commands/files/collaborations/index.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/collaborations/index.js)_

## `box files:collaborations:add ID`

Create a collaboration for a file

```
USAGE
  $ box files:collaborations:add ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [-r
    editor|viewer|previewer|uploader|previewer_uploader|viewer_uploader|co-owner |  |  |  |  |  |  | ] [--user-id
    <value> | --group-id <value> | --login <value>] [--can-view-path] [--id-only] [--notify]

ARGUMENTS
  ID  ID of the file to add a collaboration to

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
  Create a collaboration for a file

EXAMPLES
  $ box files:collaborations:add 11111 --role editor --user-id 22222
```

_See code: [src/commands/files/collaborations/add.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/collaborations/add.js)_

## `box files:collaborations:delete ID`

Remove a collaboration

```
USAGE
  $ box files:collaborations:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
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

## `box files:collaborations:list ID`

List all collaborations on a file

```
USAGE
  $ box files:collaborations:list ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

ARGUMENTS
  ID  ID of the file to get collaborations for

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
  List all collaborations on a file

ALIASES
  $ box files:collaborations:list

EXAMPLES
  $ box files:collaborations 11111
```

## `box files:collaborations:update ID`

Update a collaboration

```
USAGE
  $ box files:collaborations:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
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

## `box files:comments ID`

List all comments on a file

```
USAGE
  $ box files:comments ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the file to get comments for

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
  List all comments on a file

ALIASES
  $ box comments:list

EXAMPLES
  $ box files:comments 11111
```

_See code: [src/commands/files/comments.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/comments.js)_

## `box files:copy ID PARENTID`

Copy a file to a different folder

```
USAGE
  $ box files:copy ID PARENTID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--name <value>]
    [--version <value>] [--id-only]

ARGUMENTS
  ID        ID of the file to copy
  PARENTID  ID of the new parent folder to copy the file into

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
      --id-only                    Output only the ID of the file copy
      --json                       Output formatted JSON
      --name=<value>               New name for the file
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report
      --version=<value>            File version ID if you want to copy a specific file version

DESCRIPTION
  Copy a file to a different folder

EXAMPLES
  $ box files:copy 11111 22222
```

_See code: [src/commands/files/copy.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/copy.js)_

## `box files:delete ID`

Delete a file

```
USAGE
  $ box files:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [-f] [--etag <value>]

ARGUMENTS
  ID  ID of the file to delete

FLAGS
  -f, --force                      Permanently delete the item, bypassing the trash
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
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
  Delete a file

EXAMPLES
  $ box files:delete 11111
```

_See code: [src/commands/files/delete.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/delete.js)_

## `box files:download ID`

Download a file

```
USAGE
  $ box files:download ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--version <value>] [--destination
    <value>] [--create-path] [--overwrite] [--save-as <value>]

ARGUMENTS
  ID  ID of the file to download

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
      --destination=<value>        The destination folder to write the file to
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --[no-]overwrite             Overwrite a file if it already exists
      --save-as=<value>            The filename used when saving the file
      --save-to-file-path=<value>  Override default file path to save report
      --version=<value>            File version ID of the specific file version to download

DESCRIPTION
  Download a file

EXAMPLES
  $ box files:download 11111 --destination /path/to/destinationFolder
```

_See code: [src/commands/files/download.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/download.js)_

## `box files:get ID`

Get information about a file

```
USAGE
  $ box files:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the file to get

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
  Get information about a file

EXAMPLES
  $ box files:get 11111
```

_See code: [src/commands/files/get.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/get.js)_

## `box files:lock ID`

Lock a file

```
USAGE
  $ box files:lock ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--expires <value>] [--prevent-download]

ARGUMENTS
  ID  ID of file to lock

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
      --expires=<value>            Make the lock expire from a timespan set from now. Use s for seconds, m for minutes,
                                   h for hours, d for days, w for weeks, M for months. For example, 30 seconds is 30s
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --[no-]prevent-download      Prevent download of locked file
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Lock a file

ALIASES
  $ box files:update-lock

EXAMPLES
  $ box files:lock 11111
```

_See code: [src/commands/files/lock.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/lock.js)_

## `box files:metadata ID`

Get all metadata on a file

```
USAGE
  $ box files:metadata ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  Id of the file

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
  Get all metadata on a file

ALIASES
  $ box files:metadata:get-all

EXAMPLES
  $ box files:metadata 11111
```

_See code: [src/commands/files/metadata/index.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/metadata/index.js)_

## `box files:metadata:add ID`

Add metadata to a file

```
USAGE
  $ box files:metadata:add ID --data <value>... --template-key <value> [-t <value>] [--as-user <value>] [--no-color]
    [--json | --csv] [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y]
    [-q] [--scope <value>]

ARGUMENTS
  ID  ID of the file to add metadata to

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
  Add metadata to a file

ALIASES
  $ box files:metadata:create

EXAMPLES
  $ box files:metadata:add 11111 --template-key employeeRecord --data "name=John Doe" --data department=Sales

  $ box files:metadata:add 22222 --template-key myTemplate --data "multiselectkey1=[option1A,option1B]" --data "multiselectkey2=[option2A]"
```

_See code: [src/commands/files/metadata/add.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/metadata/add.js)_

## `box files:metadata:create ID`

Add metadata to a file

```
USAGE
  $ box files:metadata:create ID --data <value>... --template-key <value> [-t <value>] [--as-user <value>] [--no-color]
    [--json | --csv] [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y]
    [-q] [--scope <value>]

ARGUMENTS
  ID  ID of the file to add metadata to

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
  Add metadata to a file

ALIASES
  $ box files:metadata:create

EXAMPLES
  $ box files:metadata:add 11111 --template-key employeeRecord --data "name=John Doe" --data department=Sales

  $ box files:metadata:add 22222 --template-key myTemplate --data "multiselectkey1=[option1A,option1B]" --data "multiselectkey2=[option2A]"
```

## `box files:metadata:delete ID`

Delete metadata from a file

```
USAGE
  $ box files:metadata:delete ID --template-key <value> [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s
    | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--scope <value>]

ARGUMENTS
  ID  ID of the file to remove metadata from

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
  Delete metadata from a file

ALIASES
  $ box files:metadata:delete

EXAMPLES
  $ box files:metadata:remove 11111 --scope global --template-key properties
```

## `box files:metadata:get ID`

Get information about a metadata object

```
USAGE
  $ box files:metadata:get ID --template-key <value> [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s
    | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--scope <value>]

ARGUMENTS
  ID  ID of the file to get metadata on

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
  $ box files:metadata:get 11111 --template-key employeeRecord
```

_See code: [src/commands/files/metadata/get.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/metadata/get.js)_

## `box files:metadata:get-all ID`

Get all metadata on a file

```
USAGE
  $ box files:metadata:get-all ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  Id of the file

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
  Get all metadata on a file

ALIASES
  $ box files:metadata:get-all

EXAMPLES
  $ box files:metadata 11111
```

## `box files:metadata:remove ID`

Delete metadata from a file

```
USAGE
  $ box files:metadata:remove ID --template-key <value> [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s
    | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--scope <value>]

ARGUMENTS
  ID  ID of the file to remove metadata from

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
  Delete metadata from a file

ALIASES
  $ box files:metadata:delete

EXAMPLES
  $ box files:metadata:remove 11111 --scope global --template-key properties
```

_See code: [src/commands/files/metadata/remove.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/metadata/remove.js)_

## `box files:metadata:set ID`

Set metadata on a file

```
USAGE
  $ box files:metadata:set ID --data <value>... --template-key <value> [-t <value>] [--as-user <value>] [--no-color]
    [--json | --csv] [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y]
    [-q] [--scope <value>]

ARGUMENTS
  ID  ID of the file to add metadata to

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
  Set metadata on a file

EXAMPLES
  $ box files:metadata:set 11111 --template-key employeeRecord --data "name=John Doe" --data department=Sales

  $ box files:metadata:set 22222 --template-key myTemplate --data "multiselectkey1=[option1A,option1B]" --data "multiselectkey2=[option2A]"
```

_See code: [src/commands/files/metadata/set.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/metadata/set.js)_

## `box files:metadata:update ID`

Update the metadata attached to a file

```
USAGE
  $ box files:metadata:update ID --template-key <value> [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s
    | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--scope <value>]
    [-a <value>...] [-c <value>...] [-m <value>...] [--remove <value>...] [--replace <value>...] [-t <value>...]

ARGUMENTS
  ID  ID of the file to update metadata on

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
  Update the metadata attached to a file

EXAMPLES
  $ box files:metadata:update 11111 --template-key employeeRecord --replace department=Finance
```

_See code: [src/commands/files/metadata/update.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/metadata/update.js)_

## `box files:move ID PARENTID`

Move a file to a different folder

```
USAGE
  $ box files:move ID PARENTID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--etag <value>]

ARGUMENTS
  ID        ID of the file to move
  PARENTID  ID of the new parent folder to move the file into

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
  Move a file to a different folder

EXAMPLES
  $ box files:move 11111 22222
```

_See code: [src/commands/files/move.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/move.js)_

## `box files:rename ID NAME`

Rename a file

```
USAGE
  $ box files:rename ID NAME [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--description
    <value>] [--etag <value>]

ARGUMENTS
  ID    ID of file to rename
  NAME  New name of file

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
      --description=<value>        Change the file description
      --etag=<value>               Only rename if etag value matches
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Rename a file

EXAMPLES
  $ box files:rename 11111 "New File Name.pdf"
```

_See code: [src/commands/files/rename.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/rename.js)_

## `box files:share ID`

Create a shared link for a file

```
USAGE
  $ box files:share ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--access <value>] [--password <value>]
    [--unshared-at <value>] [--can-download] [--vanity-name <value>] [--can-edit]

ARGUMENTS
  ID  ID of the file to share

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
  Create a shared link for a file

ALIASES
  $ box files:shared-links:create
  $ box files:shared-links:update

EXAMPLES
  $ box files:share 11111 --access company --vanity-name my-custom-name-123
```

_See code: [src/commands/files/share.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/share.js)_

## `box files:shared-links:create ID`

Create a shared link for a file

```
USAGE
  $ box files:shared-links:create ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--access <value>] [--password <value>]
    [--unshared-at <value>] [--can-download] [--vanity-name <value>] [--can-edit]

ARGUMENTS
  ID  ID of the file to share

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
  Create a shared link for a file

ALIASES
  $ box files:shared-links:create
  $ box files:shared-links:update

EXAMPLES
  $ box files:share 11111 --access company --vanity-name my-custom-name-123
```

## `box files:shared-links:delete ID`

Delete a shared link for a file

```
USAGE
  $ box files:shared-links:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the file to unshare

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
  Delete a shared link for a file

ALIASES
  $ box files:shared-links:delete

EXAMPLES
  $ box files:unshare 11111
```

## `box files:shared-links:update ID`

Create a shared link for a file

```
USAGE
  $ box files:shared-links:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--access <value>] [--password <value>]
    [--unshared-at <value>] [--can-download] [--vanity-name <value>] [--can-edit]

ARGUMENTS
  ID  ID of the file to share

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
  Create a shared link for a file

ALIASES
  $ box files:shared-links:create
  $ box files:shared-links:update

EXAMPLES
  $ box files:share 11111 --access company --vanity-name my-custom-name-123
```

## `box files:tasks ID`

List all tasks on this file

```
USAGE
  $ box files:tasks ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of file on which to retrieve tasks

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
  List all tasks on this file

ALIASES
  $ box files:tasks:list

EXAMPLES
  $ box files:tasks 11111
```

_See code: [src/commands/files/tasks/index.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/tasks/index.js)_

## `box files:tasks:list ID`

List all tasks on this file

```
USAGE
  $ box files:tasks:list ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of file on which to retrieve tasks

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
  List all tasks on this file

ALIASES
  $ box files:tasks:list

EXAMPLES
  $ box files:tasks 11111
```

## `box files:unlock ID`

Unlock a file

```
USAGE
  $ box files:unlock ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  Id of file to unlock

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
  Unlock a file

EXAMPLES
  $ box files:unlock 11111
```

_See code: [src/commands/files/unlock.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/unlock.js)_

## `box files:unshare ID`

Delete a shared link for a file

```
USAGE
  $ box files:unshare ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the file to unshare

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
  Delete a shared link for a file

ALIASES
  $ box files:shared-links:delete

EXAMPLES
  $ box files:unshare 11111
```

_See code: [src/commands/files/unshare.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/unshare.js)_

## `box files:update ID`

Update a file record

```
USAGE
  $ box files:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--name <value>] [--description <value>]
    [--tags <value>] [--etag <value>] [--disposition-at <value>]

ARGUMENTS
  ID  ID of the file to update

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
      --description=<value>        New description for the file
      --disposition-at=<value>     The retention expiration timestamp for the given file. This date cannot be shortened
                                   once set on a file
      --etag=<value>               Only apply updates if the ETag value matches
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --name=<value>               New name for the file
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report
      --tags=<value>               Set tags on the file, specified as comma-separated tags

DESCRIPTION
  Update a file record

EXAMPLES
  $ box files:update 11111 --name "New File Name.pdf"
```

_See code: [src/commands/files/update.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/update.js)_

## `box files:update-lock ID`

Lock a file

```
USAGE
  $ box files:update-lock ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--expires <value>] [--prevent-download]

ARGUMENTS
  ID  ID of file to lock

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
      --expires=<value>            Make the lock expire from a timespan set from now. Use s for seconds, m for minutes,
                                   h for hours, d for days, w for weeks, M for months. For example, 30 seconds is 30s
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --[no-]prevent-download      Prevent download of locked file
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Lock a file

ALIASES
  $ box files:update-lock

EXAMPLES
  $ box files:lock 11111
```

## `box files:upload PATH`

Upload a file

```
USAGE
  $ box files:upload PATH [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [-p <value>] [-n <value>]
    [--content-created-at <value>] [--content-modified-at <value>] [--id-only]

ARGUMENTS
  PATH  Path to the file to be uploaded

FLAGS
  -h, --help                         Show CLI help
  -n, --name=<value>                 Provide different name for uploaded file
  -p, --parent-id=<value>            [default: 0] ID of the parent folder to upload the file to; defaults to the root
                                     folder
  -q, --quiet                        Suppress any non-error output to stderr
  -s, --save                         Save report to default reports folder on disk
  -t, --token=<value>                Provide a token to perform this call
  -v, --verbose                      Show verbose output, which can be helpful for debugging
  -y, --yes                          Automatically respond yes to all confirmation prompts
      --as-user=<value>              Provide an ID for a user
      --bulk-file-path=<value>       File path to bulk .csv or .json objects
      --content-created-at=<value>   The creation date of the file content. Use a timestamp or shorthand syntax 0t, like
                                     5w for 5 weeks
      --content-modified-at=<value>  The modification date of the file content. Use a timestamp or shorthand syntax 0t,
                                     like 5w for 5 weeks
      --csv                          Output formatted CSV
      --fields=<value>               Comma separated list of fields to show
      --id-only                      Return only an ID to output from this command
      --json                         Output formatted JSON
      --no-color                     Turn off colors for logging
      --save-to-file-path=<value>    Override default file path to save report

DESCRIPTION
  Upload a file

EXAMPLES
  $ box files:upload /path/to/file.pdf --parent-id 22222
```

_See code: [src/commands/files/upload.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/upload.js)_

## `box files:versions FILEID`

Get a list of file versions

```
USAGE
  $ box files:versions FILEID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

ARGUMENTS
  FILEID  ID of file to get versions for

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
  Get a list of file versions

ALIASES
  $ box files:versions:list

EXAMPLES
  $ box files:versions 11111
```

_See code: [src/commands/files/versions/index.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/versions/index.js)_

## `box files:versions:delete FILEID FILEVERSIONID`

Delete a file version

```
USAGE
  $ box files:versions:delete FILEID FILEVERSIONID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--etag <value>]

ARGUMENTS
  FILEID         ID of the file to get versions for
  FILEVERSIONID  ID of the file version to delete

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
      --etag=<value>               Only delete if etag value matches
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Delete a file version

EXAMPLES
  $ box files:versions:delete 11111 55555
```

_See code: [src/commands/files/versions/delete.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/versions/delete.js)_

## `box files:versions:download FILEID FILEVERSIONID`

Download a specific version of a file

```
USAGE
  $ box files:versions:download FILEID FILEVERSIONID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--destination
    <value>] [--create-path] [--overwrite] [--save-as <value>]

ARGUMENTS
  FILEID         ID of the file to download
  FILEVERSIONID  ID of file version to download

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
      --destination=<value>        The destination folder to write the file to
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --[no-]overwrite             Overwrite a file if it already exists
      --save-as=<value>            The filename used when saving the file
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Download a specific version of a file

EXAMPLES
  $ box files:versions:download 11111 55555
```

_See code: [src/commands/files/versions/download.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/versions/download.js)_

## `box files:versions:list FILEID`

Get a list of file versions

```
USAGE
  $ box files:versions:list FILEID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

ARGUMENTS
  FILEID  ID of file to get versions for

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
  Get a list of file versions

ALIASES
  $ box files:versions:list

EXAMPLES
  $ box files:versions 11111
```

## `box files:versions:promote FILEID FILEVERSIONID`

Promote a file version

```
USAGE
  $ box files:versions:promote FILEID FILEVERSIONID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  FILEID         ID of the file to get versions for
  FILEVERSIONID  ID of the file version to delete

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
  Promote a file version

EXAMPLES
  $ box files:versions:promote 11111 55555
```

_See code: [src/commands/files/versions/promote.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/versions/promote.js)_

## `box files:versions:upload FILEID PATH`

Upload a new version of a file

```
USAGE
  $ box files:versions:upload FILEID PATH [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]
    [--content-modified-at <value>] [-n <value>]

ARGUMENTS
  FILEID  ID of the file to upload a new version of
  PATH    Local path to the file to upload

FLAGS
  -h, --help                         Show CLI help
  -n, --name=<value>                 Provide different name for uploaded file
  -q, --quiet                        Suppress any non-error output to stderr
  -s, --save                         Save report to default reports folder on disk
  -t, --token=<value>                Provide a token to perform this call
  -v, --verbose                      Show verbose output, which can be helpful for debugging
  -y, --yes                          Automatically respond yes to all confirmation prompts
      --as-user=<value>              Provide an ID for a user
      --bulk-file-path=<value>       File path to bulk .csv or .json objects
      --content-modified-at=<value>  The last modification date of the file version. Use a timestamp or shorthand syntax
                                     0t, like 5w for 5 weeks
      --csv                          Output formatted CSV
      --fields=<value>               Comma separated list of fields to show
      --json                         Output formatted JSON
      --no-color                     Turn off colors for logging
      --save-to-file-path=<value>    Override default file path to save report

DESCRIPTION
  Upload a new version of a file

EXAMPLES
  $ box files:versions:upload 11111 /path/to/file.pdf
```

_See code: [src/commands/files/versions/upload.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/versions/upload.js)_

## `box files:zip NAME`

Create a zip of multiple files and folders and download it

```
USAGE
  $ box files:zip NAME --item <value>... [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--destination
    <value>] [--create-path] [--overwrite]

ARGUMENTS
  NAME  Name of the zip to be created and downloaded

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
      --destination=<value>        The destination folder to write the zip file to
      --fields=<value>             Comma separated list of fields to show
      --item=<value>...            (required) Files or folders to be part of zip in the form type:ID (i.e. file:1374652)
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --[no-]overwrite             Overwrite a zip file if it already exists
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Create a zip of multiple files and folders and download it

EXAMPLES
  $ box files:zip sample_file.zip --item=file:12421 --item=folder:48291
```

_See code: [src/commands/files/zip.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/files/zip.js)_
