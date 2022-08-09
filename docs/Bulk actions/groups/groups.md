`box groups`
===========

Manage groups

* [`box groups:create NAME`](#box-groupscreate-name)
* [`box groups:memberships:add USERID GROUPID`](#box-groupsmembershipsadd-userid-groupid)

## `box groups:create NAME`

Create a group

```
USAGE
  $ box groups:create NAME

ARGUMENTS
  NAME  Group name


EXAMPLE
  box groups:create --bulk-file-path path/to/csv/groups-create.csv
```

- _See documentation [groups.md](https://github.com/box/boxcli/blob/main/docs/groups.md#box-groupscreate-name)_
- _See example: [groups-create.csv](groups-create.csv)_



## `box groups:memberships:add USERID GROUPID`

Add a user to a group

```
USAGE
  $ box groups:memberships:add USERID GROUPID

ARGUMENTS
  USERID   ID of the user to add to the group
  GROUPID  ID of the group to add the user to


EXAMPLE
  box groups:memberships:add --bulk-file-path path/to/csv/groups-memberships-add.csv
```

- _See documentation [groups.md](https://github.com/box/boxcli/blob/main/docs/groups.md#box-groupsmembershipsadd-userid-groupid)_
- _See example: [groups-memberships-add.csv](groups-memberships-add.csv)_
