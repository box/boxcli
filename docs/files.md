`box files`
===========

Manage files

* [`box files:collaborations ID`](#box-filescollaborations-id)
* [`box files:collaborations:add ID`](#box-filescollaborationsadd-id)
* [`box files:comments ID`](#box-filescomments-id)
* [`box files:copy ID PARENTID`](#box-filescopy-id-parentid)
* [`box files:delete ID`](#box-filesdelete-id)
* [`box files:download ID`](#box-filesdownload-id)
* [`box files:get ID`](#box-filesget-id)
* [`box files:lock ID`](#box-fileslock-id)
* [`box files:metadata ID`](#box-filesmetadata-id)
* [`box files:metadata:add ID`](#box-filesmetadataadd-id)
* [`box files:metadata:get ID`](#box-filesmetadataget-id)
* [`box files:metadata:remove ID`](#box-filesmetadataremove-id)
* [`box files:metadata:set ID`](#box-filesmetadataset-id)
* [`box files:metadata:update ID`](#box-filesmetadataupdate-id)
* [`box files:move ID PARENTID`](#box-filesmove-id-parentid)
* [`box files:rename ID NAME`](#box-filesrename-id-name)
* [`box files:share ID`](#box-filesshare-id)
* [`box files:tasks ID`](#box-filestasks-id)
* [`box files:unlock ID`](#box-filesunlock-id)
* [`box files:unshare ID`](#box-filesunshare-id)
* [`box files:update ID`](#box-filesupdate-id)
* [`box files:upload PATH`](#box-filesupload-path)
* [`box files:versions FILEID`](#box-filesversions-fileid)
* [`box files:versions:delete FILEID FILEVERSIONID`](#box-filesversionsdelete-fileid-fileversionid)
* [`box files:versions:download FILEID FILEVERSIONID`](#box-filesversionsdownload-fileid-fileversionid)
* [`box files:versions:promote FILEID FILEVERSIONID`](#box-filesversionspromote-fileid-fileversionid)
* [`box files:versions:upload FILEID PATH`](#box-filesversionsupload-fileid-path)
* [`box files:zip NAME`](#box-fileszip-name)

## `box files:collaborations ID`

List all collaborations on a file

```
USAGE
  $ box files:collaborations ID

ARGUMENTS
  ID  ID of the file to get collaborations for

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

ALIASES
  $ box files:collaborations:list

EXAMPLE
  box files:collaborations 11111
```

_See code: [src/commands/files/collaborations/index.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/collaborations/index.js)_

## `box files:collaborations:add ID`

Create a collaboration for a file

```
USAGE
  $ box files:collaborations:add ID

ARGUMENTS
  ID  ID of the file to add a collaboration to

OPTIONS
  -h, --help                                                                               Show CLI help

  -q, --quiet                                                                              Suppress any non-error output
                                                                                           to stderr

  -r, --role=editor|viewer|previewer|uploader|previewer_uploader|viewer_uploader|co-owner  An option to manually enter
                                                                                           the role

  -s, --save                                                                               Save report to default
                                                                                           reports folder on disk

  -t, --token=token                                                                        Provide a token to perform
                                                                                           this call

  -v, --verbose                                                                            Show verbose output, which
                                                                                           can be helpful for debugging

  -y, --yes                                                                                Automatically respond yes to
                                                                                           all confirmation prompts

  --as-user=as-user                                                                        Provide an ID for a user

  --bulk-file-path=bulk-file-path                                                          File path to bulk .csv or
                                                                                           .json objects

  --[no-]can-view-path                                                                     Whether view path
                                                                                           collaboration feature is
                                                                                           enabled or not

  --csv                                                                                    Output formatted CSV

  --fields=fields                                                                          Comma separated list of
                                                                                           fields to show

  --group-id=group-id                                                                      Id for group to collaborate

  --id-only                                                                                Return only an ID to output
                                                                                           from this command

  --json                                                                                   Output formatted JSON

  --login=login                                                                            Login for user to collaborate

  --no-color                                                                               Turn off colors for logging

  --[no-]notify                                                                            All users will receive email
                                                                                           notification of the
                                                                                           collaboration

  --save-to-file-path=save-to-file-path                                                    Override default file path to
                                                                                           save report

  --user-id=user-id                                                                        Id for user to collaborate

EXAMPLE
  box files:collaborations:add 11111 --role editor --user-id 22222
```

_See code: [src/commands/files/collaborations/add.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/collaborations/add.js)_

## `box files:comments ID`

List all comments on a file

```
USAGE
  $ box files:comments ID

ARGUMENTS
  ID  ID of the file to get comments for

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

ALIASES
  $ box comments:list

EXAMPLE
  box files:comments 11111
```

_See code: [src/commands/files/comments.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/comments.js)_

## `box files:copy ID PARENTID`

Copy a file to a different folder

```
USAGE
  $ box files:copy ID PARENTID

ARGUMENTS
  ID        ID of the file to copy
  PARENTID  ID of the new parent folder to copy the file into

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
  --id-only                              Output only the ID of the file copy
  --json                                 Output formatted JSON
  --name=name                            New name for the file
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --version=version                      File version ID if you want to copy a specific file version

EXAMPLE
  box files:copy 11111 22222
```

_See code: [src/commands/files/copy.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/copy.js)_

## `box files:delete ID`

Delete a file

```
USAGE
  $ box files:delete ID

ARGUMENTS
  ID  ID of the file to delete

OPTIONS
  -f, --force                            Permanently delete the item, bypassing the trash
  -h, --help                             Show CLI help
  -q, --quiet                            Suppress any non-error output to stderr
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --etag=etag                            Only delete if etag value matches
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

EXAMPLE
  box files:delete 11111
```

_See code: [src/commands/files/delete.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/delete.js)_

## `box files:download ID`

Download a file

```
USAGE
  $ box files:download ID

ARGUMENTS
  ID  ID of the file to download

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
  --destination=destination              The destination folder to write the file to
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --version=version                      File version ID of the specific file version to download

EXAMPLE
  box files:download 11111 --destination /path/to/destinationFolder
```

_See code: [src/commands/files/download.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/download.js)_

## `box files:get ID`

Get information about a file

```
USAGE
  $ box files:get ID

ARGUMENTS
  ID  ID of the file to get

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
  box files:get 11111
```

_See code: [src/commands/files/get.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/get.js)_

## `box files:lock ID`

Lock a file

```
USAGE
  $ box files:lock ID

ARGUMENTS
  ID  ID of file to lock

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

  --expires=expires                      Make the lock expire from a timespan set from now. Use s for seconds, m for
                                         minutes, h for hours, d for days, w for weeks, M for months. For example, 30
                                         seconds is 30s

  --fields=fields                        Comma separated list of fields to show

  --json                                 Output formatted JSON

  --no-color                             Turn off colors for logging

  --[no-]prevent-download                Prevent download of locked file

  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box files:update-lock

EXAMPLE
  box files:lock 11111
```

_See code: [src/commands/files/lock.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/lock.js)_

## `box files:metadata ID`

Get all metadata on a file

```
USAGE
  $ box files:metadata ID

ARGUMENTS
  ID  Id of the file

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

ALIASES
  $ box files:metadata:get-all

EXAMPLE
  box files:metadata 11111
```

_See code: [src/commands/files/metadata/index.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/metadata/index.js)_

## `box files:metadata:add ID`

Add metadata to a file

```
USAGE
  $ box files:metadata:add ID

ARGUMENTS
  ID  ID of the file to add metadata to

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

  --data=data                            (required) Metadata key and value, in the form "key=value".  Note: For float
                                         type, use "#" at the beginning of digits: key2=#1234.50

  --fields=fields                        Comma separated list of fields to show

  --json                                 Output formatted JSON

  --no-color                             Turn off colors for logging

  --save-to-file-path=save-to-file-path  Override default file path to save report

  --scope=scope                          [default: enterprise] The scope of the metadata template to use

  --template-key=template-key            (required) The key of the metadata template to use

ALIASES
  $ box files:metadata:create

EXAMPLE
  box files:metadata:add 11111 --template-key employeeRecord --data "name=John Doe" --data department=Sales
```

_See code: [src/commands/files/metadata/add.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/metadata/add.js)_

## `box files:metadata:get ID`

Get information about a metadata object

```
USAGE
  $ box files:metadata:get ID

ARGUMENTS
  ID  ID of the file to get metadata on

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
  --scope=scope                          [default: enterprise] The scope of the metadata template to retrieve
  --template-key=template-key            (required) The key of the metadata template to retrieve

EXAMPLE
  box files:metadata:get 11111 --template-key employeeRecord
```

_See code: [src/commands/files/metadata/get.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/metadata/get.js)_

## `box files:metadata:remove ID`

Delete metadata from a file

```
USAGE
  $ box files:metadata:remove ID

ARGUMENTS
  ID  ID of the file to remove metadata from

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
  --scope=scope                          [default: enterprise] The scope of the metadata template to remove
  --template-key=template-key            (required) The key of the metadata template to remove

ALIASES
  $ box files:metadata:delete

EXAMPLE
  box files:metadata:remove 11111 --scope global --template-key properties
```

_See code: [src/commands/files/metadata/remove.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/metadata/remove.js)_

## `box files:metadata:set ID`

Set metadata on a file

```
USAGE
  $ box files:metadata:set ID

ARGUMENTS
  ID  ID of the file to add metadata to

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

  --data=data                            (required) Metadata key and value, in the form "key=value".  Note: For float
                                         type, use "#" at the beginning of digits: key2=#1234.50

  --fields=fields                        Comma separated list of fields to show

  --json                                 Output formatted JSON

  --no-color                             Turn off colors for logging

  --save-to-file-path=save-to-file-path  Override default file path to save report

  --scope=scope                          [default: enterprise] The scope of the metadata template to use

  --template-key=template-key            (required) The key of the metadata template to use

EXAMPLE
  box files:metadata:set 11111 --template-key employeeRecord --data "name=John Doe" --data department=Sales
```

_See code: [src/commands/files/metadata/set.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/metadata/set.js)_

## `box files:metadata:update ID`

Update the metadata attached to a file

```
USAGE
  $ box files:metadata:update ID

ARGUMENTS
  ID  ID of the file to update metadata on

OPTIONS
  -a, --add=add                          Add a key to the metadata document; must be in the form key=value

  -c, --copy=copy                        Copy a metadata value to another key; must be in the form
                                         sourceKey>destinationKey

  -h, --help                             Show CLI help

  -m, --move=move                        Move a metadata value from one key to another; must be in the form
                                         sourceKey>destinationKey

  -q, --quiet                            Suppress any non-error output to stderr

  -s, --save                             Save report to default reports folder on disk

  -t, --test=test                        Test that a metadata key contains a specific value; must be in the form
                                         key=value

  -t, --token=token                      Provide a token to perform this call

  -v, --verbose                          Show verbose output, which can be helpful for debugging

  -y, --yes                              Automatically respond yes to all confirmation prompts

  --as-user=as-user                      Provide an ID for a user

  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects

  --csv                                  Output formatted CSV

  --fields=fields                        Comma separated list of fields to show

  --json                                 Output formatted JSON

  --no-color                             Turn off colors for logging

  --remove=remove                        Remove a key from the metadata document

  --replace=replace                      Replace the value of an existing metadata key; must be in the form key=value

  --save-to-file-path=save-to-file-path  Override default file path to save report

  --scope=scope                          [default: enterprise] The scope of the metadata template to update against

  --template-key=template-key            (required) The key of the metadata template to update against

EXAMPLE
  box files:metadata:update 11111 --template-key employeeRecord --replace department=Finance
```

_See code: [src/commands/files/metadata/update.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/metadata/update.js)_

## `box files:move ID PARENTID`

Move a file to a different folder

```
USAGE
  $ box files:move ID PARENTID

ARGUMENTS
  ID        ID of the file to move
  PARENTID  ID of the new parent folder to move the file into

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
  --etag=etag                            Only move if etag value matches
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

EXAMPLE
  box files:move 11111 22222
```

_See code: [src/commands/files/move.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/move.js)_

## `box files:rename ID NAME`

Rename a file

```
USAGE
  $ box files:rename ID NAME

ARGUMENTS
  ID    ID of file to rename
  NAME  New name of file

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
  --description=description              Change the file description
  --etag=etag                            Only rename if etag value matches
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

EXAMPLE
  box files:rename 11111 "New File Name.pdf"
```

_See code: [src/commands/files/rename.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/rename.js)_

## `box files:share ID`

Create a shared link for a file

```
USAGE
  $ box files:share ID

ARGUMENTS
  ID  ID of the file to share

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
  $ box files:shared-links:create
  $ box files:shared-links:update

EXAMPLE
  box files:share 11111 --access company
```

_See code: [src/commands/files/share.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/share.js)_

## `box files:tasks ID`

List all tasks on this file

```
USAGE
  $ box files:tasks ID

ARGUMENTS
  ID  ID of file on which to retrieve tasks

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

ALIASES
  $ box files:tasks:list

EXAMPLE
  box files:tasks 11111
```

_See code: [src/commands/files/tasks/index.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/tasks/index.js)_

## `box files:unlock ID`

Unlock a file

```
USAGE
  $ box files:unlock ID

ARGUMENTS
  ID  Id of file to unlock

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
  box files:unlock 11111
```

_See code: [src/commands/files/unlock.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/unlock.js)_

## `box files:unshare ID`

Delete a shared link for a file

```
USAGE
  $ box files:unshare ID

ARGUMENTS
  ID  ID of the file to unshare

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

ALIASES
  $ box files:shared-links:delete

EXAMPLE
  box files:unshare 11111
```

_See code: [src/commands/files/unshare.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/unshare.js)_

## `box files:update ID`

Update a file record

```
USAGE
  $ box files:update ID

ARGUMENTS
  ID  ID of the file to update

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
  --description=description              New description for the file
  --etag=etag                            Only apply updates if the ETag value matches
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --name=name                            New name for the file
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --tags=tags                            Set tags on the file, specified as comma-separated tags

EXAMPLE
  box files:update 11111 --name "New File Name.pdf"
```

_See code: [src/commands/files/update.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/update.js)_

## `box files:upload PATH`

Upload a file

```
USAGE
  $ box files:upload PATH

ARGUMENTS
  PATH  Path to the file to be uploaded

OPTIONS
  -h, --help                                 Show CLI help
  -n, --name=name                            Provide different name for uploaded file

  -p, --parent-id=parent-id                  [default: 0] ID of the parent folder to upload the file to; defaults to the
                                             root folder

  -q, --quiet                                Suppress any non-error output to stderr

  -s, --save                                 Save report to default reports folder on disk

  -t, --token=token                          Provide a token to perform this call

  -v, --verbose                              Show verbose output, which can be helpful for debugging

  -y, --yes                                  Automatically respond yes to all confirmation prompts

  --as-user=as-user                          Provide an ID for a user

  --bulk-file-path=bulk-file-path            File path to bulk .csv or .json objects

  --content-created-at=content-created-at    The creation date of the file content. Use a timestamp or shorthand syntax
                                             0t, like 5w for 5 weeks

  --content-modified-at=content-modified-at  The modification date of the file content. Use a timestamp or shorthand
                                             syntax 0t, like 5w for 5 weeks

  --csv                                      Output formatted CSV

  --fields=fields                            Comma separated list of fields to show

  --id-only                                  Return only an ID to output from this command

  --json                                     Output formatted JSON

  --no-color                                 Turn off colors for logging

  --save-to-file-path=save-to-file-path      Override default file path to save report

EXAMPLE
  box files:upload /path/to/file.pdf --parent-id 22222
```

_See code: [src/commands/files/upload.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/upload.js)_

## `box files:versions FILEID`

Get a list of file versions

```
USAGE
  $ box files:versions FILEID

ARGUMENTS
  FILEID  ID of file to get versions for

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

ALIASES
  $ box files:versions:list

EXAMPLE
  box files:versions 11111
```

_See code: [src/commands/files/versions/index.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/versions/index.js)_

## `box files:versions:delete FILEID FILEVERSIONID`

Delete a file version

```
USAGE
  $ box files:versions:delete FILEID FILEVERSIONID

ARGUMENTS
  FILEID         ID of the file to get versions for
  FILEVERSIONID  ID of the file version to delete

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
  --etag=etag                            Only delete if etag value matches
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

EXAMPLE
  box files:versions:delete 11111 55555
```

_See code: [src/commands/files/versions/delete.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/versions/delete.js)_

## `box files:versions:download FILEID FILEVERSIONID`

Download a specific version of a file

```
USAGE
  $ box files:versions:download FILEID FILEVERSIONID

ARGUMENTS
  FILEID         ID of the file to download
  FILEVERSIONID  ID of file version to download

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
  --destination=destination              The destination folder to write the file to
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

EXAMPLE
  box files:versions:download 11111 55555
```

_See code: [src/commands/files/versions/download.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/versions/download.js)_

## `box files:versions:promote FILEID FILEVERSIONID`

Promote a file version

```
USAGE
  $ box files:versions:promote FILEID FILEVERSIONID

ARGUMENTS
  FILEID         ID of the file to get versions for
  FILEVERSIONID  ID of the file version to promote

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
  box files:versions:promote 11111 55555
```

_See code: [src/commands/files/versions/promote.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/versions/promote.js)_

## `box files:versions:upload FILEID PATH`

Upload a new version of a file

```
USAGE
  $ box files:versions:upload FILEID PATH

ARGUMENTS
  FILEID  ID of the file to upload a new version of
  PATH    Local path to the file to upload

OPTIONS
  -h, --help                                 Show CLI help
  -n, --name=name                            Provide different name for uploaded file
  -q, --quiet                                Suppress any non-error output to stderr
  -s, --save                                 Save report to default reports folder on disk
  -t, --token=token                          Provide a token to perform this call
  -v, --verbose                              Show verbose output, which can be helpful for debugging
  -y, --yes                                  Automatically respond yes to all confirmation prompts
  --as-user=as-user                          Provide an ID for a user
  --bulk-file-path=bulk-file-path            File path to bulk .csv or .json objects

  --content-modified-at=content-modified-at  The last modification date of the file version. Use a timestamp or
                                             shorthand syntax 0t, like 5w for 5 weeks

  --csv                                      Output formatted CSV

  --fields=fields                            Comma separated list of fields to show

  --json                                     Output formatted JSON

  --no-color                                 Turn off colors for logging

  --save-to-file-path=save-to-file-path      Override default file path to save report

EXAMPLE
  box files:versions:upload 11111 /path/to/file.pdf
```

_See code: [src/commands/files/versions/upload.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/versions/upload.js)_

## `box files:zip NAME`

Create a zip of multiple files and folders and download it

```
USAGE
  $ box files:zip NAME

ARGUMENTS
  NAME  Name of the zip to be created and downloaded

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
  --destination=destination              The destination folder to write the zip file to
  --fields=fields                        Comma separated list of fields to show

  --item=item                            (required) Files or folders to be part of zip in the form type:ID (i.e.
                                         file:1374652)

  --json                                 Output formatted JSON

  --no-color                             Turn off colors for logging

  --save-to-file-path=save-to-file-path  Override default file path to save report

EXAMPLE
  box files:zip sample_file.zip --item=file:12421 --item=folder:48291
```

_See code: [src/commands/files/zip.js](https://github.com/box/boxcli/blob/v3.1.0/src/commands/files/zip.js)_
