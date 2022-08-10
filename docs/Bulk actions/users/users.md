`box users`
===========

Manage users

* [`box users:create NAME [LOGIN]`](#box-userscreate-name-login)
* [`box users:transfer-content USERID NEWUSERID`](#box-userstransfer-content-userid-newuserid)
* [`box users:update ID`](#box-usersupdate-id)


## `box users:create NAME [LOGIN]`

Create a new Box User

```
USAGE
  $ box users:create NAME [LOGIN]

ARGUMENTS
  NAME   The user's name
  LOGIN  The user's email address, not required when creating app users


EXAMPLE
  box users:create --bulk-file-path path/to/csv/create-users.csv
```

_See documentation [users.md](https://github.com/box/boxcli/blob/main/docs/users.md#box-userscreate-name-login)_
_See example: [create-users.csv](create-users.csv)_


## `box users:transfer-content USERID NEWUSERID`

Move a user's root content to another user

```
USAGE
  $ box users:transfer-content USERID NEWUSERID

ARGUMENTS
  USERID     User whose content should be moved
  NEWUSERID  User to whom the content should be moved

ALIASES
  $ box users:move-root-content

EXAMPLE
  box users:transfer-content --bulk-file-path path/to/csv/transfer-content.csv
```

_See documentation [users.md](https://github.com/box/boxcli/blob/main/docs/users.md#box-userstransfer-content-userid-newuserid)_
_See example: [transfer-content.csv](transfer-content.csv)_


## `box users:update ID`

Update a Box User

```
USAGE
  $ box users:update ID

ARGUMENTS
  ID  User ID to update

EXAMPLE
  box users:update --bulk-file-path path/to/csv/update-users.csv
```

- _See documentation [users.md](https://github.com/box/boxcli/blob/main/docs/users.md#box-usersupdate-id)_
- _See example: [update-users.csv](update-users.csv)_
