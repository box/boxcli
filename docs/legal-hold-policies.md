`box legal-hold-policies`
=========================

List legal hold policies

* [`box legal-hold-policies`](#box-legal-hold-policies)
* [`box legal-hold-policies:assign POLICYID`](#box-legal-hold-policiesassign-policyid)
* [`box legal-hold-policies:assignments ID`](#box-legal-hold-policiesassignments-id)
* [`box legal-hold-policies:assignments:delete ID`](#box-legal-hold-policiesassignmentsdelete-id)
* [`box legal-hold-policies:assignments:get ID`](#box-legal-hold-policiesassignmentsget-id)
* [`box legal-hold-policies:create POLICYNAME`](#box-legal-hold-policiescreate-policyname)
* [`box legal-hold-policies:delete ID`](#box-legal-hold-policiesdelete-id)
* [`box legal-hold-policies:file-version-holds ID`](#box-legal-hold-policiesfile-version-holds-id)
* [`box legal-hold-policies:file-version-holds:get ID`](#box-legal-hold-policiesfile-version-holdsget-id)
* [`box legal-hold-policies:get ID`](#box-legal-hold-policiesget-id)
* [`box legal-hold-policies:update ID`](#box-legal-hold-policiesupdate-id)

## `box legal-hold-policies`

List legal hold policies

```
USAGE
  $ box legal-hold-policies [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>] [--policy-name
    <value>]

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
      --policy-name=<value>        Filter by policy name
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List legal hold policies

EXAMPLES
  $ box legal-hold-policies
```

_See code: [src/commands/legal-hold-policies/index.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/legal-hold-policies/index.js)_

## `box legal-hold-policies:assign POLICYID`

Create a new policy assignment

```
USAGE
  $ box legal-hold-policies:assign POLICYID --assign-to-type file_version|file|folder|user --assign-to-id <value> [-t <value>]
    [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path <value>] [--fields <value>]
    [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  POLICYID  ID of the legal hold policy to assign

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --assign-to-id=<value>       (required) ID of the object to assign the policy to
      --assign-to-type=<option>    (required) Type of object to assign the policy to
                                   <options: file_version|file|folder|user>
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Create a new policy assignment

EXAMPLES
  $ box legal-hold-policies:assign 99999 --assign-to-type folder --assign-to-id 22222
```

_See code: [src/commands/legal-hold-policies/assign.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/legal-hold-policies/assign.js)_

## `box legal-hold-policies:assignments ID`

List policy assignments

```
USAGE
  $ box legal-hold-policies:assignments ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>] [--assign-to-type
    file_version|file|folder|user] [--assign-to-id <value>]

ARGUMENTS
  ID  ID of the legal hold policy get get assignments for

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --assign-to-id=<value>       Filter by assignment Id
      --assign-to-type=<option>    Filter by assignment type
                                   <options: file_version|file|folder|user>
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
  List policy assignments

EXAMPLES
  $ box legal-hold-policies:assignments 99999
```

_See code: [src/commands/legal-hold-policies/assignments/index.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/legal-hold-policies/assignments/index.js)_

## `box legal-hold-policies:assignments:delete ID`

Delete a policy assignment

```
USAGE
  $ box legal-hold-policies:assignments:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the policy assignment to delete

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
  Delete a policy assignment

EXAMPLES
  $ box legal-hold-policies:assignments:delete 99999
```

_See code: [src/commands/legal-hold-policies/assignments/delete.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/legal-hold-policies/assignments/delete.js)_

## `box legal-hold-policies:assignments:get ID`

Get information about a policy assignment

```
USAGE
  $ box legal-hold-policies:assignments:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the policy assignment to get

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
  Get information about a policy assignment

EXAMPLES
  $ box legal-hold-policies:assignments:get 99999
```

_See code: [src/commands/legal-hold-policies/assignments/get.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/legal-hold-policies/assignments/get.js)_

## `box legal-hold-policies:create POLICYNAME`

Create a new legal hold policy

```
USAGE
  $ box legal-hold-policies:create POLICYNAME [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--description
    <value>] [--ongoing | [--filter-started-at <value> --filter-ended-at <value>] | ]

ARGUMENTS
  POLICYNAME  Name of the legal hold policy

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
      --description=<value>        Description of legal hold policy
      --fields=<value>             Comma separated list of fields to show
      --filter-ended-at=<value>    Date filter applies to Custodian assignments only. Should be today's date or before.
                                   Use a RFC3339 timestamp or shorthand syntax 0t, like -5w for 5 weeks ago
      --filter-started-at=<value>  Date filter applies to Custodian assignments only. Should be today's date or before.
                                   Use a RFC3339 timestamp or shorthand syntax 0t, like -5w for 5 weeks ago
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --ongoing                    Assignments under this policy will continue applying to files based on events,
                                   indefinitely
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Create a new legal hold policy

EXAMPLES
  $ box legal-hold-policies:create "Class Action Suit" --ongoing
```

_See code: [src/commands/legal-hold-policies/create.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/legal-hold-policies/create.js)_

## `box legal-hold-policies:delete ID`

Delete a legal hold policy

```
USAGE
  $ box legal-hold-policies:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the legal hold policy to delete

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
  Delete a legal hold policy

EXAMPLES
  $ box legal-hold-policies:delete 99999
```

_See code: [src/commands/legal-hold-policies/delete.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/legal-hold-policies/delete.js)_

## `box legal-hold-policies:file-version-holds ID`

List file version legal holds for a legal hold policy

```
USAGE
  $ box legal-hold-policies:file-version-holds ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

ARGUMENTS
  ID  ID of the legal hold policy to get holds for

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
  List file version legal holds for a legal hold policy

EXAMPLES
  $ box legal-hold-policies:file-version-holds 99999
```

_See code: [src/commands/legal-hold-policies/file-version-holds/index.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/legal-hold-policies/file-version-holds/index.js)_

## `box legal-hold-policies:file-version-holds:get ID`

Get information about a file version legal hold

```
USAGE
  $ box legal-hold-policies:file-version-holds:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the file version legal hold to get

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
  Get information about a file version legal hold

EXAMPLES
  $ box legal-hold-policies:file-version-holds:get 12345
```

_See code: [src/commands/legal-hold-policies/file-version-holds/get.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/legal-hold-policies/file-version-holds/get.js)_

## `box legal-hold-policies:get ID`

Get information about a legal hold policy

```
USAGE
  $ box legal-hold-policies:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the legal hold policy to get

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
  Get information about a legal hold policy

EXAMPLES
  $ box legal-hold-policies:get 99999
```

_See code: [src/commands/legal-hold-policies/get.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/legal-hold-policies/get.js)_

## `box legal-hold-policies:update ID`

Update a legal hold policy

```
USAGE
  $ box legal-hold-policies:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--description <value>] [--policy-name
    <value>] [--release-notes <value>]

ARGUMENTS
  ID  ID of a legal hold policy to update

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
      --description=<value>        Description of legal hold policy. Max characters 500
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --policy-name=<value>        Name of legal hold policy. Max characters 254
      --release-notes=<value>      Notes around why the policy was released. Max characters 500
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Update a legal hold policy

EXAMPLES
  $ box legal-hold-policies:update 99999 --description "Files related to the ongoing class action suit"
```

_See code: [src/commands/legal-hold-policies/update.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/legal-hold-policies/update.js)_
