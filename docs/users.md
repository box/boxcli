`box users`
===========

List all Box users

* [`box users`](#box-users)
* [`box users:create NAME [LOGIN]`](#box-userscreate-name-login)
* [`box users:delete ID`](#box-usersdelete-id)
* [`box users:email-aliases USERID`](#box-usersemail-aliases-userid)
* [`box users:email-aliases:add USERID EMAIL`](#box-usersemail-aliasesadd-userid-email)
* [`box users:email-aliases:remove USERID ALIASID`](#box-usersemail-aliasesremove-userid-aliasid)
* [`box users:get [ID]`](#box-usersget-id)
* [`box users:groups ID`](#box-usersgroups-id)
* [`box users:invite EMAIL ENTERPRISEID`](#box-usersinvite-email-enterpriseid)
* [`box users:transfer-content USERID NEWUSERID`](#box-userstransfer-content-userid-newuserid)
* [`box users:update ID`](#box-usersupdate-id)

## `box users`

List all Box users

```
USAGE
  $ box users

OPTIONS
  -a, --all-users                        Results from all users
  -e, --external-users                   Limit results to external users only
  -h, --help                             Show CLI help
  -m, --managed-users                    Limit results to managed users only
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --app-users                            Limit results to app users only
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --filter=filter                        Search term to filter users on; matches prefixes of user name and login fields
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box users:list
```

_See code: [src/commands/users/index.js](https://github.com/box/boxcli/blob/v2.2.0/src/commands/users/index.js)_

## `box users:create NAME [LOGIN]`

Create a new Box User

```
USAGE
  $ box users:create NAME [LOGIN]

ARGUMENTS
  NAME   The user's name
  LOGIN  The user's email address, not required when creating app users

OPTIONS
  -S, --status=active|inactive|cannot_delete_edit|cannot_delete_edit_upload  User status
  -a, --address=address                                                      Address of the user

  -d, --disk-space=disk-space                                                User's available storage in bytes. Value of
                                                                             -1 grants unlimited storage

  -h, --help                                                                 Show CLI help

  -j, --job-title=job-title                                                  Job title of the user

  -l, --language=language                                                    Language of the user (ISO 639-1 Language
                                                                             Code).
                                                                             https://developer.box.com/v2.0/docs/api-lan
                                                                             guage-codes

  -p, --phone-number=phone-number                                            Phone number of the user

  -r, --role=user|coadmin                                                    Role of user. Enter user or coadmin

  -s, --save                                                                 Save report to default reports folder on
                                                                             disk

  -t, --token=token                                                          Provide a token to perform this call

  -v, --verbose                                                              Show verbose output, which can be helpful
                                                                             for debugging

  -y, --yes                                                                  Automatically respond yes to all
                                                                             confirmation prompts

  --app-user                                                                 Set this user as an app user

  --as-user=as-user                                                          Provide an ID for a user

  --avatar-url=avatar-url                                                    URL of the user's avatar image

  --bulk-file-path=bulk-file-path                                            File path to bulk .csv or .json objects

  --[no-]can-see-managed-users                                               User can see managed users

  --csv                                                                      Output formatted CSV

  --[no-]exempt-from-2fa                                                     Exempt user from two-factor auth

  --[no-]exempt-from-device-limits                                           Exempt user from device limits

  --fields=fields                                                            Comma separated list of fields to show

  --id-only                                                                  Return only an ID to output from this
                                                                             command

  --json                                                                     Output formatted JSON

  --no-color                                                                 Turn off colors for logging

  --password-reset                                                           Force the user to reset password

  --[no-]restrict-external-collab                                            Restrict user from external collaboration

  --save-to-file-path=save-to-file-path                                      Override default file path to save report

  --[no-]sync-enable                                                         Enable Box Sync for this user

  --timezone=timezone                                                        The user's timezone. Input format follows
                                                                             tz database timezones
```

_See code: [src/commands/users/create.js](https://github.com/box/boxcli/blob/v2.2.0/src/commands/users/create.js)_

## `box users:delete ID`

Delete a Box User

```
USAGE
  $ box users:delete ID

ARGUMENTS
  ID  User ID to delete

OPTIONS
  -f, --force                            Delete user even if they own files
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
  --[no-]notify                          The user should be notified
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/users/delete.js](https://github.com/box/boxcli/blob/v2.2.0/src/commands/users/delete.js)_

## `box users:email-aliases USERID`

Get all Email Aliases for a User

```
USAGE
  $ box users:email-aliases USERID

ARGUMENTS
  USERID  User ID to get email aliases for

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
  $ box users:get-email-aliases
```

_See code: [src/commands/users/email-aliases/index.js](https://github.com/box/boxcli/blob/v2.2.0/src/commands/users/email-aliases/index.js)_

## `box users:email-aliases:add USERID EMAIL`

Add a new email alias to a user

```
USAGE
  $ box users:email-aliases:add USERID EMAIL

ARGUMENTS
  USERID  User ID to add email alias
  EMAIL   Email to add as alias

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
  $ box users:add-email-alias
```

_See code: [src/commands/users/email-aliases/add.js](https://github.com/box/boxcli/blob/v2.2.0/src/commands/users/email-aliases/add.js)_

## `box users:email-aliases:remove USERID ALIASID`

Delete an email alias from a user

```
USAGE
  $ box users:email-aliases:remove USERID ALIASID

ARGUMENTS
  USERID   User ID to get email aliases
  ALIASID  The ID of the email alias to delete

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
  $ box users:delete-email-alias
```

_See code: [src/commands/users/email-aliases/remove.js](https://github.com/box/boxcli/blob/v2.2.0/src/commands/users/email-aliases/remove.js)_

## `box users:get [ID]`

Get information about a Box user

```
USAGE
  $ box users:get [ID]

ARGUMENTS
  ID  [default: me] ID of the user to get; defaults to the current user

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

_See code: [src/commands/users/get.js](https://github.com/box/boxcli/blob/v2.2.0/src/commands/users/get.js)_

## `box users:groups ID`

List groups a user belongs to

```
USAGE
  $ box users:groups ID

ARGUMENTS
  ID  ID of the user to get groups for

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
  $ box users:list-groups
```

_See code: [src/commands/users/groups.js](https://github.com/box/boxcli/blob/v2.2.0/src/commands/users/groups.js)_

## `box users:invite EMAIL ENTERPRISEID`

Invite an Existing Box User to Your Enterprise

```
USAGE
  $ box users:invite EMAIL ENTERPRISEID

ARGUMENTS
  EMAIL         Email address of the user to invite
  ENTERPRISEID  ID of the Enterprise to invite the user to

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
  $ box users:invite-user
```

_See code: [src/commands/users/invite.js](https://github.com/box/boxcli/blob/v2.2.0/src/commands/users/invite.js)_

## `box users:transfer-content USERID NEWUSERID`

Move a user's root content to another user

```
USAGE
  $ box users:transfer-content USERID NEWUSERID

ARGUMENTS
  USERID     User whose content should be moved
  NEWUSERID  User to whom the content should be moved

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
  --[no-]notify                          Notify the user that their content has been moved
  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box users:move-root-content
```

_See code: [src/commands/users/transfer-content.js](https://github.com/box/boxcli/blob/v2.2.0/src/commands/users/transfer-content.js)_

## `box users:update ID`

Update a Box User

```
USAGE
  $ box users:update ID

ARGUMENTS
  ID  User ID to update

OPTIONS
  -S, --status=active|inactive|cannot_delete_edit|cannot_delete_edit_upload  User status. Enter active, inactive,
                                                                             cannot_delete_edit, or
                                                                             cannot_delete_edit_upload

  -a, --address=address                                                      Address of the user

  -d, --disk-space=disk-space                                                User's available storage in bytes. Value of
                                                                             -1 grants unlimited storage

  -h, --help                                                                 Show CLI help

  -j, --job-title=job-title                                                  Job title of the user

  -l, --language=language                                                    Language of the user (ISO 639-1 Language
                                                                             Code).
                                                                             https://developer.box.com/v2.0/docs/api-lan
                                                                             guage-codes

  -n, --name=name                                                            Set the user's name

  -p, --phone-number=phone-number                                            Phone number of the user

  -r, --role=user|coadmin                                                    Role of user. Enter user or coadmin

  -s, --save                                                                 Save report to default reports folder on
                                                                             disk

  -t, --token=token                                                          Provide a token to perform this call

  -v, --verbose                                                              Show verbose output, which can be helpful
                                                                             for debugging

  -y, --yes                                                                  Automatically respond yes to all
                                                                             confirmation prompts

  --as-user=as-user                                                          Provide an ID for a user

  --avatar-url=avatar-url                                                    URL of the user's avatar image

  --bulk-file-path=bulk-file-path                                            File path to bulk .csv or .json objects

  --[no-]can-see-managed-users                                               User can see managed users

  --csv                                                                      Output formatted CSV

  --[no-]exempt-from-2fa                                                     Exempt user from two-factor auth

  --[no-]exempt-from-device-limits                                           Exempt user from device limits

  --fields=fields                                                            Comma separated list of fields to show

  --json                                                                     Output formatted JSON

  --login=login                                                              Change the user's primary email address
                                                                             used for logging into Box

  --no-color                                                                 Turn off colors for logging

  --password-reset                                                           Force the user to reset password

  --remove                                                                   Remove the user from the enterprise,
                                                                             convert to free account

  --[no-]restrict-external-collab                                            Restrict user from external collaboration

  --save-to-file-path=save-to-file-path                                      Override default file path to save report

  --[no-]sync-enable                                                         Enable Box Sync for this user

  --timezone=timezone                                                        The user's timezone. Input format follows
                                                                             tz database timezones
```

_See code: [src/commands/users/update.js](https://github.com/box/boxcli/blob/v2.2.0/src/commands/users/update.js)_
