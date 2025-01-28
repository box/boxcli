`box metadata-templates`
========================

Get all metadata templates in your Enterprise

* [`box metadata-templates`](#box-metadata-templates)
* [`box metadata-templates:cascade TEMPLATEKEY`](#box-metadata-templatescascade-templatekey)
* [`box metadata-templates:create`](#box-metadata-templatescreate)
* [`box metadata-templates:delete TEMPLATEKEY`](#box-metadata-templatesdelete-templatekey)
* [`box metadata-templates:get TEMPLATEKEY`](#box-metadata-templatesget-templatekey)
* [`box metadata-templates:list`](#box-metadata-templateslist)
* [`box metadata-templates:update TEMPLATEKEY`](#box-metadata-templatesupdate-templatekey)

## `box metadata-templates`

Get all metadata templates in your Enterprise

```
USAGE
  $ box metadata-templates [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

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
  Get all metadata templates in your Enterprise

ALIASES
  $ box metadata-templates:list

EXAMPLES
  $ box metadata-templates
```

_See code: [src/commands/metadata-templates/index.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/metadata-templates/index.js)_

## `box metadata-templates:cascade TEMPLATEKEY`

Create a new metadata cascade policy on a folder

```
USAGE
  $ box metadata-templates:cascade TEMPLATEKEY --folder <value> [-t <value>] [--as-user <value>] [--no-color] [--json | --csv]
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

_See code: [src/commands/metadata-templates/cascade.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/metadata-templates/cascade.js)_

## `box metadata-templates:create`

Create a new metadata template

```
USAGE
  $ box metadata-templates:create --display-name <value> [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--scope <value>]
    [--template-key <value>] [--hidden] [--string <value>...] [--enum <value>...] [--date <value>...] [--number
    <value>...] [--multi-select <value>...] [--field-key <value>...] [--description <value>...] [--option <value>...]
    [--id-only] [--copy-instance-on-item-copy]

FLAGS
  -h, --help                        Show CLI help
  -q, --quiet                       Suppress any non-error output to stderr
  -s, --save                        Save report to default reports folder on disk
  -t, --token=<value>               Provide a token to perform this call
  -v, --verbose                     Show verbose output, which can be helpful for debugging
  -y, --yes                         Automatically respond yes to all confirmation prompts
      --as-user=<value>             Provide an ID for a user
      --bulk-file-path=<value>      File path to bulk .csv or .json objects
      --copy-instance-on-item-copy  Whether to include the metadata when a file or folder is copied
      --csv                         Output formatted CSV
      --date=<value>...             Add a date field with the provided display name
      --description=<value>...      Set the description of a field
      --display-name=<value>        (required) The display name of the metadata template
      --enum=<value>...             Add an enum field with the provided display name
      --field-key=<value>...        Set the key of a field
      --fields=<value>              Comma separated list of fields to show
      --[no-]hidden                 Whether this template or field is hidden in the UI
      --id-only                     Return only an ID to output from this command
      --json                        Output formatted JSON
      --multi-select=<value>...     Add a multi-select field with the provided display name
      --no-color                    Turn off colors for logging
      --number=<value>...           Add a numeric field with the provided display name
      --option=<value>...           Add an option to a field
      --save-to-file-path=<value>   Override default file path to save report
      --scope=<value>               [default: enterprise] The scope of the metadata template
      --string=<value>...           Add a string field with the provided name
      --template-key=<value>        A unique identifier for the template.  If not specified, will be derived from the
                                    display name

DESCRIPTION
  Create a new metadata template

EXAMPLES
  $ box metadata-templates:create --display-name "Employee Record" --string Name --enum Department --option Sales
```

_See code: [src/commands/metadata-templates/create.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/metadata-templates/create.js)_

## `box metadata-templates:delete TEMPLATEKEY`

Delete a metadata template

```
USAGE
  $ box metadata-templates:delete TEMPLATEKEY [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--scope <value>]

ARGUMENTS
  TEMPLATEKEY  The template key of the metadata template to delete

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
      --scope=<value>              [default: enterprise] The scope of the metadata template to delete

DESCRIPTION
  Delete a metadata template

EXAMPLES
  $ box metadata-templates:delete employeeRecord
```

_See code: [src/commands/metadata-templates/delete.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/metadata-templates/delete.js)_

## `box metadata-templates:get TEMPLATEKEY`

Get information about a metadata template

```
USAGE
  $ box metadata-templates:get TEMPLATEKEY [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--scope <value>]

ARGUMENTS
  TEMPLATEKEY  The template key of the template to get

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
      --scope=<value>              [default: enterprise] The scope of the metadata template to get

DESCRIPTION
  Get information about a metadata template

EXAMPLES
  $ box metadata-templates:get employeeRecord
```

_See code: [src/commands/metadata-templates/get.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/metadata-templates/get.js)_

## `box metadata-templates:list`

Get all metadata templates in your Enterprise

```
USAGE
  $ box metadata-templates:list [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

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
  Get all metadata templates in your Enterprise

ALIASES
  $ box metadata-templates:list

EXAMPLES
  $ box metadata-templates
```

## `box metadata-templates:update TEMPLATEKEY`

Update a metadata template

```
USAGE
  $ box metadata-templates:update TEMPLATEKEY [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--display-name
    <value>...] [--scope <value>] [--hidden] [--string <value>...] [--enum <value>...] [--date <value>...] [--number
    <value>...] [--multi-select <value>...] [--add-multi-select-option <value>...] [--field-key <value>...]
    [--description <value>...] [--option <value>...] [--add-enum-option <value>...] [--reorder-enum-options <value>...]
    [--reorder-fields <value>] [--edit-field <value>] [--edit-enum-option <value>] [--remove-enum-option <value>]
    [--remove-field <value>] [--copy-instance-on-item-copy]

ARGUMENTS
  TEMPLATEKEY  The key of the template to update

FLAGS
  -h, --help                                Show CLI help
  -q, --quiet                               Suppress any non-error output to stderr
  -s, --save                                Save report to default reports folder on disk
  -t, --token=<value>                       Provide a token to perform this call
  -v, --verbose                             Show verbose output, which can be helpful for debugging
  -y, --yes                                 Automatically respond yes to all confirmation prompts
      --add-enum-option=<value>...          Add an enum option to the specified field; must be followed by one or more
                                            --option flags
      --add-multi-select-option=<value>...  Add an option to a specified multiselect field; must be followed by one or
                                            more --option flags
      --as-user=<value>                     Provide an ID for a user
      --bulk-file-path=<value>              File path to bulk .csv or .json objects
      --[no-]copy-instance-on-item-copy     Whether to include the metadata when a file or folder is copied
      --csv                                 Output formatted CSV
      --date=<value>...                     Add a date field with the provided display name
      --description=<value>...              Set the description of a field
      --display-name=<value>...             The display name of the metadata template or field
      --edit-enum-option=<value>            Edit the specified enum option; must be followed by an --option flag
      --edit-field=<value>                  Edit the specified field; must be followed by flags to apply to the field
      --enum=<value>...                     Add an enum field with the provided display name
      --field-key=<value>...                Set the key of a field
      --fields=<value>                      Comma separated list of fields to show
      --[no-]hidden                         Whether this template or field is hidden in the UI
      --json                                Output formatted JSON
      --multi-select=<value>...             Add a multi-select field with the provided display name
      --no-color                            Turn off colors for logging
      --number=<value>...                   Add a numeric field with the provided display name
      --option=<value>...                   Specify a field option
      --remove-enum-option=<value>          Removes the specified enum field option; must be in the form
                                            fieldKey.optionKey
      --remove-field=<value>                Remove the specified field
      --reorder-enum-options=<value>...     Reorder the options for a given field; must be followed by one or more
                                            --option flags
      --reorder-fields=<value>              Reorder the template fields; must be in the form first_key,second_key,...
      --save-to-file-path=<value>           Override default file path to save report
      --scope=<value>                       [default: enterprise] The scope of the metadata template
      --string=<value>...                   Add a string field with the provided name

DESCRIPTION
  Update a metadata template

EXAMPLES
  $ box metadata-templates:update employeeRecord --hidden
```

_See code: [src/commands/metadata-templates/update.js](https://github.com/box/boxcli/blob/v4.0.0/src/commands/metadata-templates/update.js)_
