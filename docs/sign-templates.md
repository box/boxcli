`box sign-templates`
====================

List sign templates

* [`box sign-templates`](#box-sign-templates)
* [`box sign-templates:get ID`](#box-sign-templatesget-id)

## `box sign-templates`

List sign templates

```
USAGE
  $ box sign-templates [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--limit <value>] [--marker <value>]

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
      --limit=<value>              The maximum number of items to return per page.
      --marker=<value>             Defines the position marker at which to begin returning results. This is used when
                                   paginating using marker-based pagination. This requires `usemarker` to be set to
                                   `true`.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List sign templates

EXAMPLES
  $ box sign-templates
```

_See code: [src/commands/sign-templates/index.js](https://github.com/box/boxcli/blob/v4.0.1/src/commands/sign-templates/index.js)_

## `box sign-templates:get ID`

Get sign template by ID

```
USAGE
  $ box sign-templates:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  The ID of the sign template

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
  Get sign template by ID

EXAMPLES
  $ box sign-templates:get 12345
```

_See code: [src/commands/sign-templates/get.js](https://github.com/box/boxcli/blob/v4.0.1/src/commands/sign-templates/get.js)_
