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
  $ box collaboration-allowlist [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
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
  List collaboration allowlist entries

EXAMPLES
  $ box collaboration-allowlist
```

_See code: [src/commands/collaboration-allowlist/index.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/collaboration-allowlist/index.ts)_

## `box collaboration-allowlist:add DOMAIN`

Add a collaboration allowlist entry

```
USAGE
  $ box collaboration-allowlist:add DOMAIN --direction inbound|outbound|both [-t <value>] [--as-user <value>] [--no-color]
    [--json | --csv] [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y]
    [-q]

ARGUMENTS
  DOMAIN  Domain to add to allowlist (e.g. box.com)

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
      --direction=<option>         (required) Direction to allowlist collaboration in
                                   <options: inbound|outbound|both>
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Add a collaboration allowlist entry

EXAMPLES
  $ box collaboration-allowlist:add example.com --direction outbound
```

_See code: [src/commands/collaboration-allowlist/add.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/collaboration-allowlist/add.ts)_

## `box collaboration-allowlist:delete ID`

Delete a collaboration allowlist entry

```
USAGE
  $ box collaboration-allowlist:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the collaboration allowlist entry record to delete

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
  Delete a collaboration allowlist entry

EXAMPLES
  $ box collaboration-allowlist:delete 12345
```

_See code: [src/commands/collaboration-allowlist/delete.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/collaboration-allowlist/delete.ts)_

## `box collaboration-allowlist:exemptions`

List collaboration allowlist exemptions

```
USAGE
  $ box collaboration-allowlist:exemptions [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
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
  List collaboration allowlist exemptions

EXAMPLES
  $ box collaboration-allowlist:exemptions
```

_See code: [src/commands/collaboration-allowlist/exemptions/index.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/collaboration-allowlist/exemptions/index.ts)_

## `box collaboration-allowlist:exemptions:create USERID`

Exempt a user from the collaboration allowlist

```
USAGE
  $ box collaboration-allowlist:exemptions:create USERID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  USERID  ID of the user to exempt from the collaboration allowlist

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
  Exempt a user from the collaboration allowlist

EXAMPLES
  $ box collaboration-allowlist:exemptions:create 11111
```

_See code: [src/commands/collaboration-allowlist/exemptions/create.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/collaboration-allowlist/exemptions/create.ts)_

## `box collaboration-allowlist:exemptions:delete ID`

Delete a collaboration allowlist exemption

```
USAGE
  $ box collaboration-allowlist:exemptions:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the allowlist exemption record to delete

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
  Delete a collaboration allowlist exemption

EXAMPLES
  $ box collaboration-allowlist:exemptions:delete 12345
```

_See code: [src/commands/collaboration-allowlist/exemptions/delete.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/collaboration-allowlist/exemptions/delete.ts)_

## `box collaboration-allowlist:exemptions:get ID`

Get a collaboration allowlist exemption

```
USAGE
  $ box collaboration-allowlist:exemptions:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the allowlist exemption record to get

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
  Get a collaboration allowlist exemption

EXAMPLES
  $ box collaboration-allowlist:exemptions:get 12345
```

_See code: [src/commands/collaboration-allowlist/exemptions/get.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/collaboration-allowlist/exemptions/get.ts)_

## `box collaboration-allowlist:get ID`

Get a collaboration allowlist entry

```
USAGE
  $ box collaboration-allowlist:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the collaboration allowlist entry record to get

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
  Get a collaboration allowlist entry

EXAMPLES
  $ box collaboration-allowlist:get 12345
```

_See code: [src/commands/collaboration-allowlist/get.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/collaboration-allowlist/get.ts)_
