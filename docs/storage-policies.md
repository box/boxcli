`box storage-policies`
======================

List storage policies

* [`box storage-policies`](#box-storage-policies)
* [`box storage-policies:assign STORAGEPOLICYID USERID`](#box-storage-policiesassign-storagepolicyid-userid)
* [`box storage-policies:assignments:get ID`](#box-storage-policiesassignmentsget-id)
* [`box storage-policies:assignments:lookup ID`](#box-storage-policiesassignmentslookup-id)
* [`box storage-policies:assignments:remove ID`](#box-storage-policiesassignmentsremove-id)
* [`box storage-policies:get ID`](#box-storage-policiesget-id)
* [`box storage-policies:list`](#box-storage-policieslist)

## `box storage-policies`

List storage policies

```
USAGE
  $ box storage-policies [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

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
  List storage policies

ALIASES
  $ box storage-policies:list

EXAMPLES
  $ box storage-policies
```

_See code: [src/commands/storage-policies/index.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/storage-policies/index.js)_

## `box storage-policies:assign STORAGEPOLICYID USERID`

Assign a storage policy

```
USAGE
  $ box storage-policies:assign STORAGEPOLICYID USERID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  STORAGEPOLICYID  Id of the storage policy
  USERID           Id of the user to assign the storage policy to

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
  Assign a storage policy

EXAMPLES
  $ box storage-policies:assign 12345 33333
```

_See code: [src/commands/storage-policies/assign.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/storage-policies/assign.js)_

## `box storage-policies:assignments:get ID`

Get information on a storage policy assignment

```
USAGE
  $ box storage-policies:assignments:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the storage policy assignment to get

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
  Get information on a storage policy assignment

EXAMPLES
  $ box storage-policies:assignments:get 12345
```

_See code: [src/commands/storage-policies/assignments/get.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/storage-policies/assignments/get.js)_

## `box storage-policies:assignments:lookup ID`

Look up which storage policy an object is assigned to

```
USAGE
  $ box storage-policies:assignments:lookup ID --type user|enterprise [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s
    | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the object to look up the storage policy for

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
      --type=<option>              (required) [default: user] Type of object to look up the storage policy for
                                   <options: user|enterprise>

DESCRIPTION
  Look up which storage policy an object is assigned to

EXAMPLES
  $ box storage-policies:assignments:lookup 33333
```

_See code: [src/commands/storage-policies/assignments/lookup.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/storage-policies/assignments/lookup.js)_

## `box storage-policies:assignments:remove ID`

Delete a storage policy assignment

```
USAGE
  $ box storage-policies:assignments:remove ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the storage policy assignment to delete

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
  Delete a storage policy assignment

EXAMPLES
  $ box storage-policies:assignments:remove 12345
```

_See code: [src/commands/storage-policies/assignments/remove.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/storage-policies/assignments/remove.js)_

## `box storage-policies:get ID`

Get information on a storage policy

```
USAGE
  $ box storage-policies:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the storage policy to get

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
  Get information on a storage policy

EXAMPLES
  $ box storage-policies:get 12345
```

_See code: [src/commands/storage-policies/get.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/storage-policies/get.js)_

## `box storage-policies:list`

List storage policies

```
USAGE
  $ box storage-policies:list [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

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
  List storage policies

ALIASES
  $ box storage-policies:list

EXAMPLES
  $ box storage-policies
```
