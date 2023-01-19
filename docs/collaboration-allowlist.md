`box collaboration-allowlist`
=============================

List collaboration allowlist entries

* [`box collaboration-allowlist`](#box-collaboration-allowlist)
* [`box collaboration-allowlist:add DOMAIN`](#box-collaboration-allowlistadd-domain)
* [`box collaboration-allowlist:delete ID`](#box-collaboration-allowlistdelete-id)
* [`box collaboration-allowlist:exemptions`](#box-collaboration-allowlistexemptions)
* [`box collaboration-allowlist:exemptions:create USERID`](#box-collaboration-allowlistexemptionscreate-userid)
* [`box collaboration-allowlist:exemptions:delete ID`](#box-collaboration-allowlistexemptionsdelete-id)
* [`box collaboration-allowlist:exemptions:get ID`](#box-collaboration-allowlistexemptionsget-id)
* [`box collaboration-allowlist:get ID`](#box-collaboration-allowlistget-id)

## `box collaboration-allowlist`

List collaboration allowlist entries

```
USAGE
  $ box collaboration-allowlist

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
  box collaboration-allowlist
```

_See code: [src/commands/collaboration-allowlist/index.js](https://github.com/box/boxcli/blob/v3.7.0/src/commands/collaboration-allowlist/index.js)_

## `box collaboration-allowlist:add DOMAIN`

Add a collaboration allowlist entry

```
USAGE
  $ box collaboration-allowlist:add DOMAIN

ARGUMENTS
  DOMAIN  Domain to add to allowlist (e.g. box.com)

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
  --direction=inbound|outbound|both      (required) Direction to allowlist collaboration in
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

EXAMPLE
  box collaboration-allowlist:add example.com --direction outbound
```

_See code: [src/commands/collaboration-allowlist/add.js](https://github.com/box/boxcli/blob/v3.7.0/src/commands/collaboration-allowlist/add.js)_

## `box collaboration-allowlist:delete ID`

Delete a collaboration allowlist entry

```
USAGE
  $ box collaboration-allowlist:delete ID

ARGUMENTS
  ID  ID of the collaboration allowlist entry record to delete

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
  box collaboration-allowlist:delete 12345
```

_See code: [src/commands/collaboration-allowlist/delete.js](https://github.com/box/boxcli/blob/v3.7.0/src/commands/collaboration-allowlist/delete.js)_

## `box collaboration-allowlist:exemptions`

List collaboration allowlist exemptions

```
USAGE
  $ box collaboration-allowlist:exemptions

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
  box collaboration-allowlist:exemptions
```

_See code: [src/commands/collaboration-allowlist/exemptions/index.js](https://github.com/box/boxcli/blob/v3.7.0/src/commands/collaboration-allowlist/exemptions/index.js)_

## `box collaboration-allowlist:exemptions:create USERID`

Exempt a user from the collaboration allowlist

```
USAGE
  $ box collaboration-allowlist:exemptions:create USERID

ARGUMENTS
  USERID  ID of the user to exempt from the collaboration allowlist

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
  box collaboration-allowlist:exemptions:create 11111
```

_See code: [src/commands/collaboration-allowlist/exemptions/create.js](https://github.com/box/boxcli/blob/v3.7.0/src/commands/collaboration-allowlist/exemptions/create.js)_

## `box collaboration-allowlist:exemptions:delete ID`

Delete a collaboration allowlist exemption

```
USAGE
  $ box collaboration-allowlist:exemptions:delete ID

ARGUMENTS
  ID  ID of the allowlist exemption record to delete

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
  box collaboration-allowlist:exemptions:delete 12345
```

_See code: [src/commands/collaboration-allowlist/exemptions/delete.js](https://github.com/box/boxcli/blob/v3.7.0/src/commands/collaboration-allowlist/exemptions/delete.js)_

## `box collaboration-allowlist:exemptions:get ID`

Get a collaboration allowlist exemption

```
USAGE
  $ box collaboration-allowlist:exemptions:get ID

ARGUMENTS
  ID  ID of the allowlist exemption record to get

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
  box collaboration-allowlist:exemptions:get 12345
```

_See code: [src/commands/collaboration-allowlist/exemptions/get.js](https://github.com/box/boxcli/blob/v3.7.0/src/commands/collaboration-allowlist/exemptions/get.js)_

## `box collaboration-allowlist:get ID`

Get a collaboration allowlist entry

```
USAGE
  $ box collaboration-allowlist:get ID

ARGUMENTS
  ID  ID of the collaboration allowlist entry record to get

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
  box collaboration-allowlist:get 12345
```

_See code: [src/commands/collaboration-allowlist/get.js](https://github.com/box/boxcli/blob/v3.7.0/src/commands/collaboration-allowlist/get.js)_
