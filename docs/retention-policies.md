`box retention-policies`
========================

List all retention policies for your enterprise

* [`box retention-policies`](#box-retention-policies)
* [`box retention-policies:assign POLICYID`](#box-retention-policiesassign-policyid)
* [`box retention-policies:assignments ID`](#box-retention-policiesassignments-id)
* [`box retention-policies:assignments:get ID`](#box-retention-policiesassignmentsget-id)
* [`box retention-policies:assignments:remove ID`](#box-retention-policiesassignmentsremove-id)
* [`box retention-policies:create POLICYNAME`](#box-retention-policiescreate-policyname)
* [`box retention-policies:file-version-retentions`](#box-retention-policiesfile-version-retentions)
* [`box retention-policies:file-version-retentions:get ID`](#box-retention-policiesfile-version-retentionsget-id)
* [`box retention-policies:file-versions-under-retention:get ID`](#box-retention-policiesfile-versions-under-retentionget-id)
* [`box retention-policies:files-under-retention:get ID`](#box-retention-policiesfiles-under-retentionget-id)
* [`box retention-policies:get ID`](#box-retention-policiesget-id)
* [`box retention-policies:update ID`](#box-retention-policiesupdate-id)

## `box retention-policies`

List all retention policies for your enterprise

```
USAGE
  $ box retention-policies

OPTIONS
  -h, --help                                   Show CLI help
  -n, --policy-name=policy-name                A name to filter the retention policies by
  -q, --quiet                                  Suppress any non-error output to stderr
  -s, --save                                   Save report to default reports folder on disk
  -t, --token=token                            Provide a token to perform this call
  -u, --created-by-user-id=created-by-user-id  A user id to filter the retention policies by
  -v, --verbose                                Show verbose output, which can be helpful for debugging
  -y, --yes                                    Automatically respond yes to all confirmation prompts
  --as-user=as-user                            Provide an ID for a user
  --bulk-file-path=bulk-file-path              File path to bulk .csv or .json objects
  --csv                                        Output formatted CSV
  --fields=fields                              Comma separated list of fields to show
  --json                                       Output formatted JSON
  --no-color                                   Turn off colors for logging
  --policy-type=finite|indefinite              A policy type to filter the retention policies by
  --save-to-file-path=save-to-file-path        Override default file path to save report

EXAMPLE
  box retention-policies
```

_See code: [src/commands/retention-policies/index.js](https://github.com/box/boxcli/blob/v3.5.0/src/commands/retention-policies/index.js)_

## `box retention-policies:assign POLICYID`

Assign a retention policy assignment

```
USAGE
  $ box retention-policies:assign POLICYID

ARGUMENTS
  POLICYID  The ID of the retention policy to assign this content to

OPTIONS
  -h, --help                                            Show CLI help
  -q, --quiet                                           Suppress any non-error output to stderr
  -s, --save                                            Save report to default reports folder on disk
  -t, --token=token                                     Provide a token to perform this call
  -v, --verbose                                         Show verbose output, which can be helpful for debugging
  -y, --yes                                             Automatically respond yes to all confirmation prompts
  --as-user=as-user                                     Provide an ID for a user
  --assign-to-id=assign-to-id                           The ID of the content to assign the retention policy to

  --assign-to-type=enterprise|folder|metadata_template  (required) The type of the content to assign the retention
                                                        policy to

  --bulk-file-path=bulk-file-path                       File path to bulk .csv or .json objects

  --csv                                                 Output formatted CSV

  --fields=fields                                       Comma separated list of fields to show

  --json                                                Output formatted JSON

  --no-color                                            Turn off colors for logging

  --save-to-file-path=save-to-file-path                 Override default file path to save report

EXAMPLE
  box retention-policies:assign 12345 --assign-to-type folder --assign-to-id 22222
```

_See code: [src/commands/retention-policies/assign.js](https://github.com/box/boxcli/blob/v3.5.0/src/commands/retention-policies/assign.js)_

## `box retention-policies:assignments ID`

List all retention policies for your enterprise

```
USAGE
  $ box retention-policies:assignments ID

ARGUMENTS
  ID  ID of the retention policy to get assignments for

OPTIONS
  -h, --help                                  Show CLI help
  -q, --quiet                                 Suppress any non-error output to stderr
  -s, --save                                  Save report to default reports folder on disk
  -t, --token=token                           Provide a token to perform this call
  -v, --verbose                               Show verbose output, which can be helpful for debugging
  -y, --yes                                   Automatically respond yes to all confirmation prompts
  --as-user=as-user                           Provide an ID for a user
  --bulk-file-path=bulk-file-path             File path to bulk .csv or .json objects
  --csv                                       Output formatted CSV
  --fields=fields                             Comma separated list of fields to show
  --json                                      Output formatted JSON
  --no-color                                  Turn off colors for logging
  --save-to-file-path=save-to-file-path       Override default file path to save report
  --type=folder|enterprise|metadata_template  The type of the retention policy assignment to retrieve

EXAMPLE
  box retention-policies:assignments 12345
```

_See code: [src/commands/retention-policies/assignments/index.js](https://github.com/box/boxcli/blob/v3.5.0/src/commands/retention-policies/assignments/index.js)_

## `box retention-policies:assignments:get ID`

Get information about a retention policy assignment

```
USAGE
  $ box retention-policies:assignments:get ID

ARGUMENTS
  ID  ID of the retention policy assignment to get

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
  box retention-policies:assignments:get 1235
```

_See code: [src/commands/retention-policies/assignments/get.js](https://github.com/box/boxcli/blob/v3.5.0/src/commands/retention-policies/assignments/get.js)_

## `box retention-policies:assignments:remove ID`

Remove a retention policy assignment applied to content

```
USAGE
  $ box retention-policies:assignments:remove ID

ARGUMENTS
  ID  ID of the retention policy assignment to remove

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
  box retention-policies:assignments:remove 1235
```

_See code: [src/commands/retention-policies/assignments/remove.js](https://github.com/box/boxcli/blob/v3.5.0/src/commands/retention-policies/assignments/remove.js)_

## `box retention-policies:create POLICYNAME`

Create a new retention policy

```
USAGE
  $ box retention-policies:create POLICYNAME

ARGUMENTS
  POLICYNAME  Name of retention policy to be created

OPTIONS
  -h, --help                                                Show CLI help

  -l, --retention-length=retention-length                   The number of days to apply the retention policy. If not
                                                            set, policy will be indefinite

  -q, --quiet                                               Suppress any non-error output to stderr

  -s, --save                                                Save report to default reports folder on disk

  -t, --token=token                                         Provide a token to perform this call

  -v, --verbose                                             Show verbose output, which can be helpful for debugging

  -y, --yes                                                 Automatically respond yes to all confirmation prompts

  --[no-]allow-extension                                    The owner of a file will be allowed to extend the retention

  --as-user=as-user                                         Provide an ID for a user

  --bulk-file-path=bulk-file-path                           File path to bulk .csv or .json objects

  --csv                                                     Output formatted CSV

  --disposition-action=permanently_delete|remove_retention  (required) For indefinite policies, disposition action must
                                                            be remove_retention

  --fields=fields                                           Comma separated list of fields to show

  --json                                                    Output formatted JSON

  --no-color                                                Turn off colors for logging

  --[no-]notify-owners                                      The owner or co-owner will get notified when a file is
                                                            nearing expiration

  --retention-type=modifiable|non_modifiable                The type of retention for the new policy

  --save-to-file-path=save-to-file-path                     Override default file path to save report

EXAMPLE
  box retention-policies:create "Tax Documents" --retention-length 2555 --retention-type "non_modifiable" 
  --disposition-action permanently_delete
```

_See code: [src/commands/retention-policies/create.js](https://github.com/box/boxcli/blob/v3.5.0/src/commands/retention-policies/create.js)_

## `box retention-policies:file-version-retentions`

List all file version retentions for your enterprise

```
USAGE
  $ box retention-policies:file-version-retentions

OPTIONS
  -h, --help                                                Show CLI help
  -q, --quiet                                               Suppress any non-error output to stderr
  -s, --save                                                Save report to default reports folder on disk
  -t, --token=token                                         Provide a token to perform this call
  -v, --verbose                                             Show verbose output, which can be helpful for debugging
  -y, --yes                                                 Automatically respond yes to all confirmation prompts
  --as-user=as-user                                         Provide an ID for a user
  --bulk-file-path=bulk-file-path                           File path to bulk .csv or .json objects
  --csv                                                     Output formatted CSV
  --disposition-action=permanently_delete|remove_retention  A disposition action to filter by

  --disposition-after=disposition-after                     A date to filter retention policies that complete after a
                                                            certain time

  --disposition-before=disposition-before                   A date to filter retention policies that complete before a
                                                            certain time

  --fields=fields                                           Comma separated list of fields to show

  --file-id=file-id                                         A file id to filter the file version retentions by

  --file-version-id=file-version-id                         A file version id to filter the file version retentions by

  --json                                                    Output formatted JSON

  --no-color                                                Turn off colors for logging

  --policy-id=policy-id                                     A policy id to filter the file version retentions by

  --save-to-file-path=save-to-file-path                     Override default file path to save report

EXAMPLE
  box retention-policies:file-version-retentions
```

_See code: [src/commands/retention-policies/file-version-retentions/index.js](https://github.com/box/boxcli/blob/v3.5.0/src/commands/retention-policies/file-version-retentions/index.js)_

## `box retention-policies:file-version-retentions:get ID`

Get information about a file version retention policy

```
USAGE
  $ box retention-policies:file-version-retentions:get ID

ARGUMENTS
  ID  ID of the file version retention to get

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
  box retention-policies:file-version-retentions:get 77777
```

_See code: [src/commands/retention-policies/file-version-retentions/get.js](https://github.com/box/boxcli/blob/v3.5.0/src/commands/retention-policies/file-version-retentions/get.js)_

## `box retention-policies:file-versions-under-retention:get ID`

Get information about file versions under retention for assignment

```
USAGE
  $ box retention-policies:file-versions-under-retention:get ID

ARGUMENTS
  ID  ID of the retention policy assignment

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
  box retention-policies:file-versions-under-retention:get 77777
```

_See code: [src/commands/retention-policies/file-versions-under-retention/get.js](https://github.com/box/boxcli/blob/v3.5.0/src/commands/retention-policies/file-versions-under-retention/get.js)_

## `box retention-policies:files-under-retention:get ID`

Get information about files under retention for assignment

```
USAGE
  $ box retention-policies:files-under-retention:get ID

ARGUMENTS
  ID  ID of the retention policy assignment

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
  box retention-policies:files-under-retention:get 77777
```

_See code: [src/commands/retention-policies/files-under-retention/get.js](https://github.com/box/boxcli/blob/v3.5.0/src/commands/retention-policies/files-under-retention/get.js)_

## `box retention-policies:get ID`

Get information about a retention policy

```
USAGE
  $ box retention-policies:get ID

ARGUMENTS
  ID  ID of the retention policy to get

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
  box retention-policies:get 12345
```

_See code: [src/commands/retention-policies/get.js](https://github.com/box/boxcli/blob/v3.5.0/src/commands/retention-policies/get.js)_

## `box retention-policies:update ID`

Update a retention policy

```
USAGE
  $ box retention-policies:update ID

ARGUMENTS
  ID  ID of the retention policy to update

OPTIONS
  -a, --disposition-action=disposition-action  For indefinite policies, disposition action must be remove_retention
  -h, --help                                   Show CLI help

  -l, --retention-length=retention-length      The amount of time, in days, to apply the retention policy. Required for
                                               finite policies

  -n, --policy-name=policy-name                New name of retention policy

  -q, --quiet                                  Suppress any non-error output to stderr

  -r, --retire                                 Retire a retention policy

  -s, --save                                   Save report to default reports folder on disk

  -t, --token=token                            Provide a token to perform this call

  -v, --verbose                                Show verbose output, which can be helpful for debugging

  -y, --yes                                    Automatically respond yes to all confirmation prompts

  --[no-]allow-extension                       The owner of a file will be allowed to extend the retention

  --as-user=as-user                            Provide an ID for a user

  --bulk-file-path=bulk-file-path              File path to bulk .csv or .json objects

  --csv                                        Output formatted CSV

  --fields=fields                              Comma separated list of fields to show

  --json                                       Output formatted JSON

  --no-color                                   Turn off colors for logging

  --non-modifiable                             Set retention type to non_modifiable.

  --[no-]notify-owners                         The owner or co-owner will get notified when a file is nearing expiration

  --policy-type=finite|indefinite              Type of policy

  --save-to-file-path=save-to-file-path        Override default file path to save report

EXAMPLE
  box retention-policies:update 12345
```

_See code: [src/commands/retention-policies/update.js](https://github.com/box/boxcli/blob/v3.5.0/src/commands/retention-policies/update.js)_
