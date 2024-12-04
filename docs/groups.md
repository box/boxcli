`box groups`
============

List all groups

* [`box groups`](#box-groups)
* [`box groups:collaborations ID`](#box-groupscollaborations-id)
* [`box groups:create NAME`](#box-groupscreate-name)
* [`box groups:delete ID`](#box-groupsdelete-id)
* [`box groups:get ID`](#box-groupsget-id)
* [`box groups:list`](#box-groupslist)
* [`box groups:list-collaborations ID`](#box-groupslist-collaborations-id)
* [`box groups:membership:add USERID GROUPID`](#box-groupsmembershipadd-userid-groupid)
* [`box groups:membership:get ID`](#box-groupsmembershipget-id)
* [`box groups:membership:list ID`](#box-groupsmembershiplist-id)
* [`box groups:membership:remove ID`](#box-groupsmembershipremove-id)
* [`box groups:membership:update ID`](#box-groupsmembershipupdate-id)
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
  $ box groups [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>] [--filter <value>]

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
      --filter=<value>             Search term to filter groups on; matches prefixes of group name
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List all groups

ALIASES
  $ box groups:list

EXAMPLES
  $ box groups
```

_See code: [src/commands/groups/index.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/groups/index.ts)_

## `box groups:collaborations ID`

List collaborations for a group

```
USAGE
  $ box groups:collaborations ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the group to get collaborations for

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
  List collaborations for a group

ALIASES
  $ box groups:list-collaborations
  $ box collaborations:list-for-group

EXAMPLES
  $ box groups:collaborations 12345
```

_See code: [src/commands/groups/collaborations.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/groups/collaborations.ts)_

## `box groups:create NAME`

Create a group

```
USAGE
  $ box groups:create NAME [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--description <value>]
    [--external-sync-identifier <value>] [--provenance <value>] [-i admins_only|admins_and_members|all_managed_users]
    [-m admins_only|admins_and_members|all_managed_users] [--id-only]

ARGUMENTS
  NAME  Group name

FLAGS
  -h, --help                              Show CLI help
  -i, --invite=<option>                   Specifies who can invite the group to collaborate
                                          <options: admins_only|admins_and_members|all_managed_users>
  -m, --view-members=<option>             Specifies who can view the members of the group
                                          <options: admins_only|admins_and_members|all_managed_users>
  -q, --quiet                             Suppress any non-error output to stderr
  -s, --save                              Save report to default reports folder on disk
  -t, --token=<value>                     Provide a token to perform this call
  -v, --verbose                           Show verbose output, which can be helpful for debugging
  -y, --yes                               Automatically respond yes to all confirmation prompts
      --as-user=<value>                   Provide an ID for a user
      --bulk-file-path=<value>            File path to bulk .csv or .json objects
      --csv                               Output formatted CSV
      --description=<value>               Description of the group
      --external-sync-identifier=<value>  Group identifier for groups coming from an external source
      --fields=<value>                    Comma separated list of fields to show
      --id-only                           Return only an ID to output from this command
      --json                              Output formatted JSON
      --no-color                          Turn off colors for logging
      --provenance=<value>                Track the external source where the group is coming from
      --save-to-file-path=<value>         Override default file path to save report

DESCRIPTION
  Create a group

EXAMPLES
  $ box groups:create "US Employees"
```

_See code: [src/commands/groups/create.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/groups/create.ts)_

## `box groups:delete ID`

Delete a group

```
USAGE
  $ box groups:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the group to delete

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
  Delete a group

EXAMPLES
  $ box groups:delete 12345
```

_See code: [src/commands/groups/delete.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/groups/delete.ts)_

## `box groups:get ID`

Get information about a group

```
USAGE
  $ box groups:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the group to get

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
  Get information about a group

EXAMPLES
  $ box groups:get 12345
```

_See code: [src/commands/groups/get.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/groups/get.ts)_

## `box groups:list`

List all groups

```
USAGE
  $ box groups:list [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>] [--filter <value>]

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
      --filter=<value>             Search term to filter groups on; matches prefixes of group name
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List all groups

ALIASES
  $ box groups:list

EXAMPLES
  $ box groups
```

## `box groups:list-collaborations ID`

List collaborations for a group

```
USAGE
  $ box groups:list-collaborations ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the group to get collaborations for

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
  List collaborations for a group

ALIASES
  $ box groups:list-collaborations
  $ box collaborations:list-for-group

EXAMPLES
  $ box groups:collaborations 12345
```

## `box groups:membership:add USERID GROUPID`

Add a user to a group

```
USAGE
  $ box groups:membership:add USERID GROUPID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [-r member|admin]
    [--can-run-reports] [--can-instant-login] [--can-create-accounts] [--can-edit-accounts]

ARGUMENTS
  USERID   ID of the user to add to the group
  GROUPID  ID of the group to add the user to

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -r, --role=<option>              [default: member] Set the user's role in the group
                                   <options: member|admin>
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --[no-]can-create-accounts   If the user is a group admin, allow them to create new users
      --[no-]can-edit-accounts     If the user is a group admin, allow them to edit user accounts
      --[no-]can-instant-login     If the user is a group admin, allow them to instant login
      --[no-]can-run-reports       If the user is a group admin, allow them to run reports
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Add a user to a group

ALIASES
  $ box groups:membership:add

EXAMPLES
  $ box groups:memberships:add 33333 12345
```

## `box groups:membership:get ID`

Get information about a group membership

```
USAGE
  $ box groups:membership:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the group membership to get

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
  Get information about a group membership

ALIASES
  $ box groups:membership:get

EXAMPLES
  $ box groups:memberships:get 12345
```

## `box groups:membership:list ID`

List members of a group

```
USAGE
  $ box groups:membership:list ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

ARGUMENTS
  ID  ID of the group to get memberships for

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
  List members of a group

ALIASES
  $ box groups:membership:list

EXAMPLES
  $ box groups:memberships 12345
```

## `box groups:membership:remove ID`

Remove a user from a group

```
USAGE
  $ box groups:membership:remove ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the group membership record to delete

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
  Remove a user from a group

ALIASES
  $ box groups:membership:remove

EXAMPLES
  $ box groups:memberships:remove 12345
```

## `box groups:membership:update ID`

Update a user's membership to a group

```
USAGE
  $ box groups:membership:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [-r member|admin |  | ]
    [--can-run-reports] [--can-instant-login] [--can-create-accounts] [--can-edit-accounts]

ARGUMENTS
  ID  ID of the group membership to update

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -r, --role=<option>              Set the user's role in the group
                                   <options: member|admin>
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --[no-]can-create-accounts   If the user is a group admin, allow them to create new users
      --[no-]can-edit-accounts     If the user is a group admin, allow them to edit user accounts
      --[no-]can-instant-login     If the user is a group admin, allow them to instant login
      --[no-]can-run-reports       If the user is a group admin, allow them to run reports
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Update a user's membership to a group

ALIASES
  $ box groups:membership:update

EXAMPLES
  $ box groups:memberships:update
```

## `box groups:memberships ID`

List members of a group

```
USAGE
  $ box groups:memberships ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

ARGUMENTS
  ID  ID of the group to get memberships for

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
  List members of a group

ALIASES
  $ box groups:membership:list

EXAMPLES
  $ box groups:memberships 12345
```

_See code: [src/commands/groups/memberships/index.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/groups/memberships/index.ts)_

## `box groups:memberships:add USERID GROUPID`

Add a user to a group

```
USAGE
  $ box groups:memberships:add USERID GROUPID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [-r member|admin]
    [--can-run-reports] [--can-instant-login] [--can-create-accounts] [--can-edit-accounts]

ARGUMENTS
  USERID   ID of the user to add to the group
  GROUPID  ID of the group to add the user to

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -r, --role=<option>              [default: member] Set the user's role in the group
                                   <options: member|admin>
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --[no-]can-create-accounts   If the user is a group admin, allow them to create new users
      --[no-]can-edit-accounts     If the user is a group admin, allow them to edit user accounts
      --[no-]can-instant-login     If the user is a group admin, allow them to instant login
      --[no-]can-run-reports       If the user is a group admin, allow them to run reports
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Add a user to a group

ALIASES
  $ box groups:membership:add

EXAMPLES
  $ box groups:memberships:add 33333 12345
```

_See code: [src/commands/groups/memberships/add.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/groups/memberships/add.ts)_

## `box groups:memberships:get ID`

Get information about a group membership

```
USAGE
  $ box groups:memberships:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the group membership to get

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
  Get information about a group membership

ALIASES
  $ box groups:membership:get

EXAMPLES
  $ box groups:memberships:get 12345
```

_See code: [src/commands/groups/memberships/get.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/groups/memberships/get.ts)_

## `box groups:memberships:remove ID`

Remove a user from a group

```
USAGE
  $ box groups:memberships:remove ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the group membership record to delete

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
  Remove a user from a group

ALIASES
  $ box groups:membership:remove

EXAMPLES
  $ box groups:memberships:remove 12345
```

_See code: [src/commands/groups/memberships/remove.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/groups/memberships/remove.ts)_

## `box groups:memberships:update ID`

Update a user's membership to a group

```
USAGE
  $ box groups:memberships:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [-r member|admin |  | ]
    [--can-run-reports] [--can-instant-login] [--can-create-accounts] [--can-edit-accounts]

ARGUMENTS
  ID  ID of the group membership to update

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -r, --role=<option>              Set the user's role in the group
                                   <options: member|admin>
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --[no-]can-create-accounts   If the user is a group admin, allow them to create new users
      --[no-]can-edit-accounts     If the user is a group admin, allow them to edit user accounts
      --[no-]can-instant-login     If the user is a group admin, allow them to instant login
      --[no-]can-run-reports       If the user is a group admin, allow them to run reports
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Update a user's membership to a group

ALIASES
  $ box groups:membership:update

EXAMPLES
  $ box groups:memberships:update
```

_See code: [src/commands/groups/memberships/update.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/groups/memberships/update.ts)_

## `box groups:terminate-session`

Validates the roles and permissions of the group, and creates asynchronous jobs to terminate the group's sessions.

```
USAGE
  $ box groups:terminate-session --group-ids <value>... [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

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
      --group-ids=<value>...       (required) A list of group IDs
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Validates the roles and permissions of the group, and creates asynchronous jobs to terminate the group's sessions.

ALIASES
  $ box groups:terminate-session

EXAMPLES
  $ box groups:terminate-session --group-ids 123 345
```

_See code: [src/commands/groups/terminate-session.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/groups/terminate-session.ts)_

## `box groups:update ID`

Update a group

```
USAGE
  $ box groups:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [-n <value>] [--description <value>]
    [--external-sync-identifier <value>] [--provenance <value>] [-i admins_only|admins_and_members|all_managed_users]
    [-m admins_only|admins_and_members|all_managed_users]

ARGUMENTS
  ID  ID of the group to update

FLAGS
  -h, --help                              Show CLI help
  -i, --invite=<option>                   Specifies who can invite the group to collaborate
                                          <options: admins_only|admins_and_members|all_managed_users>
  -m, --view-members=<option>             Specifies who can view the members of the group
                                          <options: admins_only|admins_and_members|all_managed_users>
  -n, --name=<value>                      The name of the group
  -q, --quiet                             Suppress any non-error output to stderr
  -s, --save                              Save report to default reports folder on disk
  -t, --token=<value>                     Provide a token to perform this call
  -v, --verbose                           Show verbose output, which can be helpful for debugging
  -y, --yes                               Automatically respond yes to all confirmation prompts
      --as-user=<value>                   Provide an ID for a user
      --bulk-file-path=<value>            File path to bulk .csv or .json objects
      --csv                               Output formatted CSV
      --description=<value>               Description of the group
      --external-sync-identifier=<value>  group identifier for groups coming from an external source
      --fields=<value>                    Comma separated list of fields to show
      --json                              Output formatted JSON
      --no-color                          Turn off colors for logging
      --provenance=<value>                Track the external source where the group is coming from
      --save-to-file-path=<value>         Override default file path to save report

DESCRIPTION
  Update a group

EXAMPLES
  $ box groups:update 12345 --name "U.S. Employees"
```

_See code: [src/commands/groups/update.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/groups/update.ts)_
