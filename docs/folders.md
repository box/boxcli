`box folders`
=============

Manage folders

* [`box folders:collaborations ID`](#box-folderscollaborations-id)
* [`box folders:collaborations:add ID`](#box-folderscollaborationsadd-id)
* [`box folders:copy ID PARENTID`](#box-folderscopy-id-parentid)
* [`box folders:create PARENTID NAME`](#box-folderscreate-parentid-name)
* [`box folders:delete ID`](#box-foldersdelete-id)
* [`box folders:download ID`](#box-foldersdownload-id)
* [`box folders:get ID`](#box-foldersget-id)
* [`box folders:items ID`](#box-foldersitems-id)
* [`box folders:locks ID`](#box-folderslocks-id)
* [`box folders:locks:create ID`](#box-folderslockscreate-id)
* [`box folders:locks:delete ID`](#box-folderslocksdelete-id)
* [`box folders:metadata ID`](#box-foldersmetadata-id)
* [`box folders:metadata:add ID`](#box-foldersmetadataadd-id)
* [`box folders:metadata:get ID`](#box-foldersmetadataget-id)
* [`box folders:metadata:remove ID`](#box-foldersmetadataremove-id)
* [`box folders:metadata:set ID`](#box-foldersmetadataset-id)
* [`box folders:metadata:update ID`](#box-foldersmetadataupdate-id)
* [`box folders:move ID PARENTID`](#box-foldersmove-id-parentid)
* [`box folders:rename ID NAME`](#box-foldersrename-id-name)
* [`box folders:share ID`](#box-foldersshare-id)
* [`box folders:unshare ID`](#box-foldersunshare-id)
* [`box folders:update ID`](#box-foldersupdate-id)
* [`box folders:upload PATH`](#box-foldersupload-path)

## `box folders:collaborations ID`

List all collaborations on a folder

```
USAGE
  $ box folders:collaborations ID

ARGUMENTS
  ID  ID of the folder to get the collaborations on

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
  $ box folders:collaborations:list

EXAMPLE
  box folders:collaborations 22222
```

_See code: [src/commands/folders/collaborations/index.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/folders/collaborations/index.js)_

## `box folders:collaborations:add ID`

Create a collaboration for a folder

```
USAGE
  $ box folders:collaborations:add ID

ARGUMENTS
  ID  ID of the folder to add a collaboration to

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
  box folders:collaborations:add 22222 --role editor --user-id 33333
```

_See code: [src/commands/folders/collaborations/add.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/folders/collaborations/add.js)_

## `box folders:copy ID PARENTID`

Copy a folder to a different folder

```
USAGE
  $ box folders:copy ID PARENTID

ARGUMENTS
  ID        ID of the folder to copy
  PARENTID  ID of the new parent folder to copy the folder into

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
  --id-only                              Return only an ID to output from this command
  --json                                 Output formatted JSON
  --name=name                            An optional new name for the folder
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

EXAMPLE
  box folders:copy 22222 44444
```

_See code: [src/commands/folders/copy.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/folders/copy.js)_

## `box folders:create PARENTID NAME`

Create a new folder

```
USAGE
  $ box folders:create PARENTID NAME

ARGUMENTS
  PARENTID  ID of parent folder to add new folder to, use '0' for the root folder
  NAME      Name of new folder

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
  --description=description              A description for folder <DESCRIPTION>
  --fields=fields                        Comma separated list of fields to show
  --id-only                              Return only an ID to output from this command
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

EXAMPLE
  box folders:create 22222 "New Subfolder"
```

_See code: [src/commands/folders/create.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/folders/create.js)_

## `box folders:delete ID`

Delete a folder

```
USAGE
  $ box folders:delete ID

ARGUMENTS
  ID  ID of the folder to delete

OPTIONS
  -f, --force                            Permanently delete the folder, bypassing the trash
  -h, --help                             Show CLI help
  -q, --quiet                            Suppress any non-error output to stderr
  -r, --recursive                        Delete the folder, even if it still has items in it
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
  box folders:delete 22222
```

_See code: [src/commands/folders/delete.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/folders/delete.js)_

## `box folders:download ID`

Download a folder

```
USAGE
  $ box folders:download ID

ARGUMENTS
  ID  ID of the folder to download

OPTIONS
  -h, --help                             Show CLI help
  -q, --quiet                            Suppress any non-error output to stderr
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --[no-]create-path                     Recursively creates a path to a directory if it does not exist
  --csv                                  Output formatted CSV
  --depth=depth                          Number of levels deep to recurse when downloading the folder tree
  --destination=destination              The destination folder to download the Box folder into
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON

  --max-depth=(root|max)                 [default: max] Maximum depth to verify if files and folders are already exists, only used with 
                                         --no-overwrite

  --no-color                             Turn off colors for logging

  --[no-]overwrite                       [default: true] Overwrite the folder if it already exists.

  --save-to-file-path=save-to-file-path  Override default file path to save report

  --zip                                  Download the folder into a single .zip archive

EXAMPLE
  box folders:download 22222
```

_See code: [src/commands/folders/download.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/folders/download.js)_

## `box folders:get ID`

Get information about a folder

```
USAGE
  $ box folders:get ID

ARGUMENTS
  ID  ID of folder to get; use 0 for the root folder

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
  box folders:get 22222
```

_See code: [src/commands/folders/get.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/folders/get.js)_

## `box folders:items ID`

List items in a folder

```
USAGE
  $ box folders:items ID

ARGUMENTS
  ID  ID of the folder to get the items in, use 0 for the root folder

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
  --direction=ASC|DESC                   The direction to order returned items
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON

  --max-items=max-items                  A value that indicates the maximum number of results to return. This only
                                         specifies a maximum boundary and will not guarantee the minimum number of
                                         results returned. When the max-items (x) is greater than 1000, then the maximum
                                         ceil(x/1000) requests will be made.

  --no-color                             Turn off colors for logging

  --save-to-file-path=save-to-file-path  Override default file path to save report

  --sort=id|name|date                    The parameter to sort returned items

ALIASES
  $ box folders:list-items

EXAMPLE
  box folders:items 22222
```

_See code: [src/commands/folders/items.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/folders/items.js)_

## `box folders:locks ID`

List all locks on a folder

```
USAGE
  $ box folders:locks ID

ARGUMENTS
  ID  ID of the folder to get the locks on

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
  $ box folders:locks:list

EXAMPLE
  box folders:locks 22222
```

_See code: [src/commands/folders/locks/index.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/folders/locks/index.js)_

## `box folders:locks:create ID`

Create a lock on a folder

```
USAGE
  $ box folders:locks:create ID

ARGUMENTS
  ID  ID of the folder to create a lock on

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
  box folders:locks:create 22222
```

_See code: [src/commands/folders/locks/create.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/folders/locks/create.js)_

## `box folders:locks:delete ID`

Delete a lock on a folder

```
USAGE
  $ box folders:locks:delete ID

ARGUMENTS
  ID  ID of the folder lock to delete

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
  box folders:locks:delete 22222
```

_See code: [src/commands/folders/locks/delete.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/folders/locks/delete.js)_

## `box folders:metadata ID`

Get all metadata on a folder

```
USAGE
  $ box folders:metadata ID

ARGUMENTS
  ID  ID of the folder to get all metadata on

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
  $ box folders:metadata:get-all

EXAMPLE
  box folders:metadata 22222
```

_See code: [src/commands/folders/metadata/index.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/folders/metadata/index.js)_

## `box folders:metadata:add ID`

Add metadata to a folder

```
USAGE
  $ box folders:metadata:add ID

ARGUMENTS
  ID  ID of the folder to add metadata to

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
  $ box folders:metadata:create

EXAMPLE
  box folders:metadata:add 22222 --template-key employeeRecord --data "name=John Doe" --data department=Sales
```

_See code: [src/commands/folders/metadata/add.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/folders/metadata/add.js)_

## `box folders:metadata:get ID`

Get information about a metadata object

```
USAGE
  $ box folders:metadata:get ID

ARGUMENTS
  ID  ID of the folder to get metadata on

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
  box folders:metadata:get 22222 --template-key employeeRecord
```

_See code: [src/commands/folders/metadata/get.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/folders/metadata/get.js)_

## `box folders:metadata:remove ID`

Delete metadata from a folder

```
USAGE
  $ box folders:metadata:remove ID

ARGUMENTS
  ID  ID of the folder to remove metadata from

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
  $ box folders:metadata:delete

EXAMPLE
  box folders:metadata:remove 22222 --scope global --template-key properties
```

_See code: [src/commands/folders/metadata/remove.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/folders/metadata/remove.js)_

## `box folders:metadata:set ID`

Set metadata on a folder

```
USAGE
  $ box folders:metadata:set ID

ARGUMENTS
  ID  ID of the folder to add metadata to

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
  box folders:metadata:set 22222 --template-key employeeRecord --data "name=John Doe" --data department=Sales
```

_See code: [src/commands/folders/metadata/set.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/folders/metadata/set.js)_

## `box folders:metadata:update ID`

Update the metadata attached to a folder

```
USAGE
  $ box folders:metadata:update ID

ARGUMENTS
  ID  ID of the folder to update metadata on

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
  box folders:metadata:update 22222 --template-key employeeRecord --replace department=Finance
```

_See code: [src/commands/folders/metadata/update.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/folders/metadata/update.js)_

## `box folders:move ID PARENTID`

Move a folder to a different folder

```
USAGE
  $ box folders:move ID PARENTID

ARGUMENTS
  ID        ID of folder to copy
  PARENTID  ID of the new parent folder to move the folder into

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
  box folders:move 22222 44444
```

_See code: [src/commands/folders/move.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/folders/move.js)_

## `box folders:rename ID NAME`

Rename a folder

```
USAGE
  $ box folders:rename ID NAME

ARGUMENTS
  ID    ID of the folder to rename
  NAME  New name for the folder

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
  --description=description              Change the folder description
  --etag=etag                            Only rename if etag value matches
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

EXAMPLE
  box folders:rename 22222 "New Folder Name"
```

_See code: [src/commands/folders/rename.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/folders/rename.js)_

## `box folders:share ID`

Create a shared link for a folder

```
USAGE
  $ box folders:share ID

ARGUMENTS
  ID  ID of the folder to share

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
  $ box folders:shared-links:create
  $ box folders:shared-links:update

EXAMPLE
  box folders:share 22222 --access company
```

_See code: [src/commands/folders/share.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/folders/share.js)_

## `box folders:unshare ID`

Delete a shared link for a folder

```
USAGE
  $ box folders:unshare ID

ARGUMENTS
  ID  ID of the folder to unshare

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
  $ box folders:shared-links:delete

EXAMPLE
  box folders:unshare 22222
```

_See code: [src/commands/folders/unshare.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/folders/unshare.js)_

## `box folders:update ID`

Update a folder

```
USAGE
  $ box folders:update ID

ARGUMENTS
  ID  ID of the folder to update

OPTIONS
  -h, --help                                Show CLI help
  -q, --quiet                               Suppress any non-error output to stderr
  -s, --save                                Save report to default reports folder on disk
  -t, --token=token                         Provide a token to perform this call
  -v, --verbose                             Show verbose output, which can be helpful for debugging
  -y, --yes                                 Automatically respond yes to all confirmation prompts
  --as-user=as-user                         Provide an ID for a user
  --bulk-file-path=bulk-file-path           File path to bulk .csv or .json objects

  --[no-]can-non-owners-invite              Specifies if users who are not the owner of the folder can invite new
                                            collaborators to the folder.

  --[no-]can-non-owners-view-collaborators  Restricts collaborators who are not the owner of this folder from viewing
                                            other collaborations on this folder.

  --csv                                     Output formatted CSV

  --description=description                 New description for folder

  --etag=etag                               Only apply updates if the etag value matches

  --fields=fields                           Comma separated list of fields to show

  --json                                    Output formatted JSON

  --name=name                               New name for folder

  --no-color                                Turn off colors for logging

  --[no-]restrict-collaboration             Restrict collaboration so only owners can invite new collaborators

  --[no-]restrict-to-enterprise             Restrict collaboration so only users in the folder owner's enterprise can be
                                            added

  --save-to-file-path=save-to-file-path     Override default file path to save report

  --[no-]sync                               Whether the folder is synced to desktop

  --tags=tags                               Comma seperated tags

  --upload-email-access=open|collaborators  Upload email access level

EXAMPLE
  box folders:update 22222 --name "New Folder Name"
```

_See code: [src/commands/folders/update.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/folders/update.js)_

## `box folders:upload PATH`

Upload a folder

```
USAGE
  $ box folders:upload PATH

ARGUMENTS
  PATH  Local path to the folder to upload

OPTIONS
  -h, --help                             Show CLI help
  -p, --parent-folder=parent-folder      [default: 0] Folder to upload this folder into; defaults to the root folder
  -q, --quiet                            Suppress any non-error output to stderr
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --folder-name=folder-name              Name to use for folder if not using local folder name
  --id-only                              Return only an ID to output from this command
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

EXAMPLE
  box folders:upload /path/to/folder
```

_See code: [src/commands/folders/upload.js](https://github.com/box/boxcli/blob/v3.9.2/src/commands/folders/upload.js)_
