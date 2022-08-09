`box files`
===========

Manage files

* [`box files:download ID`](#box-filesdownload-id)
* [`box files:update ID`](#box-filesupdate-id)
* [`box files:upload PATH`](#box-filesupload)

## `box files:download ID`

Download files

```
ARGUMENTS PER SEPARATED VALUE
  ID                ID of the file to download

EXAMPLE
  box files:download --bulk-file-path path/to/csv/file.csv --destination path/to/destination/folder
```
- _See documentation [files.md](https://github.com/box/boxcli/blob/main/docs/files.md#box-filesdownload-id)_
- _See example: [files-download.csv](files-download.csv)_


## `box files:update ID`

Update file records

```
USAGE
  $ box files:update ID

ARGUMENTS PER SEPARATED VALUE
  ID                ID of the file to update (*required*)
  Name              new name for each file
  Description       new description for each file 


EXAMPLE
  box files:update --bulk-file-path path/to/csv/file.csv
```


- _See documentation [files.md](https://github.com/box/boxcli/blob/main/docs/files.md#box-filesupdate-id)_
- _See example: [files-update.csv](files-update.csv)_

## `box files:upload PATH`

Upload files

```
ARGUMENTS PER SEPARATED VALUE
  PATH              Path to the file to be uploaded

EXAMPLE
  box files:upload --bulk-file-path path/to/csv/file.csv
```
- _See documentation [files.md](https://github.com/box/boxcli/blob/main/docs/files.md#box-filesupload-path)_
- _See example: [files-upload.csv](files-upload.csv)_
