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
  $ box legal-hold-policies

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
  --policy-name=policy-name              Filter by policy name
  --save-to-file-path=save-to-file-path  Override default file path to save report

EXAMPLE
  box legal-hold-policies
```

_See code: [src/commands/legal-hold-policies/index.js](https://github.com/box/boxcli/blob/v3.5.0/src/commands/legal-hold-policies/index.js)_

## `box legal-hold-policies:assign POLICYID`

Create a new policy assignment

```
USAGE
  $ box legal-hold-policies:assign POLICYID

ARGUMENTS
  POLICYID  ID of the legal hold policy to assign

OPTIONS
  -h, --help                                      Show CLI help
  -q, --quiet                                     Suppress any non-error output to stderr
  -s, --save                                      Save report to default reports folder on disk
  -t, --token=token                               Provide a token to perform this call
  -v, --verbose                                   Show verbose output, which can be helpful for debugging
  -y, --yes                                       Automatically respond yes to all confirmation prompts
  --as-user=as-user                               Provide an ID for a user
  --assign-to-id=assign-to-id                     (required) ID of the object to assign the policy to
  --assign-to-type=file_version|file|folder|user  (required) Type of object to assign the policy to
  --bulk-file-path=bulk-file-path                 File path to bulk .csv or .json objects
  --csv                                           Output formatted CSV
  --fields=fields                                 Comma separated list of fields to show
  --json                                          Output formatted JSON
  --no-color                                      Turn off colors for logging
  --save-to-file-path=save-to-file-path           Override default file path to save report

EXAMPLE
  box legal-hold-policies:assign 99999 --assign-to-type folder --assign-to-id 22222
```

_See code: [src/commands/legal-hold-policies/assign.js](https://github.com/box/boxcli/blob/v3.5.0/src/commands/legal-hold-policies/assign.js)_

## `box legal-hold-policies:assignments ID`

List policy assignments

```
USAGE
  $ box legal-hold-policies:assignments ID

ARGUMENTS
  ID  ID of the legal hold policy get get assignments for

OPTIONS
  -h, --help                                      Show CLI help
  -q, --quiet                                     Suppress any non-error output to stderr
  -s, --save                                      Save report to default reports folder on disk
  -t, --token=token                               Provide a token to perform this call
  -v, --verbose                                   Show verbose output, which can be helpful for debugging
  -y, --yes                                       Automatically respond yes to all confirmation prompts
  --as-user=as-user                               Provide an ID for a user
  --assign-to-id=assign-to-id                     Filter by assignment Id
  --assign-to-type=file_version|file|folder|user  Filter by assignment type
  --bulk-file-path=bulk-file-path                 File path to bulk .csv or .json objects
  --csv                                           Output formatted CSV
  --fields=fields                                 Comma separated list of fields to show
  --json                                          Output formatted JSON
  --no-color                                      Turn off colors for logging
  --save-to-file-path=save-to-file-path           Override default file path to save report

EXAMPLE
  box legal-hold-policies:assignments 99999
```

_See code: [src/commands/legal-hold-policies/assignments/index.js](https://github.com/box/boxcli/blob/v3.5.0/src/commands/legal-hold-policies/assignments/index.js)_

## `box legal-hold-policies:assignments:delete ID`

Delete a policy assignment

```
USAGE
  $ box legal-hold-policies:assignments:delete ID

ARGUMENTS
  ID  ID of the policy assignment to delete

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
  box legal-hold-policies:assignments:delete 99999
```

_See code: [src/commands/legal-hold-policies/assignments/delete.js](https://github.com/box/boxcli/blob/v3.5.0/src/commands/legal-hold-policies/assignments/delete.js)_

## `box legal-hold-policies:assignments:get ID`

Get information about a policy assignment

```
USAGE
  $ box legal-hold-policies:assignments:get ID

ARGUMENTS
  ID  ID of the policy assignment to get

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
  box legal-hold-policies:assignments:get 99999
```

_See code: [src/commands/legal-hold-policies/assignments/get.js](https://github.com/box/boxcli/blob/v3.5.0/src/commands/legal-hold-policies/assignments/get.js)_

## `box legal-hold-policies:create POLICYNAME`

Create a new legal hold policy

```
USAGE
  $ box legal-hold-policies:create POLICYNAME

ARGUMENTS
  POLICYNAME  Name of the legal hold policy

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
  --description=description              Description of legal hold policy
  --fields=fields                        Comma separated list of fields to show

  --filter-ended-at=filter-ended-at      Date filter applies to Custodian assignments only. Should be today's date or
                                         before. Use a RFC3339 timestamp or shorthand syntax 0t, like -5w for 5 weeks
                                         ago

  --filter-started-at=filter-started-at  Date filter applies to Custodian assignments only. Should be today's date or
                                         before. Use a RFC3339 timestamp or shorthand syntax 0t, like -5w for 5 weeks
                                         ago

  --json                                 Output formatted JSON

  --no-color                             Turn off colors for logging

  --ongoing                              Assignments under this policy will continue applying to files based on events,
                                         indefinitely

  --save-to-file-path=save-to-file-path  Override default file path to save report

EXAMPLE
  box legal-hold-policies:create "Class Action Suit" --ongoing
```

_See code: [src/commands/legal-hold-policies/create.js](https://github.com/box/boxcli/blob/v3.5.0/src/commands/legal-hold-policies/create.js)_

## `box legal-hold-policies:delete ID`

Delete a legal hold policy

```
USAGE
  $ box legal-hold-policies:delete ID

ARGUMENTS
  ID  ID of the legal hold policy to delete

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
  box legal-hold-policies:delete 99999
```

_See code: [src/commands/legal-hold-policies/delete.js](https://github.com/box/boxcli/blob/v3.5.0/src/commands/legal-hold-policies/delete.js)_

## `box legal-hold-policies:file-version-holds ID`

List file version legal holds for a legal hold policy

```
USAGE
  $ box legal-hold-policies:file-version-holds ID

ARGUMENTS
  ID  ID of the legal hold policy to get holds for

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
  box legal-hold-policies:file-version-holds 99999
```

_See code: [src/commands/legal-hold-policies/file-version-holds/index.js](https://github.com/box/boxcli/blob/v3.5.0/src/commands/legal-hold-policies/file-version-holds/index.js)_

## `box legal-hold-policies:file-version-holds:get ID`

Get information about a file version legal hold

```
USAGE
  $ box legal-hold-policies:file-version-holds:get ID

ARGUMENTS
  ID  ID of the file version legal hold to get

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
  box legal-hold-policies:file-version-holds:get 12345
```

_See code: [src/commands/legal-hold-policies/file-version-holds/get.js](https://github.com/box/boxcli/blob/v3.5.0/src/commands/legal-hold-policies/file-version-holds/get.js)_

## `box legal-hold-policies:get ID`

Get information about a legal hold policy

```
USAGE
  $ box legal-hold-policies:get ID

ARGUMENTS
  ID  ID of the legal hold policy to get

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
  box legal-hold-policies:get 99999
```

_See code: [src/commands/legal-hold-policies/get.js](https://github.com/box/boxcli/blob/v3.5.0/src/commands/legal-hold-policies/get.js)_

## `box legal-hold-policies:update ID`

Update a legal hold policy

```
USAGE
  $ box legal-hold-policies:update ID

ARGUMENTS
  ID  ID of a legal hold policy to update

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
  --description=description              Description of legal hold policy. Max characters 500
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --policy-name=policy-name              Name of legal hold policy. Max characters 254
  --release-notes=release-notes          Notes around why the policy was released. Max characters 500
  --save-to-file-path=save-to-file-path  Override default file path to save report

EXAMPLE
  box legal-hold-policies:update 99999 --description "Files related to the ongoing class action suit"
```

_See code: [src/commands/legal-hold-policies/update.js](https://github.com/box/boxcli/blob/v3.5.0/src/commands/legal-hold-policies/update.js)_
