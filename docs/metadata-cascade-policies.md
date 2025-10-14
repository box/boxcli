`box metadata-cascade-policies`
===============================

List the metadata cascade policies on a folder

* [`box metadata-cascade-policies FOLDERID`](#box-metadata-cascade-policies-folderid)
* [`box metadata-cascade-policies:create TEMPLATEKEY`](#box-metadata-cascade-policiescreate-templatekey)
* [`box metadata-cascade-policies:delete ID`](#box-metadata-cascade-policiesdelete-id)
* [`box metadata-cascade-policies:force-apply ID`](#box-metadata-cascade-policiesforce-apply-id)
* [`box metadata-cascade-policies:get ID`](#box-metadata-cascade-policiesget-id)

## `box metadata-cascade-policies FOLDERID`

List the metadata cascade policies on a folder

```
USAGE
  $ box metadata-cascade-policies FOLDERID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]
    [--owner-enterprise-id <value>]

ARGUMENTS
  FOLDERID  The ID of the folder to list cascade policies for

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
      --fields=<value>               Comma separated list of fields to show
      --json                         Output formatted JSON
      --max-items=<value>            A value that indicates the maximum number of results to return. This only specifies
                                     a maximum boundary and will not guarantee the minimum number of results returned.
                                     When the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests
                                     will be made.
      --no-color                     Turn off colors for logging
      --owner-enterprise-id=<value>  The ID of the enterprise to filter cascade policies for
      --save-to-file-path=<value>    Override default file path to save report

DESCRIPTION
  List the metadata cascade policies on a folder

EXAMPLES
  $ box metadata-cascade-policies 22222
```

_See code: [src/commands/metadata-cascade-policies/index.js](https://github.com/box/boxcli/blob/v4.4.0/src/commands/metadata-cascade-policies/index.js)_

## `box metadata-cascade-policies:create TEMPLATEKEY`

Create a new metadata cascade policy on a folder

```
USAGE
  $ box metadata-cascade-policies:create TEMPLATEKEY --folder <value> [-t <value>] [--as-user <value>] [--no-color] [--json | --csv]
    [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--id-only]
    [--scope <value>]

ARGUMENTS
  TEMPLATEKEY  The template key of the metadata template to cascade

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
      --folder=<value>             (required) The ID of the folder to cascade metadata on
      --id-only                    Return only an ID to output from this command
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report
      --scope=<value>              [default: enterprise] The scope of the metadata template to cascade

DESCRIPTION
  Create a new metadata cascade policy on a folder

ALIASES
  $ box metadata-cascade-policies:create

EXAMPLES
  $ box metadata-templates:cascade employeeRecord --folder 22222
```

## `box metadata-cascade-policies:delete ID`

Delete a metadata cascade policy

```
USAGE
  $ box metadata-cascade-policies:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  The ID of the metadata cascade policy to delete

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
  Delete a metadata cascade policy

EXAMPLES
  $ box metadata-cascade-policies:delete 12345
```

_See code: [src/commands/metadata-cascade-policies/delete.js](https://github.com/box/boxcli/blob/v4.4.0/src/commands/metadata-cascade-policies/delete.js)_

## `box metadata-cascade-policies:force-apply ID`

Force apply a cascade policy to the existing items in a folder

```
USAGE
  $ box metadata-cascade-policies:force-apply ID --conflict-resolution none|overwrite [-t <value>] [--as-user <value>] [--no-color] [--json
    | --csv] [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  The ID of the cascade policy to force apply

FLAGS
  -h, --help                          Show CLI help
  -q, --quiet                         Suppress any non-error output to stderr
  -s, --save                          Save report to default reports folder on disk
  -t, --token=<value>                 Provide a token to perform this call
  -v, --verbose                       Show verbose output, which can be helpful for debugging
  -y, --yes                           Automatically respond yes to all confirmation prompts
      --as-user=<value>               Provide an ID for a user
      --bulk-file-path=<value>        File path to bulk .csv or .json objects
      --conflict-resolution=<option>  (required) The way to resolve conflicts with the metadata being applied
                                      <options: none|overwrite>
      --csv                           Output formatted CSV
      --fields=<value>                Comma separated list of fields to show
      --json                          Output formatted JSON
      --no-color                      Turn off colors for logging
      --save-to-file-path=<value>     Override default file path to save report

DESCRIPTION
  Force apply a cascade policy to the existing items in a folder

EXAMPLES
  $ box metadata-cascade-policies:force-apply 12345 --conflict-resolution overwrite
```

_See code: [src/commands/metadata-cascade-policies/force-apply.js](https://github.com/box/boxcli/blob/v4.4.0/src/commands/metadata-cascade-policies/force-apply.js)_

## `box metadata-cascade-policies:get ID`

Get information about a metadata cascade policy

```
USAGE
  $ box metadata-cascade-policies:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  The ID of the cascade policy to get

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
  Get information about a metadata cascade policy

EXAMPLES
  $ box metadata-cascade-policies:get 12345
```

_See code: [src/commands/metadata-cascade-policies/get.js](https://github.com/box/boxcli/blob/v4.4.0/src/commands/metadata-cascade-policies/get.js)_
