`box groups`
============

List all groups

* [`box groups`](#box-groups)
* [`box groups:collaborations ID`](#box-groupscollaborations-id)
* [`box groups:create NAME`](#box-groupscreate-name)
* [`box groups:delete ID`](#box-groupsdelete-id)
* [`box groups:get ID`](#box-groupsget-id)
* [`box groups:memberships ID`](#box-groupsmemberships-id)
* [`box groups:memberships:add USERID GROUPID`](#box-groupsmembershipsadd-userid-groupid)
* [`box groups:memberships:get ID`](#box-groupsmembershipsget-id)
* [`box groups:memberships:remove ID`](#box-groupsmembershipsremove-id)
* [`box groups:memberships:update ID`](#box-groupsmembershipsupdate-id)
* [`box groups:terminate-session`](#box-groupsterminate-session)
* [`box groups:update ID`](#box-groupsupdate-id)

## `box groups`

List all groups

```
USAGE
  $ box groups

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
  --filter=filter                        Search term to filter groups on; matches prefixes of group name
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box groups:list

EXAMPLE
  box groups
```

_See code: [src/commands/groups/index.js](https://github.com/box/boxcli/blob/v3.7.0/src/commands/groups/index.js)_

## `box groups:collaborations ID`

List collaborations for a group

```
USAGE
  $ box groups:collaborations ID

ARGUMENTS
  ID  ID of the group to get collaborations for

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
  $ box groups:list-collaborations
  $ box collaborations:list-for-group

EXAMPLE
  box groups:collaborations 12345
```

_See code: [src/commands/groups/collaborations.js](https://github.com/box/boxcli/blob/v3.7.0/src/commands/groups/collaborations.js)_

## `box groups:create NAME`

Create a group

```
USAGE
  $ box groups:create NAME

ARGUMENTS
  NAME  Group name

OPTIONS
  -h, --help                                                           Show CLI help
  -i, --invite=admins_only|admins_and_members|all_managed_users        Specifies who can invite the group to collaborate
  -m, --view-members=admins_only|admins_and_members|all_managed_users  Specifies who can view the members of the group
  -q, --quiet                                                          Suppress any non-error output to stderr
  -s, --save                                                           Save report to default reports folder on disk
  -t, --token=token                                                    Provide a token to perform this call

  -v, --verbose                                                        Show verbose output, which can be helpful for
                                                                       debugging

  -y, --yes                                                            Automatically respond yes to all confirmation
                                                                       prompts

  --as-user=as-user                                                    Provide an ID for a user

  --bulk-file-path=bulk-file-path                                      File path to bulk .csv or .json objects

  --csv                                                                Output formatted CSV

  --description=description                                            Description of the group

  --external-sync-identifier=external-sync-identifier                  Group identifier for groups coming from an
                                                                       external source

  --fields=fields                                                      Comma separated list of fields to show

  --id-only                                                            Return only an ID to output from this command

  --json                                                               Output formatted JSON

  --no-color                                                           Turn off colors for logging

  --provenance=provenance                                              Track the external source where the group is
                                                                       coming from

  --save-to-file-path=save-to-file-path                                Override default file path to save report

EXAMPLE
  box groups:create "US Employees"
```

_See code: [src/commands/groups/create.js](https://github.com/box/boxcli/blob/v3.7.0/src/commands/groups/create.js)_

## `box groups:delete ID`

Delete a group

```
USAGE
  $ box groups:delete ID

ARGUMENTS
  ID  ID of the group to delete

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
  box groups:delete 12345
```

_See code: [src/commands/groups/delete.js](https://github.com/box/boxcli/blob/v3.7.0/src/commands/groups/delete.js)_

## `box groups:get ID`

Get information about a group

```
USAGE
  $ box groups:get ID

ARGUMENTS
  ID  ID of the group to get

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
  box groups:get 12345
```

_See code: [src/commands/groups/get.js](https://github.com/box/boxcli/blob/v3.7.0/src/commands/groups/get.js)_

## `box groups:memberships ID`

List members of a group

```
USAGE
  $ box groups:memberships ID

ARGUMENTS
  ID  ID of the group to get memberships for

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
  $ box groups:membership:list

EXAMPLE
  box groups:memberships 12345
```

_See code: [src/commands/groups/memberships/index.js](https://github.com/box/boxcli/blob/v3.7.0/src/commands/groups/memberships/index.js)_

## `box groups:memberships:add USERID GROUPID`

Add a user to a group

```
USAGE
  $ box groups:memberships:add USERID GROUPID

ARGUMENTS
  USERID   ID of the user to add to the group
  GROUPID  ID of the group to add the user to

OPTIONS
  -h, --help                             Show CLI help
  -q, --quiet                            Suppress any non-error output to stderr
  -r, --role=member|admin                [default: member] Set the user's role in the group
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --[no-]can-create-accounts             If the user is a group admin, allow them to create new users
  --[no-]can-edit-accounts               If the user is a group admin, allow them to edit user accounts
  --[no-]can-instant-login               If the user is a group admin, allow them to instant login
  --[no-]can-run-reports                 If the user is a group admin, allow them to run reports
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box groups:membership:add

EXAMPLE
  box groups:memberships:add 33333 12345
```

_See code: [src/commands/groups/memberships/add.js](https://github.com/box/boxcli/blob/v3.7.0/src/commands/groups/memberships/add.js)_

## `box groups:memberships:get ID`

Get information about a group membership

```
USAGE
  $ box groups:memberships:get ID

ARGUMENTS
  ID  ID of the group membership to get

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
  $ box groups:membership:get

EXAMPLE
  box groups:memberships:get 12345
```

_See code: [src/commands/groups/memberships/get.js](https://github.com/box/boxcli/blob/v3.7.0/src/commands/groups/memberships/get.js)_

## `box groups:memberships:remove ID`

Remove a user from a group

```
USAGE
  $ box groups:memberships:remove ID

ARGUMENTS
  ID  ID of the group membership record to delete

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
  $ box groups:membership:remove

EXAMPLE
  box groups:memberships:remove 12345
```

_See code: [src/commands/groups/memberships/remove.js](https://github.com/box/boxcli/blob/v3.7.0/src/commands/groups/memberships/remove.js)_

## `box groups:memberships:update ID`

Update a user's membership to a group

```
USAGE
  $ box groups:memberships:update ID

ARGUMENTS
  ID  ID of the group membership to update

OPTIONS
  -h, --help                             Show CLI help
  -q, --quiet                            Suppress any non-error output to stderr
  -r, --role=member|admin                Set the user's role in the group
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --[no-]can-create-accounts             If the user is a group admin, allow them to create new users
  --[no-]can-edit-accounts               If the user is a group admin, allow them to edit user accounts
  --[no-]can-instant-login               If the user is a group admin, allow them to instant login
  --[no-]can-run-reports                 If the user is a group admin, allow them to run reports
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box groups:membership:update

EXAMPLE
  box groups:memberships:update
```

_See code: [src/commands/groups/memberships/update.js](https://github.com/box/boxcli/blob/v3.7.0/src/commands/groups/memberships/update.js)_

## `box groups:terminate-session`

Validates the roles and permissions of the group, and creates asynchronous jobs to terminate the group's sessions.

```
USAGE
  $ box groups:terminate-session

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
  --group-ids=group-ids                  (required) A list of group IDs
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box groups:terminate-session

EXAMPLE
  box groups:terminate-session --group-ids 123 345
```

_See code: [src/commands/groups/terminate-session.js](https://github.com/box/boxcli/blob/v3.7.0/src/commands/groups/terminate-session.js)_

## `box groups:update ID`

Update a group

```
USAGE
  $ box groups:update ID

ARGUMENTS
  ID  ID of the group to update

OPTIONS
  -h, --help                                                           Show CLI help
  -i, --invite=admins_only|admins_and_members|all_managed_users        Specifies who can invite the group to collaborate
  -m, --view-members=admins_only|admins_and_members|all_managed_users  Specifies who can view the members of the group
  -n, --name=name                                                      The name of the group
  -q, --quiet                                                          Suppress any non-error output to stderr
  -s, --save                                                           Save report to default reports folder on disk
  -t, --token=token                                                    Provide a token to perform this call

  -v, --verbose                                                        Show verbose output, which can be helpful for
                                                                       debugging

  -y, --yes                                                            Automatically respond yes to all confirmation
                                                                       prompts

  --as-user=as-user                                                    Provide an ID for a user

  --bulk-file-path=bulk-file-path                                      File path to bulk .csv or .json objects

  --csv                                                                Output formatted CSV

  --description=description                                            Description of the group

  --external-sync-identifier=external-sync-identifier                  group identifier for groups coming from an
                                                                       external source

  --fields=fields                                                      Comma separated list of fields to show

  --json                                                               Output formatted JSON

  --no-color                                                           Turn off colors for logging

  --provenance=provenance                                              Track the external source where the group is
                                                                       coming from

  --save-to-file-path=save-to-file-path                                Override default file path to save report

EXAMPLE
  box groups:update 12345 --name "U.S. Employees"
```

_See code: [src/commands/groups/update.js](https://github.com/box/boxcli/blob/v3.7.0/src/commands/groups/update.js)_
