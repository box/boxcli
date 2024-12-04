`box users`
===========

List all Box users

* [`box users`](#box-users)
* [`box users:add-email-alias USERID EMAIL`](#box-usersadd-email-alias-userid-email)
* [`box users:create NAME [LOGIN]`](#box-userscreate-name-login)
* [`box users:delete ID`](#box-usersdelete-id)
* [`box users:delete-email-alias USERID ALIASID`](#box-usersdelete-email-alias-userid-aliasid)
* [`box users:email-aliases USERID`](#box-usersemail-aliases-userid)
* [`box users:email-aliases:add USERID EMAIL`](#box-usersemail-aliasesadd-userid-email)
* [`box users:email-aliases:remove USERID ALIASID`](#box-usersemail-aliasesremove-userid-aliasid)
* [`box users:get [ID]`](#box-usersget-id)
* [`box users:get-email-aliases USERID`](#box-usersget-email-aliases-userid)
* [`box users:groups ID`](#box-usersgroups-id)
* [`box users:invite EMAIL ENTERPRISEID`](#box-usersinvite-email-enterpriseid)
* [`box users:invite-user EMAIL ENTERPRISEID`](#box-usersinvite-user-email-enterpriseid)
* [`box users:list`](#box-userslist)
* [`box users:list-groups ID`](#box-userslist-groups-id)
* [`box users:move-root-content USERID NEWUSERID`](#box-usersmove-root-content-userid-newuserid)
* [`box users:search NAME`](#box-userssearch-name)
* [`box users:terminate-session`](#box-usersterminate-session)
* [`box users:transfer-content USERID NEWUSERID`](#box-userstransfer-content-userid-newuserid)
* [`box users:update ID`](#box-usersupdate-id)

## `box users`

List all Box users

```
USAGE
  $ box users [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>] [-e | [-m |
    --app-users | -a] | ] [--filter <value> | ]

FLAGS
  -a, --all-users                  Results from all users
  -e, --external-users             Limit results to external users only
  -h, --help                       Show CLI help
  -m, --managed-users              Limit results to managed users only
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --app-users                  Limit results to app users only
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --filter=<value>             Search term to filter users on; matches prefixes of user name and login fields
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List all Box users

ALIASES
  $ box users:list

EXAMPLES
  $ box users
```

_See code: [src/commands/users/index.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/users/index.ts)_

## `box users:add-email-alias USERID EMAIL`

Add a new email alias to a user

```
USAGE
  $ box users:add-email-alias USERID EMAIL [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--confirm]

ARGUMENTS
  USERID  User ID to add email alias
  EMAIL   Email to add as alias

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --[no-]confirm               Whether or not to confirm the email alias.  Only Admins may automatically confirm an
                                   alias.
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Add a new email alias to a user

ALIASES
  $ box users:add-email-alias

EXAMPLES
  $ box users:email-aliases:add 33333 user+alias@example.com
```

## `box users:create NAME [LOGIN]`

Create a new Box User

```
USAGE
  $ box users:create NAME [LOGIN] [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--external-id
    <value> --app-user] [--id-only] [--sync-enable | ] [--exempt-from-device-limits] [--exempt-from-2fa]
    [--restrict-external-collab] [--can-see-managed-users] [--password-reset] [-r user|coadmin] [-l <value>] [-j
    <value>] [-p <value>] [-a <value>] [-d <value>] [-S active|inactive|cannot_delete_edit|cannot_delete_edit_upload]
    [--timezone <value>] [--tracking-codes <value>]

ARGUMENTS
  NAME   The user's name
  LOGIN  The user's email address, not required when creating app users

FLAGS
  -S, --status=<option>                 User status
                                        <options: active|inactive|cannot_delete_edit|cannot_delete_edit_upload>
  -a, --address=<value>                 Address of the user
  -d, --disk-space=<value>              User's available storage in bytes. Value of -1 grants unlimited storage
  -h, --help                            Show CLI help
  -j, --job-title=<value>               Job title of the user
  -l, --language=<value>                Language of the user (ISO 639-1 Language Code).
                                        https://developer.box.com/v2.0/docs/api-language-codes
  -p, --phone-number=<value>            Phone number of the user
  -q, --quiet                           Suppress any non-error output to stderr
  -r, --role=<option>                   Role of user. Enter user or coadmin
                                        <options: user|coadmin>
  -s, --save                            Save report to default reports folder on disk
  -t, --token=<value>                   Provide a token to perform this call
  -v, --verbose                         Show verbose output, which can be helpful for debugging
  -y, --yes                             Automatically respond yes to all confirmation prompts
      --app-user                        Set this user as an app user
      --as-user=<value>                 Provide an ID for a user
      --bulk-file-path=<value>          File path to bulk .csv or .json objects
      --[no-]can-see-managed-users      User can see managed users
      --csv                             Output formatted CSV
      --[no-]exempt-from-2fa            Exempt user from two-factor auth
      --[no-]exempt-from-device-limits  Exempt user from device limits
      --external-id=<value>             External ID for app users
      --fields=<value>                  Comma separated list of fields to show
      --id-only                         Return only an ID to output from this command
      --json                            Output formatted JSON
      --no-color                        Turn off colors for logging
      --password-reset                  Force the user to reset password
      --[no-]restrict-external-collab   Restrict user from external collaboration
      --save-to-file-path=<value>       Override default file path to save report
      --[no-]sync-enable                Enable Box Sync for this user
      --timezone=<value>                The user's timezone. Input format follows tz database timezones
      --tracking-codes=<value>          Comma-separated list of key-value pairs to associate with the user. Format is
                                        name=value,name=value

DESCRIPTION
  Create a new Box User

EXAMPLES
  $ box users:create "John Doe" jdoe@example.com
```

_See code: [src/commands/users/create.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/users/create.ts)_

## `box users:delete ID`

Delete a Box User

```
USAGE
  $ box users:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--notify] [-f]

ARGUMENTS
  ID  User ID to delete

FLAGS
  -f, --force                      Delete user even if they own files
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
      --[no-]notify                The user should be notified
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Delete a Box User

EXAMPLES
  $ box users:delete 33333
```

_See code: [src/commands/users/delete.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/users/delete.ts)_

## `box users:delete-email-alias USERID ALIASID`

Delete an email alias from a user

```
USAGE
  $ box users:delete-email-alias USERID ALIASID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  USERID   User ID to get email aliases
  ALIASID  The ID of the email alias to delete

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
  Delete an email alias from a user

ALIASES
  $ box users:delete-email-alias

EXAMPLES
  $ box users:email-aliases:remove 33333 12345
```

## `box users:email-aliases USERID`

Get all Email Aliases for a User

```
USAGE
  $ box users:email-aliases USERID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  USERID  User ID to get email aliases for

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
  Get all Email Aliases for a User

ALIASES
  $ box users:get-email-aliases

EXAMPLES
  $ box users:email-aliases 33333
```

_See code: [src/commands/users/email-aliases/index.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/users/email-aliases/index.ts)_

## `box users:email-aliases:add USERID EMAIL`

Add a new email alias to a user

```
USAGE
  $ box users:email-aliases:add USERID EMAIL [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--confirm]

ARGUMENTS
  USERID  User ID to add email alias
  EMAIL   Email to add as alias

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --[no-]confirm               Whether or not to confirm the email alias.  Only Admins may automatically confirm an
                                   alias.
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Add a new email alias to a user

ALIASES
  $ box users:add-email-alias

EXAMPLES
  $ box users:email-aliases:add 33333 user+alias@example.com
```

_See code: [src/commands/users/email-aliases/add.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/users/email-aliases/add.ts)_

## `box users:email-aliases:remove USERID ALIASID`

Delete an email alias from a user

```
USAGE
  $ box users:email-aliases:remove USERID ALIASID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  USERID   User ID to get email aliases
  ALIASID  The ID of the email alias to delete

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
  Delete an email alias from a user

ALIASES
  $ box users:delete-email-alias

EXAMPLES
  $ box users:email-aliases:remove 33333 12345
```

_See code: [src/commands/users/email-aliases/remove.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/users/email-aliases/remove.ts)_

## `box users:get [ID]`

Get information about a Box user

```
USAGE
  $ box users:get [ID] [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  [default: me] ID of the user to get; defaults to the current user

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
  Get information about a Box user

EXAMPLES
  $ box users:get 33333
```

_See code: [src/commands/users/get.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/users/get.ts)_

## `box users:get-email-aliases USERID`

Get all Email Aliases for a User

```
USAGE
  $ box users:get-email-aliases USERID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  USERID  User ID to get email aliases for

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
  Get all Email Aliases for a User

ALIASES
  $ box users:get-email-aliases

EXAMPLES
  $ box users:email-aliases 33333
```

## `box users:groups ID`

List groups a user belongs to

```
USAGE
  $ box users:groups ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

ARGUMENTS
  ID  ID of the user to get groups for

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
  List groups a user belongs to

ALIASES
  $ box users:list-groups

EXAMPLES
  $ box users:groups 33333
```

_See code: [src/commands/users/groups.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/users/groups.ts)_

## `box users:invite EMAIL ENTERPRISEID`

Invite an Existing Box User to Your Enterprise

```
USAGE
  $ box users:invite EMAIL ENTERPRISEID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  EMAIL         Email address of the user to invite
  ENTERPRISEID  ID of the Enterprise to invite the user to

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
  Invite an Existing Box User to Your Enterprise

ALIASES
  $ box users:invite-user

EXAMPLES
  $ box users:invite user@example.com 12345
```

_See code: [src/commands/users/invite.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/users/invite.ts)_

## `box users:invite-user EMAIL ENTERPRISEID`

Invite an Existing Box User to Your Enterprise

```
USAGE
  $ box users:invite-user EMAIL ENTERPRISEID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  EMAIL         Email address of the user to invite
  ENTERPRISEID  ID of the Enterprise to invite the user to

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
  Invite an Existing Box User to Your Enterprise

ALIASES
  $ box users:invite-user

EXAMPLES
  $ box users:invite user@example.com 12345
```

## `box users:list`

List all Box users

```
USAGE
  $ box users:list [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>] [-e | [-m |
    --app-users | -a] | ] [--filter <value> | ]

FLAGS
  -a, --all-users                  Results from all users
  -e, --external-users             Limit results to external users only
  -h, --help                       Show CLI help
  -m, --managed-users              Limit results to managed users only
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --app-users                  Limit results to app users only
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --filter=<value>             Search term to filter users on; matches prefixes of user name and login fields
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List all Box users

ALIASES
  $ box users:list

EXAMPLES
  $ box users
```

## `box users:list-groups ID`

List groups a user belongs to

```
USAGE
  $ box users:list-groups ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

ARGUMENTS
  ID  ID of the user to get groups for

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
  List groups a user belongs to

ALIASES
  $ box users:list-groups

EXAMPLES
  $ box users:groups 33333
```

## `box users:move-root-content USERID NEWUSERID`

Move a user's root content to another user

```
USAGE
  $ box users:move-root-content USERID NEWUSERID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--notify]

ARGUMENTS
  USERID     User whose content should be moved
  NEWUSERID  User to whom the content should be moved

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
      --[no-]notify                Notify the user that their content has been moved
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Move a user's root content to another user

ALIASES
  $ box users:move-root-content

EXAMPLES
  $ box users:transfer-content 33333 44444
```

## `box users:search NAME`

Search for Box users

```
USAGE
  $ box users:search NAME [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [-e | [-m |  | -a] | ]

ARGUMENTS
  NAME  Name of user to search for

FLAGS
  -a, --all-users                  Results from all users
  -e, --external-users             Limit results to external users only
  -h, --help                       Show CLI help
  -m, --managed-users              Limit results to managed users only
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
  Search for Box users

EXAMPLES
  $ box users:search "John Doe"
```

_See code: [src/commands/users/search.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/users/search.ts)_

## `box users:terminate-session`

Validates the roles and permissions of the user, and creates asynchronous jobs to terminate the user's sessions.

```
USAGE
  $ box users:terminate-session [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--user-ids <value>...] [--user-logins
    <value>...]

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
      --user-ids=<value>...        A list of user IDs
      --user-logins=<value>...     A list of user logins

DESCRIPTION
  Validates the roles and permissions of the user, and creates asynchronous jobs to terminate the user's sessions.

ALIASES
  $ box users:terminate-session

EXAMPLES
  $ box users:terminate-session --user-ids 123 345 --user-logins abc@example.com def@example.com
```

_See code: [src/commands/users/terminate-session.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/users/terminate-session.ts)_

## `box users:transfer-content USERID NEWUSERID`

Move a user's root content to another user

```
USAGE
  $ box users:transfer-content USERID NEWUSERID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--notify]

ARGUMENTS
  USERID     User whose content should be moved
  NEWUSERID  User to whom the content should be moved

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
      --[no-]notify                Notify the user that their content has been moved
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Move a user's root content to another user

ALIASES
  $ box users:move-root-content

EXAMPLES
  $ box users:transfer-content 33333 44444
```

_See code: [src/commands/users/transfer-content.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/users/transfer-content.ts)_

## `box users:update ID`

Update a Box User

```
USAGE
  $ box users:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--remove] [-n <value>] [--sync-enable]
    [--exempt-from-device-limits] [--exempt-from-2fa] [--restrict-external-collab] [--can-see-managed-users]
    [--password-reset] [-r user|coadmin] [-l <value>] [-j <value>] [-p <value>] [-a <value>] [-d <value>] [-S
    active|inactive|cannot_delete_edit|cannot_delete_edit_upload] [--timezone <value>] [--login <value>] [--external-id
    <value>] [--tracking-codes <value>]

ARGUMENTS
  ID  User ID to update

FLAGS
  -S, --status=<option>                 User status. Enter active, inactive, cannot_delete_edit, or
                                        cannot_delete_edit_upload
                                        <options: active|inactive|cannot_delete_edit|cannot_delete_edit_upload>
  -a, --address=<value>                 Address of the user
  -d, --disk-space=<value>              User's available storage in bytes. Value of -1 grants unlimited storage
  -h, --help                            Show CLI help
  -j, --job-title=<value>               Job title of the user
  -l, --language=<value>                Language of the user (ISO 639-1 Language Code).
                                        https://developer.box.com/v2.0/docs/api-language-codes
  -n, --name=<value>                    Set the user's name
  -p, --phone-number=<value>            Phone number of the user
  -q, --quiet                           Suppress any non-error output to stderr
  -r, --role=<option>                   Role of user. Enter user or coadmin
                                        <options: user|coadmin>
  -s, --save                            Save report to default reports folder on disk
  -t, --token=<value>                   Provide a token to perform this call
  -v, --verbose                         Show verbose output, which can be helpful for debugging
  -y, --yes                             Automatically respond yes to all confirmation prompts
      --as-user=<value>                 Provide an ID for a user
      --bulk-file-path=<value>          File path to bulk .csv or .json objects
      --[no-]can-see-managed-users      User can see managed users
      --csv                             Output formatted CSV
      --[no-]exempt-from-2fa            Exempt user from two-factor auth
      --[no-]exempt-from-device-limits  Exempt user from device limits
      --external-id=<value>             External ID for app users
      --fields=<value>                  Comma separated list of fields to show
      --json                            Output formatted JSON
      --login=<value>                   Change the user's primary email address used for logging into Box
      --no-color                        Turn off colors for logging
      --password-reset                  Force the user to reset password
      --remove                          Remove the user from the enterprise, convert to free account
      --[no-]restrict-external-collab   Restrict user from external collaboration
      --save-to-file-path=<value>       Override default file path to save report
      --[no-]sync-enable                Enable Box Sync for this user
      --timezone=<value>                The user's timezone. Input format follows tz database timezones
      --tracking-codes=<value>          Comma-separated list of key-value pairs to associate with the user. Format is
                                        name=value,name=value

DESCRIPTION
  Update a Box User

EXAMPLES
  $ box users:update 33333 --status inactive
```

_See code: [src/commands/users/update.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/users/update.ts)_
