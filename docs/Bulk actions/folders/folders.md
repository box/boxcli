`box folders`
=============

Manage folders

* [`box folders:create PARENTID NAME`](#box-folderscreate-parentid-name)
* [`box folders:metadata:add ID`](#box-foldersmetadataadd-id)
* [`box folders:update ID`](#box-foldersupdate-id)



## `box folders:create PARENTID NAME`

Create a new folder

```
USAGE
  $ box folders:create PARENTID NAME

ARGUMENTS
  PARENTID  ID of parent folder to add new folder to, use '0' for the root folder
  NAME      Name of new folder

EXAMPLE
  box folders:create --bulk-file-path path/to/csv/folders-create.csv
```

- _See documentation [folders.md](https://github.com/box/boxcli/blob/main/docs/folders.md#box-folderscreate-parentid-name)_
- _See example: [folders-create.csv](folders-create.csv)_


## `box folders:metadata:add ID`

Add metadata to a folder

```
USAGE
  $ box folders:metadata:add ID

ARGUMENTS
  ID  ID of the folder to add metadata to

ALIASES
  $ box folders:metadata:create

EXAMPLE
  box folders:metadata:add --bulk-file-path path/to/csv/folders-metadata-add.csv
```

- _See documentation [folders.md](https://github.com/box/boxcli/blob/main/docs/folders.md#box-foldersmetadataadd-id)_
- _See example: [folders-metadata-add.csv](folders-metadata-add.csv)_



## `box folders:update ID`

Update a folder

```
USAGE
  $ box folders:update ID

ARGUMENTS
  ID  ID of the folder to update


EXAMPLE
  box folders:update --bulk-file-path path/to/csv/folders-update.csv
```

- _See documentation [folders.md](https://github.com/box/boxcli/blob/main/docs/folders.md#box-foldersupdate-id)_
- _See example: [folders-update.csv](folders-update.csv)_
