`box storage-policies`
======================

List storage policies

* [`box storage-policies`](#box-storage-policies)
* [`box storage-policies:assign STORAGEPOLICYID USERID`](#box-storage-policiesassign-storagepolicyid-userid)
* [`box storage-policies:assignments:get ID`](#box-storage-policiesassignmentsget-id)
* [`box storage-policies:assignments:lookup ID`](#box-storage-policiesassignmentslookup-id)
* [`box storage-policies:assignments:remove ID`](#box-storage-policiesassignmentsremove-id)
* [`box storage-policies:get ID`](#box-storage-policiesget-id)

## `box storage-policies`

List storage policies

```
USAGE
  $ box storage-policies

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
  $ box storage-policies:list

EXAMPLE
  box storage-policies
```

_See code: [src/commands/storage-policies/index.js](https://github.com/box/boxcli/blob/v3.8.0/src/commands/storage-policies/index.js)_

## `box storage-policies:assign STORAGEPOLICYID USERID`

Assign a storage policy

```
USAGE
  $ box storage-policies:assign STORAGEPOLICYID USERID

ARGUMENTS
  STORAGEPOLICYID  Id of the storage policy
  USERID           Id of the user to assign the storage policy to

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
  box storage-policies:assign 12345 33333
```

_See code: [src/commands/storage-policies/assign.js](https://github.com/box/boxcli/blob/v3.8.0/src/commands/storage-policies/assign.js)_

## `box storage-policies:assignments:get ID`

Get information on a storage policy assignment

```
USAGE
  $ box storage-policies:assignments:get ID

ARGUMENTS
  ID  ID of the storage policy assignment to get

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
  box storage-policies:assignments:get 12345
```

_See code: [src/commands/storage-policies/assignments/get.js](https://github.com/box/boxcli/blob/v3.8.0/src/commands/storage-policies/assignments/get.js)_

## `box storage-policies:assignments:lookup ID`

Look up which storage policy an object is assigned to

```
USAGE
  $ box storage-policies:assignments:lookup ID

ARGUMENTS
  ID  ID of the object to look up the storage policy for

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
  --type=user|enterprise                 (required) [default: user] Type of object to look up the storage policy for

EXAMPLE
  box storage-policies:assignments:lookup 33333
```

_See code: [src/commands/storage-policies/assignments/lookup.js](https://github.com/box/boxcli/blob/v3.8.0/src/commands/storage-policies/assignments/lookup.js)_

## `box storage-policies:assignments:remove ID`

Delete a storage policy assignment

```
USAGE
  $ box storage-policies:assignments:remove ID

ARGUMENTS
  ID  ID of the storage policy assignment to delete

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
  box storage-policies:assignments:remove 12345
```

_See code: [src/commands/storage-policies/assignments/remove.js](https://github.com/box/boxcli/blob/v3.8.0/src/commands/storage-policies/assignments/remove.js)_

## `box storage-policies:get ID`

Get information on a storage policy

```
USAGE
  $ box storage-policies:get ID

ARGUMENTS
  ID  ID of the storage policy to get

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
  box storage-policies:get 12345
```

_See code: [src/commands/storage-policies/get.js](https://github.com/box/boxcli/blob/v3.8.0/src/commands/storage-policies/get.js)_
