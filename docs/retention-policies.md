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
  $ box retention-policies [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>] [-n <value>]
    [--policy-type finite|indefinite] [-u <value>]

FLAGS
  -h, --help                        Show CLI help
  -n, --policy-name=<value>         A name to filter the retention policies by
  -q, --quiet                       Suppress any non-error output to stderr
  -s, --save                        Save report to default reports folder on disk
  -t, --token=<value>               Provide a token to perform this call
  -u, --created-by-user-id=<value>  A user id to filter the retention policies by
  -v, --verbose                     Show verbose output, which can be helpful for debugging
  -y, --yes                         Automatically respond yes to all confirmation prompts
      --as-user=<value>             Provide an ID for a user
      --bulk-file-path=<value>      File path to bulk .csv or .json objects
      --csv                         Output formatted CSV
      --fields=<value>              Comma separated list of fields to show
      --json                        Output formatted JSON
      --max-items=<value>           A value that indicates the maximum number of results to return. This only specifies
                                    a maximum boundary and will not guarantee the minimum number of results returned.
                                    When the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests
                                    will be made.
      --no-color                    Turn off colors for logging
      --policy-type=<option>        A policy type to filter the retention policies by
                                    <options: finite|indefinite>
      --save-to-file-path=<value>   Override default file path to save report

DESCRIPTION
  List all retention policies for your enterprise

EXAMPLES
  $ box retention-policies
```

_See code: [src/commands/retention-policies/index.js](https://github.com/box/boxcli/blob/v4.5.0/src/commands/retention-policies/index.js)_

## `box retention-policies:assign POLICYID`

Assign a retention policy assignment

```
USAGE
  $ box retention-policies:assign POLICYID --assign-to-type enterprise|folder|metadata_template [-t <value>] [--as-user
    <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path
    <value>] [-h] [-v] [-y] [-q] [--assign-to-id <value>] [--filter-field <value>...] [--start-date-field <value>]

ARGUMENTS
  POLICYID  The ID of the retention policy to assign this content to

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --assign-to-id=<value>       The ID of the content to assign the retention policy to
      --assign-to-type=<option>    (required) The type of the content to assign the retention policy to
                                   <options: enterprise|folder|metadata_template>
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --filter-field=<value>...    Metadata fields to filter against, if assigning to a metadata template.Allow
                                   properties: field, value. Example: --filter-field=fieldName=fieldValue
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report
      --start-date-field=<value>   The date the retention policy assignment begins

DESCRIPTION
  Assign a retention policy assignment

EXAMPLES
  $ box retention-policies:assign 12345 --assign-to-type folder --assign-to-id 22222 --filter-field=fieldName=fieldValue --start-date-field=upload_date
```

_See code: [src/commands/retention-policies/assign.js](https://github.com/box/boxcli/blob/v4.5.0/src/commands/retention-policies/assign.js)_

## `box retention-policies:assignments ID`

List all retention policies for your enterprise

```
USAGE
  $ box retention-policies:assignments ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>] [--type
    folder|enterprise|metadata_template]

ARGUMENTS
  ID  ID of the retention policy to get assignments for

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
      --type=<option>              The type of the retention policy assignment to retrieve
                                   <options: folder|enterprise|metadata_template>

DESCRIPTION
  List all retention policies for your enterprise

EXAMPLES
  $ box retention-policies:assignments 12345
```

_See code: [src/commands/retention-policies/assignments/index.js](https://github.com/box/boxcli/blob/v4.5.0/src/commands/retention-policies/assignments/index.js)_

## `box retention-policies:assignments:get ID`

Get information about a retention policy assignment

```
USAGE
  $ box retention-policies:assignments:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the retention policy assignment to get

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
  Get information about a retention policy assignment

EXAMPLES
  $ box retention-policies:assignments:get 1235
```

_See code: [src/commands/retention-policies/assignments/get.js](https://github.com/box/boxcli/blob/v4.5.0/src/commands/retention-policies/assignments/get.js)_

## `box retention-policies:assignments:remove ID`

Remove a retention policy assignment applied to content

```
USAGE
  $ box retention-policies:assignments:remove ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the retention policy assignment to remove

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
  Remove a retention policy assignment applied to content

EXAMPLES
  $ box retention-policies:assignments:remove 1235
```

_See code: [src/commands/retention-policies/assignments/remove.js](https://github.com/box/boxcli/blob/v4.5.0/src/commands/retention-policies/assignments/remove.js)_

## `box retention-policies:create POLICYNAME`

Create a new retention policy

```
USAGE
  $ box retention-policies:create POLICYNAME --disposition-action permanently_delete|remove_retention [-t <value>] [--as-user
    <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path
    <value>] [-h] [-v] [-y] [-q] [--notify-owners] [--allow-extension] [-l <value>] [--retention-type
    modifiable|non_modifiable |  | ] [--description <value>] [--custom-notification-recipient <value>...]

ARGUMENTS
  POLICYNAME  Name of retention policy to be created

FLAGS
  -h, --help                                      Show CLI help
  -l, --retention-length=<value>                  The number of days to apply the retention policy. If not set, policy
                                                  will be indefinite
  -q, --quiet                                     Suppress any non-error output to stderr
  -s, --save                                      Save report to default reports folder on disk
  -t, --token=<value>                             Provide a token to perform this call
  -v, --verbose                                   Show verbose output, which can be helpful for debugging
  -y, --yes                                       Automatically respond yes to all confirmation prompts
      --[no-]allow-extension                      The owner of a file will be allowed to extend the retention
      --as-user=<value>                           Provide an ID for a user
      --bulk-file-path=<value>                    File path to bulk .csv or .json objects
      --csv                                       Output formatted CSV
      --custom-notification-recipient=<value>...  A list of users notified when the retention policy duration is about
                                                  to end. Allowed properties are: id, type, login, name
      --description=<value>                       The additional text description of the retention policy
      --disposition-action=<option>               (required) For indefinite policies, disposition action must be
                                                  remove_retention
                                                  <options: permanently_delete|remove_retention>
      --fields=<value>                            Comma separated list of fields to show
      --json                                      Output formatted JSON
      --no-color                                  Turn off colors for logging
      --[no-]notify-owners                        The owner or co-owner will get notified when a file is nearing
                                                  expiration
      --retention-type=<option>                   The type of retention for the new policy
                                                  <options: modifiable|non_modifiable>
      --save-to-file-path=<value>                 Override default file path to save report

DESCRIPTION
  Create a new retention policy

EXAMPLES
  $ box retention-policies:create "Tax Documents" --retention-length 2555 --disposition-action=remove_retention --notify-owners --allow-extension --description "Tax documents for 2018" --custom-notification-recipient=id=12345,login=user@box.com
```

_See code: [src/commands/retention-policies/create.js](https://github.com/box/boxcli/blob/v4.5.0/src/commands/retention-policies/create.js)_

## `box retention-policies:file-version-retentions`

List all file version retentions for your enterprise

```
USAGE
  $ box retention-policies:file-version-retentions [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]
    [--disposition-action permanently_delete|remove_retention] [--disposition-after <value>] [--disposition-before
    <value>] [--file-id <value>] [--file-version-id <value>] [--policy-id <value>]

FLAGS
  -h, --help                         Show CLI help
  -q, --quiet                        Suppress any non-error output to stderr
  -s, --save                         Save report to default reports folder on disk
  -t, --token=<value>                Provide a token to perform this call
  -v, --verbose                      Show verbose output, which can be helpful for debugging
  -y, --yes                          Automatically respond yes to all confirmation prompts
      --as-user=<value>              Provide an ID for a user
      --bulk-file-path=<value>       File path to bulk .csv or .json objects
      --csv                          Output formatted CSV
      --disposition-action=<option>  A disposition action to filter by
                                     <options: permanently_delete|remove_retention>
      --disposition-after=<value>    A date to filter retention policies that complete after a certain time
      --disposition-before=<value>   A date to filter retention policies that complete before a certain time
      --fields=<value>               Comma separated list of fields to show
      --file-id=<value>              A file id to filter the file version retentions by
      --file-version-id=<value>      A file version id to filter the file version retentions by
      --json                         Output formatted JSON
      --max-items=<value>            A value that indicates the maximum number of results to return. This only specifies
                                     a maximum boundary and will not guarantee the minimum number of results returned.
                                     When the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests
                                     will be made.
      --no-color                     Turn off colors for logging
      --policy-id=<value>            A policy id to filter the file version retentions by
      --save-to-file-path=<value>    Override default file path to save report

DESCRIPTION
  List all file version retentions for your enterprise

EXAMPLES
  $ box retention-policies:file-version-retentions
```

_See code: [src/commands/retention-policies/file-version-retentions/index.js](https://github.com/box/boxcli/blob/v4.5.0/src/commands/retention-policies/file-version-retentions/index.js)_

## `box retention-policies:file-version-retentions:get ID`

Get information about a file version retention policy

```
USAGE
  $ box retention-policies:file-version-retentions:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the file version retention to get

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
  Get information about a file version retention policy

EXAMPLES
  $ box retention-policies:file-version-retentions:get 77777
```

_See code: [src/commands/retention-policies/file-version-retentions/get.js](https://github.com/box/boxcli/blob/v4.5.0/src/commands/retention-policies/file-version-retentions/get.js)_

## `box retention-policies:file-versions-under-retention:get ID`

Get information about file versions under retention for assignment

```
USAGE
  $ box retention-policies:file-versions-under-retention:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

ARGUMENTS
  ID  ID of the retention policy assignment

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
  Get information about file versions under retention for assignment

EXAMPLES
  $ box retention-policies:file-versions-under-retention:get 77777
```

_See code: [src/commands/retention-policies/file-versions-under-retention/get.js](https://github.com/box/boxcli/blob/v4.5.0/src/commands/retention-policies/file-versions-under-retention/get.js)_

## `box retention-policies:files-under-retention:get ID`

Get information about files under retention for assignment

```
USAGE
  $ box retention-policies:files-under-retention:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

ARGUMENTS
  ID  ID of the retention policy assignment

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
  Get information about files under retention for assignment

EXAMPLES
  $ box retention-policies:files-under-retention:get 77777
```

_See code: [src/commands/retention-policies/files-under-retention/get.js](https://github.com/box/boxcli/blob/v4.5.0/src/commands/retention-policies/files-under-retention/get.js)_

## `box retention-policies:get ID`

Get information about a retention policy

```
USAGE
  $ box retention-policies:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the retention policy to get

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
  Get information about a retention policy

EXAMPLES
  $ box retention-policies:get 12345
```

_See code: [src/commands/retention-policies/get.js](https://github.com/box/boxcli/blob/v4.5.0/src/commands/retention-policies/get.js)_

## `box retention-policies:update ID`

Update a retention policy

```
USAGE
  $ box retention-policies:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [-a <value>] [-n <value>] [--policy-type
    finite|indefinite] [-l <value>] [--non-modifiable] [-r] [--notify-owners] [--allow-extension]

ARGUMENTS
  ID  ID of the retention policy to update

FLAGS
  -a, --disposition-action=<value>  For indefinite policies, disposition action must be remove_retention
  -h, --help                        Show CLI help
  -l, --retention-length=<value>    The amount of time, in days, to apply the retention policy. Required for finite
                                    policies
  -n, --policy-name=<value>         New name of retention policy
  -q, --quiet                       Suppress any non-error output to stderr
  -r, --retire                      Retire a retention policy
  -s, --save                        Save report to default reports folder on disk
  -t, --token=<value>               Provide a token to perform this call
  -v, --verbose                     Show verbose output, which can be helpful for debugging
  -y, --yes                         Automatically respond yes to all confirmation prompts
      --[no-]allow-extension        The owner of a file will be allowed to extend the retention
      --as-user=<value>             Provide an ID for a user
      --bulk-file-path=<value>      File path to bulk .csv or .json objects
      --csv                         Output formatted CSV
      --fields=<value>              Comma separated list of fields to show
      --json                        Output formatted JSON
      --no-color                    Turn off colors for logging
      --non-modifiable              Set retention type to non_modifiable.
      --[no-]notify-owners          The owner or co-owner will get notified when a file is nearing expiration
      --policy-type=<option>        Type of policy
                                    <options: finite|indefinite>
      --save-to-file-path=<value>   Override default file path to save report

DESCRIPTION
  Update a retention policy

EXAMPLES
  $ box retention-policies:update 12345
```

_See code: [src/commands/retention-policies/update.js](https://github.com/box/boxcli/blob/v4.5.0/src/commands/retention-policies/update.js)_
