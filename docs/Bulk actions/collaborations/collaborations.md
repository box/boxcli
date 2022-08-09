`box collaborations`
====================

Manage collaborations

* [`box collaborations:create ITEMID ITEMTYPE`](#box-collaborationscreate-itemid-itemtype)
* [`box collaborations:delete ID`](#box-collaborationsdelete-id)
* [`box collaborations:update ID`](#box-collaborationsupdate-id)

## `box collaborations:create ITEMID ITEMTYPE`

Collaborate users into existing files or folders

```
USAGE
  $ box collaborations:create ITEMID ITEMTYPE

ARGUMENTS
  ITEMID    The ID of the Box item to add the collaboration to
  ITEMTYPE  (file|folder) The type of the Box item to add the collaboration to
  ROLE      (editor|viewer|previewer|uploader|previewer_uploader|viewer_uploader|co-owner)
  LOGIN     Login for user to collaborate (for internal and external users)
  USER-ID   The ID for user to collaborate
  GROUP-ID  The ID for group to collaborate

EXAMPLE
  box collaborations:create --bulk-file-path path/to/csv/collaborations-add.csv
```

_See documentation [collaborations.md](https://github.com/box/boxcli/blob/main/docs/collaborations.md#box-collaborationscreate-itemid-itemtype)_
_See example: [collaborations-add.csv](collaborations-add.csv)_

## `box collaborations:delete ID`

Delete collaborations based on the collaboration ID

```
USAGE
  $ box collaborations:delete ID

ARGUMENTS
  ID        The ID of the collaboration to delete

EXAMPLE
  box collaborations:delete --bulk-file-path path/to/csv/collaborations-delete.csv
```

_See documentation [collaborations.md](https://github.com/box/boxcli/blob/main/docs/collaborations.md#box-collaborationsdelete-id)_
_See example: [collaborations-delete.csv](collaborations-delete.csv)_

## `box collaborations:update ID`

Update collaborations based on the collaboration ID

```
USAGE
  $ box collaborations:update ID

ARGUMENTS
  ID        The ID of the collaboration to update
  ROLE      (editor|viewer|previewer|uploader|previewer_uploader|viewer_uploader|co-owner)
  STATUS    (accepted|pending|rejected) Update the collaboration status

EXAMPLE
  box collaborations:update --bulk-file-path path/to/csv/collaborations-update.csv
```

_See documentation [collaborations.md](https://github.com/box/boxcli/blob/main/docs/collaborations.md#box-collaborationsupdate-id)_
_See example: [collaborations-update.csv](collaborations-update.csv)_
