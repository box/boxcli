`box collaboration-whitelist`
=============================

List collaboration whitelist entries

* [`box collaboration-whitelist`](#box-collaboration-whitelist)
* [`box collaboration-whitelist:add DOMAIN`](#box-collaboration-whitelistadd-domain)
* [`box collaboration-whitelist:delete ID`](#box-collaboration-whitelistdelete-id)
* [`box collaboration-whitelist:exemptions`](#box-collaboration-whitelistexemptions)
* [`box collaboration-whitelist:exemptions:create USERID`](#box-collaboration-whitelistexemptionscreate-userid)
* [`box collaboration-whitelist:exemptions:delete ID`](#box-collaboration-whitelistexemptionsdelete-id)
* [`box collaboration-whitelist:exemptions:get ID`](#box-collaboration-whitelistexemptionsget-id)
* [`box collaboration-whitelist:get ID`](#box-collaboration-whitelistget-id)

## `box collaboration-whitelist`

List collaboration whitelist entries

```
USAGE
  $ box collaboration-whitelist

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
  box collaboration-whitelist
```

_See code: [src/commands/collaboration-whitelist/index.js](https://github.com/box/boxcli/blob/v2.7.0/src/commands/collaboration-whitelist/index.js)_

## `box collaboration-whitelist:add DOMAIN`

Add a collaboration whitelist entry

```
USAGE
  $ box collaboration-whitelist:add DOMAIN

ARGUMENTS
  DOMAIN  Domain to add to whitelist (e.g. box.com)

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
  --direction=inbound|outbound|both      (required) Direction to whitelist collaboration in
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

EXAMPLE
  box collaboration-whitelist:add example.com --direction outbound
```

_See code: [src/commands/collaboration-whitelist/add.js](https://github.com/box/boxcli/blob/v2.7.0/src/commands/collaboration-whitelist/add.js)_

## `box collaboration-whitelist:delete ID`

Delete a collaboration whitelist entry

```
USAGE
  $ box collaboration-whitelist:delete ID

ARGUMENTS
  ID  ID of the collaboration whitelist entry record to delete

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
  box collaboration-whitelist:delete 12345
```

_See code: [src/commands/collaboration-whitelist/delete.js](https://github.com/box/boxcli/blob/v2.7.0/src/commands/collaboration-whitelist/delete.js)_

## `box collaboration-whitelist:exemptions`

List collaboration whitelist exemptions

```
USAGE
  $ box collaboration-whitelist:exemptions

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
  box collaboration-whitelist:exemptions
```

_See code: [src/commands/collaboration-whitelist/exemptions/index.js](https://github.com/box/boxcli/blob/v2.7.0/src/commands/collaboration-whitelist/exemptions/index.js)_

## `box collaboration-whitelist:exemptions:create USERID`

Exempt a user from the collaboration whitelist

```
USAGE
  $ box collaboration-whitelist:exemptions:create USERID

ARGUMENTS
  USERID  ID of the user to exempt from the collaboration whitelist

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
  box collaboration-whitelist:exemptions:create 11111
```

_See code: [src/commands/collaboration-whitelist/exemptions/create.js](https://github.com/box/boxcli/blob/v2.7.0/src/commands/collaboration-whitelist/exemptions/create.js)_

## `box collaboration-whitelist:exemptions:delete ID`

Delete a collaboration whitelist exemption

```
USAGE
  $ box collaboration-whitelist:exemptions:delete ID

ARGUMENTS
  ID  ID of the whitelist exemption record to delete

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
  box collaboration-whitelist:exemptions:delete 12345
```

_See code: [src/commands/collaboration-whitelist/exemptions/delete.js](https://github.com/box/boxcli/blob/v2.7.0/src/commands/collaboration-whitelist/exemptions/delete.js)_

## `box collaboration-whitelist:exemptions:get ID`

Get a collaboration whitelist exemption

```
USAGE
  $ box collaboration-whitelist:exemptions:get ID

ARGUMENTS
  ID  ID of the whitelist exemption record to get

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
  box collaboration-whitelist:exemptions:get 12345
```

_See code: [src/commands/collaboration-whitelist/exemptions/get.js](https://github.com/box/boxcli/blob/v2.7.0/src/commands/collaboration-whitelist/exemptions/get.js)_

## `box collaboration-whitelist:get ID`

Get a collaboration whitelist entry

```
USAGE
  $ box collaboration-whitelist:get ID

ARGUMENTS
  ID  ID of the collaboration whitelist entry record to get

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
  box collaboration-whitelist:get 12345
```

_See code: [src/commands/collaboration-whitelist/get.js](https://github.com/box/boxcli/blob/v2.7.0/src/commands/collaboration-whitelist/get.js)_
