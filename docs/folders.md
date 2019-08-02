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

<!-- sample get_folders_id_collaborations -->
```
USAGE
  $ box folders:collaborations ID

ARGUMENTS
  ID  ID of the folder to get the collaborations on

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
  $ box folders:collaborations:list
```

_See code: [src/commands/folders/collaborations/index.js](https://github.com/box/boxcli/blob/v2.3.0/src/commands/folders/collaborations/index.js)_

## `box folders:collaborations:add ID`

Create a collaboration for a folder

<!-- sample post_collaborations create_folder_collaboration -->
```
USAGE
  $ box folders:collaborations:add ID

ARGUMENTS
  ID  ID of the folder to add a collaboration to

OPTIONS
  -h, --help                                                                               Show CLI help

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
```

_See code: [src/commands/folders/collaborations/add.js](https://github.com/box/boxcli/blob/v2.3.0/src/commands/folders/collaborations/add.js)_

## `box folders:copy ID PARENTID`

Copy a folder to a different folder

<!-- sample post_folders_id_copy -->
```
USAGE
  $ box folders:copy ID PARENTID

ARGUMENTS
  ID        ID of the folder to copy
  PARENTID  ID of the new parent folder to copy the folder into

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
  --id-only                              Return only an ID to output from this command
  --json                                 Output formatted JSON
  --name=name                            An optional new name for the folder
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/folders/copy.js](https://github.com/box/boxcli/blob/v2.3.0/src/commands/folders/copy.js)_

## `box folders:create PARENTID NAME`

Create a new folder

<!-- sample post_folders -->
```
USAGE
  $ box folders:create PARENTID NAME

ARGUMENTS
  PARENTID  ID of parent folder to add new folder to, use '0' for the root folder
  NAME      Name of new folder

OPTIONS
  -h, --help                             Show CLI help
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
```

_See code: [src/commands/folders/create.js](https://github.com/box/boxcli/blob/v2.3.0/src/commands/folders/create.js)_

## `box folders:delete ID`

Delete a folder

<!-- sample delete_folders_id -->
```
USAGE
  $ box folders:delete ID

ARGUMENTS
  ID  ID of the folder to delete

OPTIONS
  -f, --force                            Permanently delete the folder, bypassing the trash
  -h, --help                             Show CLI help
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
```

_See code: [src/commands/folders/delete.js](https://github.com/box/boxcli/blob/v2.3.0/src/commands/folders/delete.js)_

## `box folders:download ID`

Download a folder

<!-- sample get_files_id_content download_folder -->
```
USAGE
  $ box folders:download ID

ARGUMENTS
  ID  ID of the folder to download

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --depth=depth                          Number of levels deep to recurse when downloading the folder tree
  --destination=destination              The destination folder to download the Box folder into
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --zip                                  Download the folder into a single .zip archive
```

_See code: [src/commands/folders/download.js](https://github.com/box/boxcli/blob/v2.3.0/src/commands/folders/download.js)_

## `box folders:get ID`

Get information about a folder

<!-- sample get_folders_id -->
```
USAGE
  $ box folders:get ID

ARGUMENTS
  ID  ID of folder to get; use 0 for the root folder

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

_See code: [src/commands/folders/get.js](https://github.com/box/boxcli/blob/v2.3.0/src/commands/folders/get.js)_

## `box folders:items ID`

List items in a folder

<!-- sample get_folders_id_items -->
```
USAGE
  $ box folders:items ID

ARGUMENTS
  ID  ID of the folder to get the items in, use 0 for the root folder

OPTIONS
  -h, --help                             Show CLI help
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
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --sort=id|name|date                    The parameter to sort returned items

ALIASES
  $ box folders:list-items
```

_See code: [src/commands/folders/items.js](https://github.com/box/boxcli/blob/v2.3.0/src/commands/folders/items.js)_

## `box folders:metadata ID`

Get all metadata on a folder

<!-- sample get_folders_id_metadata -->
```
USAGE
  $ box folders:metadata ID

ARGUMENTS
  ID  ID of the folder to get all metadata on

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
  $ box folders:metadata:get-all
```

_See code: [src/commands/folders/metadata/index.js](https://github.com/box/boxcli/blob/v2.3.0/src/commands/folders/metadata/index.js)_

## `box folders:metadata:add ID`

Add metadata to a folder

<!-- sample post_folders_id_metadata_id_id -->
```
USAGE
  $ box folders:metadata:add ID

ARGUMENTS
  ID  ID of the folder to add metadata to

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV

  --data=data                            (required) Metadata key and value, in the form "key=value".  Note: For float
                                         type, use "f" on end of digits: key2=1234.50f

  --fields=fields                        Comma separated list of fields to show

  --json                                 Output formatted JSON

  --no-color                             Turn off colors for logging

  --save-to-file-path=save-to-file-path  Override default file path to save report

  --scope=scope                          [default: enterprise] The scope of the metadata template to use

  --template-key=template-key            (required) The key of the metadata template to use

ALIASES
  $ box folders:metadata:create
```

_See code: [src/commands/folders/metadata/add.js](https://github.com/box/boxcli/blob/v2.3.0/src/commands/folders/metadata/add.js)_

## `box folders:metadata:get ID`

Get information about a metadata object

<!-- sample get_folders_id_metadata_id_id -->
```
USAGE
  $ box folders:metadata:get ID

ARGUMENTS
  ID  ID of the folder to get metadata on

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
  --scope=scope                          [default: enterprise] The scope of the metadata template to retrieve
  --template-key=template-key            (required) The key of the metadata template to retrieve
```

_See code: [src/commands/folders/metadata/get.js](https://github.com/box/boxcli/blob/v2.3.0/src/commands/folders/metadata/get.js)_

## `box folders:metadata:remove ID`

Delete metadata from a folder

<!-- sample delete_folders_id_metadata_id_id -->
```
USAGE
  $ box folders:metadata:remove ID

ARGUMENTS
  ID  ID of the folder to remove metadata from

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
  --scope=scope                          [default: enterprise] The scope of the metadata template to remove
  --template-key=template-key            (required) The key of the metadata template to remove

ALIASES
  $ box folders:metadata:delete
```

_See code: [src/commands/folders/metadata/remove.js](https://github.com/box/boxcli/blob/v2.3.0/src/commands/folders/metadata/remove.js)_

## `box folders:metadata:set ID`

Set metadata on a folder

<!-- sample post_folders_id_metadata_id_id set_field -->
```
USAGE
  $ box folders:metadata:set ID

ARGUMENTS
  ID  ID of the folder to add metadata to

OPTIONS
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV

  --data=data                            (required) Metadata key and value, in the form "key=value".  Note: For float
                                         type, use "f" on end of digits: key2=1234.50f

  --fields=fields                        Comma separated list of fields to show

  --json                                 Output formatted JSON

  --no-color                             Turn off colors for logging

  --save-to-file-path=save-to-file-path  Override default file path to save report

  --scope=scope                          [default: enterprise] The scope of the metadata template to use

  --template-key=template-key            (required) The key of the metadata template to use
```

_See code: [src/commands/folders/metadata/set.js](https://github.com/box/boxcli/blob/v2.3.0/src/commands/folders/metadata/set.js)_

## `box folders:metadata:update ID`

Update the metadata attached to a folder

<!-- sample put_folders_id_metadata_id_id -->
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
```

_See code: [src/commands/folders/metadata/update.js](https://github.com/box/boxcli/blob/v2.3.0/src/commands/folders/metadata/update.js)_

## `box folders:move ID PARENTID`

Move a folder to a different folder

<!-- sample put_folders_id move -->
```
USAGE
  $ box folders:move ID PARENTID

ARGUMENTS
  ID        ID of folder to copy
  PARENTID  ID of the new parent folder to move the folder into

OPTIONS
  -h, --help                             Show CLI help
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
```

_See code: [src/commands/folders/move.js](https://github.com/box/boxcli/blob/v2.3.0/src/commands/folders/move.js)_

## `box folders:rename ID NAME`

Rename a folder

<!-- sample put_folders_id rename -->
```
USAGE
  $ box folders:rename ID NAME

ARGUMENTS
  ID    ID of the folder to rename
  NAME  New name for the folder

OPTIONS
  -h, --help                             Show CLI help
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
```

_See code: [src/commands/folders/rename.js](https://github.com/box/boxcli/blob/v2.3.0/src/commands/folders/rename.js)_

## `box folders:share ID`

Create a shared link for a folder

<!-- sample put_folders_id create_shared_link -->
```
USAGE
  $ box folders:share ID

ARGUMENTS
  ID  ID of the folder to share

OPTIONS
  -h, --help                             Show CLI help
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
```

_See code: [src/commands/folders/share.js](https://github.com/box/boxcli/blob/v2.3.0/src/commands/folders/share.js)_

## `box folders:unshare ID`

Delete a shared link for a folder

<!-- sample put_folders_id remove_shared_link -->
```
USAGE
  $ box folders:unshare ID

ARGUMENTS
  ID  ID of the folder to unshare

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
  $ box folders:shared-links:delete
```

_See code: [src/commands/folders/unshare.js](https://github.com/box/boxcli/blob/v2.3.0/src/commands/folders/unshare.js)_

## `box folders:update ID`

Update a folder

<!-- sample put_folders_id -->
```
USAGE
  $ box folders:update ID

ARGUMENTS
  ID  ID of the folder to update

OPTIONS
  -h, --help                                Show CLI help
  -s, --save                                Save report to default reports folder on disk
  -t, --token=token                         Provide a token to perform this call
  -v, --verbose                             Show verbose output, which can be helpful for debugging
  -y, --yes                                 Automatically respond yes to all confirmation prompts
  --as-user=as-user                         Provide an ID for a user
  --bulk-file-path=bulk-file-path           File path to bulk .csv or .json objects
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
```

_See code: [src/commands/folders/update.js](https://github.com/box/boxcli/blob/v2.3.0/src/commands/folders/update.js)_

## `box folders:upload PATH`

Upload a folder

<!-- sample put_files_content upload_folder -->
```
USAGE
  $ box folders:upload PATH

ARGUMENTS
  PATH  Local path to the folder to upload

OPTIONS
  -h, --help                             Show CLI help
  -p, --parent-folder=parent-folder      [default: 0] Folder to upload this folder into; defaults to the root folder
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
```

_See code: [src/commands/folders/upload.js](https://github.com/box/boxcli/blob/v2.3.0/src/commands/folders/upload.js)_
