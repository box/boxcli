`box hubs`
==========

List Box Hubs for the current user

* [`box hubs`](#box-hubs)
* [`box hubs:copy ID`](#box-hubscopy-id)
* [`box hubs:create TITLE`](#box-hubscreate-title)
* [`box hubs:delete ID`](#box-hubsdelete-id)
* [`box hubs:enterprise`](#box-hubsenterprise)
* [`box hubs:get ID`](#box-hubsget-id)
* [`box hubs:list`](#box-hubslist)
* [`box hubs:update ID`](#box-hubsupdate-id)

## `box hubs`

List Box Hubs for the current user

```
USAGE
  $ box hubs [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>] [--query <value>]
    [--scope editable|view_only|all] [--sort name|updated_at|last_accessed_at|view_count|relevance] [--direction
    ASC|DESC]

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
      --direction=<option>         Sort direction. One of: ASC, DESC
                                   <options: ASC|DESC>
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --query=<value>              Search query for Box Hubs
      --save-to-file-path=<value>  Override default file path to save report
      --scope=<option>             Scope of hubs to retrieve. One of: editable, view_only, all
                                   <options: editable|view_only|all>
      --sort=<option>              Sort field for hubs. One of: name, updated_at, last_accessed_at, view_count,
                                   relevance
                                   <options: name|updated_at|last_accessed_at|view_count|relevance>

DESCRIPTION
  List Box Hubs for the current user

ALIASES
  $ box hubs:list

EXAMPLES
  $ box hubs

  $ box hubs --query "Product" --scope editable --sort name --direction ASC
```

_See code: [src/commands/hubs/index.js](https://github.com/box/boxcli/blob/v4.7.0/src/commands/hubs/index.js)_

## `box hubs:copy ID`

Copy a Box Hub

```
USAGE
  $ box hubs:copy ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [-T <value>] [-d <value>]

ARGUMENTS
  ID  ID of the Box Hub to copy

FLAGS
  -T, --title=<value>              Optional title override for the copied hub
  -d, --description=<value>        Optional description override for the copied hub
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
  Copy a Box Hub

EXAMPLES
  $ box hubs:copy 12345 --title "Copied hub title" --description "Copied hub description"
```

_See code: [src/commands/hubs/copy.js](https://github.com/box/boxcli/blob/v4.7.0/src/commands/hubs/copy.js)_

## `box hubs:create TITLE`

Create a new Box Hub

```
USAGE
  $ box hubs:create TITLE [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [-d <value>]

ARGUMENTS
  TITLE  Title for the Box Hub

FLAGS
  -d, --description=<value>        Description of the Box Hub
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
  Create a new Box Hub

EXAMPLES
  $ box hubs:create "Roadmap Hub" --description "Q3 planning hub"
```

_See code: [src/commands/hubs/create.js](https://github.com/box/boxcli/blob/v4.7.0/src/commands/hubs/create.js)_

## `box hubs:delete ID`

Delete a Box Hub

```
USAGE
  $ box hubs:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the Box Hub to delete

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
  Delete a Box Hub

EXAMPLES
  $ box hubs:delete 12345
```

_See code: [src/commands/hubs/delete.js](https://github.com/box/boxcli/blob/v4.7.0/src/commands/hubs/delete.js)_

## `box hubs:enterprise`

List Box Hubs across the enterprise. This call requires an admin or hub co-admin of an enterprise with GCM scope. Otherwise, Box returns a 403 status code with the message `The request requires higher privileges than provided by the access token.` See https://developer.box.com/guides/api-calls/permissions-and-errors/scopes#global-content-manager-gcm

```
USAGE
  $ box hubs:enterprise [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>] [--query <value>]
    [--sort name|updated_at|last_accessed_at|view_count|relevance] [--direction ASC|DESC]

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
      --direction=<option>         Sort direction. One of: ASC, DESC
                                   <options: ASC|DESC>
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --query=<value>              Search query for enterprise Box Hubs
      --save-to-file-path=<value>  Override default file path to save report
      --sort=<option>              Sort field for hubs. One of: name, updated_at, last_accessed_at, view_count,
                                   relevance
                                   <options: name|updated_at|last_accessed_at|view_count|relevance>

DESCRIPTION
  List Box Hubs across the enterprise. This call requires an admin or hub co-admin of an enterprise with GCM scope.
  Otherwise, Box returns a 403 status code with the message `The request requires higher privileges than provided by the
  access token.` See https://developer.box.com/guides/api-calls/permissions-and-errors/scopes#global-content-manager-gcm

EXAMPLES
  $ box hubs:enterprise

  $ box hubs:enterprise --query "Roadmap" --sort updated_at --direction DESC
```

_See code: [src/commands/hubs/enterprise.js](https://github.com/box/boxcli/blob/v4.7.0/src/commands/hubs/enterprise.js)_

## `box hubs:get ID`

Get details for a Box Hub

```
USAGE
  $ box hubs:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the Box Hub

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
  Get details for a Box Hub

EXAMPLES
  $ box hubs:get 12345
```

_See code: [src/commands/hubs/get.js](https://github.com/box/boxcli/blob/v4.7.0/src/commands/hubs/get.js)_

## `box hubs:list`

List Box Hubs for the current user

```
USAGE
  $ box hubs:list [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>] [--query <value>]
    [--scope editable|view_only|all] [--sort name|updated_at|last_accessed_at|view_count|relevance] [--direction
    ASC|DESC]

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
      --direction=<option>         Sort direction. One of: ASC, DESC
                                   <options: ASC|DESC>
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --query=<value>              Search query for Box Hubs
      --save-to-file-path=<value>  Override default file path to save report
      --scope=<option>             Scope of hubs to retrieve. One of: editable, view_only, all
                                   <options: editable|view_only|all>
      --sort=<option>              Sort field for hubs. One of: name, updated_at, last_accessed_at, view_count,
                                   relevance
                                   <options: name|updated_at|last_accessed_at|view_count|relevance>

DESCRIPTION
  List Box Hubs for the current user

ALIASES
  $ box hubs:list

EXAMPLES
  $ box hubs

  $ box hubs --query "Product" --scope editable --sort name --direction ASC
```

## `box hubs:update ID`

Update a Box Hub

```
USAGE
  $ box hubs:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [-T <value>] [-d <value>] [--ai-enabled]
    [--collaboration-restricted-to-enterprise] [--can-non-owners-invite] [--can-shared-link-be-created]
    [--can-public-shared-link-be-created]

ARGUMENTS
  ID  ID of the Box Hub to update

FLAGS
  -T, --title=<value>                                Updated title for the Box Hub
  -d, --description=<value>                          Updated description for the Box Hub
  -h, --help                                         Show CLI help
  -q, --quiet                                        Suppress any non-error output to stderr
  -s, --save                                         Save report to default reports folder on disk
  -t, --token=<value>                                Provide a token to perform this call
  -v, --verbose                                      Show verbose output, which can be helpful for debugging
  -y, --yes                                          Automatically respond yes to all confirmation prompts
      --[no-]ai-enabled                              Enable or disable AI features for this Box Hub
      --as-user=<value>                              Provide an ID for a user
      --bulk-file-path=<value>                       File path to bulk .csv or .json objects
      --[no-]can-non-owners-invite                   Allow non-owners to invite collaborators
      --[no-]can-public-shared-link-be-created       Allow public shared links for this Box Hub
      --[no-]can-shared-link-be-created              Allow shared links for this Box Hub
      --[no-]collaboration-restricted-to-enterprise  Restrict collaboration to enterprise users only
      --csv                                          Output formatted CSV
      --fields=<value>                               Comma separated list of fields to show
      --json                                         Output formatted JSON
      --no-color                                     Turn off colors for logging
      --save-to-file-path=<value>                    Override default file path to save report

DESCRIPTION
  Update a Box Hub

EXAMPLES
  $ box hubs:update 12345 --title "Updated title" --ai-enabled
```

_See code: [src/commands/hubs/update.js](https://github.com/box/boxcli/blob/v4.7.0/src/commands/hubs/update.js)_
