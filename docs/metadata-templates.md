`box metadata-templates`
========================

Get all metadata templates in your Enterprise

* [`box metadata-templates`](#box-metadata-templates)
* [`box metadata-templates:cascade TEMPLATEKEY`](#box-metadata-templatescascade-templatekey)
* [`box metadata-templates:create`](#box-metadata-templatescreate)
* [`box metadata-templates:delete TEMPLATEKEY`](#box-metadata-templatesdelete-templatekey)
* [`box metadata-templates:get TEMPLATEKEY`](#box-metadata-templatesget-templatekey)
* [`box metadata-templates:update TEMPLATEKEY`](#box-metadata-templatesupdate-templatekey)

## `box metadata-templates`

Get all metadata templates in your Enterprise

```
USAGE
  $ box metadata-templates

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
  $ box metadata-templates:list

EXAMPLE
  box metadata-templates
```

_See code: [src/commands/metadata-templates/index.js](https://github.com/box/boxcli/blob/v3.6.0/src/commands/metadata-templates/index.js)_

## `box metadata-templates:cascade TEMPLATEKEY`

Create a new metadata cascade policy on a folder

```
USAGE
  $ box metadata-templates:cascade TEMPLATEKEY

ARGUMENTS
  TEMPLATEKEY  The template key of the metadata template to cascade

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
  --folder=folder                        (required) The ID of the folder to cascade metadata on
  --id-only                              Return only an ID to output from this command
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --scope=scope                          [default: enterprise] The scope of the metadata template to cascade

EXAMPLE
  box metadata-templates:cascade employeeRecord --folder 22222
```

_See code: [src/commands/metadata-templates/cascade.js](https://github.com/box/boxcli/blob/v3.6.0/src/commands/metadata-templates/cascade.js)_

## `box metadata-templates:create`

Create a new metadata template

```
USAGE
  $ box metadata-templates:create

OPTIONS
  -h, --help                             Show CLI help
  -q, --quiet                            Suppress any non-error output to stderr
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --copy-instance-on-item-copy           Whether to include the metadata when a file or folder is copied
  --csv                                  Output formatted CSV
  --date=date                            Add a date field with the provided display name
  --description=description              Set the description of a field
  --display-name=display-name            (required) The display name of the metadata template
  --enum=enum                            Add an enum field with the provided display name
  --field-key=field-key                  Set the key of a field
  --fields=fields                        Comma separated list of fields to show
  --[no-]hidden                          Whether this template or field is hidden in the UI
  --id-only                              Return only an ID to output from this command
  --json                                 Output formatted JSON
  --multi-select=multi-select            Add a multi-select field with the provided display name
  --no-color                             Turn off colors for logging
  --number=number                        Add a numeric field with the provided display name
  --option=option                        Add an option to a field
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --scope=scope                          [default: enterprise] The scope of the metadata template
  --string=string                        Add a string field with the provided name

  --template-key=template-key            A unique identifier for the template.  If not specified, will be derived from
                                         the display name

EXAMPLE
  box metadata-templates:create --display-name "Employee Record" --string Name --enum Department --option Sales
```

_See code: [src/commands/metadata-templates/create.js](https://github.com/box/boxcli/blob/v3.6.0/src/commands/metadata-templates/create.js)_

## `box metadata-templates:delete TEMPLATEKEY`

Delete a metadata template

```
USAGE
  $ box metadata-templates:delete TEMPLATEKEY

ARGUMENTS
  TEMPLATEKEY  The template key of the metadata template to delete

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
  --scope=scope                          [default: enterprise] The scope of the metadata template to delete

EXAMPLE
  box metadata-templates:delete employeeRecord
```

_See code: [src/commands/metadata-templates/delete.js](https://github.com/box/boxcli/blob/v3.6.0/src/commands/metadata-templates/delete.js)_

## `box metadata-templates:get TEMPLATEKEY`

Get information about a metadata template

```
USAGE
  $ box metadata-templates:get TEMPLATEKEY

ARGUMENTS
  TEMPLATEKEY  The template key of the template to get

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
  --scope=scope                          [default: enterprise] The scope of the metadata template to get

EXAMPLE
  box metadata-templates:get employeeRecord
```

_See code: [src/commands/metadata-templates/get.js](https://github.com/box/boxcli/blob/v3.6.0/src/commands/metadata-templates/get.js)_

## `box metadata-templates:update TEMPLATEKEY`

Update a metadata template

```
USAGE
  $ box metadata-templates:update TEMPLATEKEY

ARGUMENTS
  TEMPLATEKEY  The key of the template to update

OPTIONS
  -h, --help                                         Show CLI help
  -q, --quiet                                        Suppress any non-error output to stderr
  -s, --save                                         Save report to default reports folder on disk
  -t, --token=token                                  Provide a token to perform this call
  -v, --verbose                                      Show verbose output, which can be helpful for debugging
  -y, --yes                                          Automatically respond yes to all confirmation prompts

  --add-enum-option=add-enum-option                  Add an enum option to the specified field; must be followed by one
                                                     or more --option flags

  --add-multi-select-option=add-multi-select-option  Add an option to a specified multiselect field; must be followed by
                                                     one or more --option flags

  --as-user=as-user                                  Provide an ID for a user

  --bulk-file-path=bulk-file-path                    File path to bulk .csv or .json objects

  --[no-]copy-instance-on-item-copy                  Whether to include the metadata when a file or folder is copied

  --csv                                              Output formatted CSV

  --date=date                                        Add a date field with the provided display name

  --description=description                          Set the description of a field

  --display-name=display-name                        The display name of the metadata template or field

  --edit-enum-option=edit-enum-option                Edit the specified enum option; must be followed by an --option
                                                     flag

  --edit-field=edit-field                            Edit the specified field; must be followed by flags to apply to the
                                                     field

  --enum=enum                                        Add an enum field with the provided display name

  --field-key=field-key                              Set the key of a field

  --fields=fields                                    Comma separated list of fields to show

  --[no-]hidden                                      Whether this template or field is hidden in the UI

  --json                                             Output formatted JSON

  --multi-select=multi-select                        Add a multi-select field with the provided display name

  --no-color                                         Turn off colors for logging

  --number=number                                    Add a numeric field with the provided display name

  --option=option                                    Specify a field option

  --remove-enum-option=remove-enum-option            Removes the specified enum field option; must be in the form
                                                     fieldKey.optionKey

  --remove-field=remove-field                        Remove the specified field

  --reorder-enum-options=reorder-enum-options        Reorder the options for a given field; must be followed by one or
                                                     more --option flags

  --reorder-fields=reorder-fields                    Reorder the template fields; must be in the form
                                                     first_key,second_key,...

  --save-to-file-path=save-to-file-path              Override default file path to save report

  --scope=scope                                      [default: enterprise] The scope of the metadata template

  --string=string                                    Add a string field with the provided name

EXAMPLE
  box metadata-templates:update employeeRecord --hidden
```

_See code: [src/commands/metadata-templates/update.js](https://github.com/box/boxcli/blob/v3.6.0/src/commands/metadata-templates/update.js)_
