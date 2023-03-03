`box metadata-cascade-policies`
===============================

List the metadata cascade policies on a folder

* [`box metadata-cascade-policies FOLDERID`](#box-metadata-cascade-policies-folderid)
* [`box metadata-cascade-policies:delete ID`](#box-metadata-cascade-policiesdelete-id)
* [`box metadata-cascade-policies:force-apply ID`](#box-metadata-cascade-policiesforce-apply-id)
* [`box metadata-cascade-policies:get ID`](#box-metadata-cascade-policiesget-id)

## `box metadata-cascade-policies FOLDERID`

List the metadata cascade policies on a folder

```
USAGE
  $ box metadata-cascade-policies FOLDERID

ARGUMENTS
  FOLDERID  The ID of the folder to list cascade policies for

OPTIONS
  -h, --help                                 Show CLI help
  -q, --quiet                                Suppress any non-error output to stderr
  -s, --save                                 Save report to default reports folder on disk
  -t, --token=token                          Provide a token to perform this call
  -v, --verbose                              Show verbose output, which can be helpful for debugging
  -y, --yes                                  Automatically respond yes to all confirmation prompts
  --as-user=as-user                          Provide an ID for a user
  --bulk-file-path=bulk-file-path            File path to bulk .csv or .json objects
  --csv                                      Output formatted CSV
  --fields=fields                            Comma separated list of fields to show
  --json                                     Output formatted JSON
  --no-color                                 Turn off colors for logging
  --owner-enterprise-id=owner-enterprise-id  The ID of the enterprise to filter cascade policies for
  --save-to-file-path=save-to-file-path      Override default file path to save report

EXAMPLE
  box metadata-cascade-policies 22222
```

_See code: [src/commands/metadata-cascade-policies/index.js](https://github.com/box/boxcli/blob/v3.8.0/src/commands/metadata-cascade-policies/index.js)_

## `box metadata-cascade-policies:delete ID`

Delete a metadata cascade policy

```
USAGE
  $ box metadata-cascade-policies:delete ID

ARGUMENTS
  ID  The ID of the metadata cascade policy to delete

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
  box metadata-cascade-policies:delete 12345
```

_See code: [src/commands/metadata-cascade-policies/delete.js](https://github.com/box/boxcli/blob/v3.8.0/src/commands/metadata-cascade-policies/delete.js)_

## `box metadata-cascade-policies:force-apply ID`

Force apply a cascade policy to the existing items in a folder

```
USAGE
  $ box metadata-cascade-policies:force-apply ID

ARGUMENTS
  ID  The ID of the cascade policy to force apply

OPTIONS
  -h, --help                             Show CLI help
  -q, --quiet                            Suppress any non-error output to stderr
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --conflict-resolution=none|overwrite   (required) The way to resolve conflicts with the metadata being applied
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

EXAMPLE
  box metadata-cascade-policies:force-apply 12345 --conflict-resolution overwrite
```

_See code: [src/commands/metadata-cascade-policies/force-apply.js](https://github.com/box/boxcli/blob/v3.8.0/src/commands/metadata-cascade-policies/force-apply.js)_

## `box metadata-cascade-policies:get ID`

Get information about a metadata cascade policy

```
USAGE
  $ box metadata-cascade-policies:get ID

ARGUMENTS
  ID  The ID of the cascade policy to get

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
  box metadata-cascade-policies:get 12345
```

_See code: [src/commands/metadata-cascade-policies/get.js](https://github.com/box/boxcli/blob/v3.8.0/src/commands/metadata-cascade-policies/get.js)_
