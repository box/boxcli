`box device-pins`
=================

List all the device pins for your enterprise

* [`box device-pins`](#box-device-pins)
* [`box device-pins:delete ID`](#box-device-pinsdelete-id)
* [`box device-pins:get ID`](#box-device-pinsget-id)

## `box device-pins`

List all the device pins for your enterprise

```
USAGE
  $ box device-pins

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
  --direction=ASC|DESC                   Set sorting (by id) direction. Default is ASC
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

EXAMPLE
  box device-pins
```

_See code: [src/commands/device-pins/index.js](https://github.com/box/boxcli/blob/v3.3.0/src/commands/device-pins/index.js)_

## `box device-pins:delete ID`

Delete individual device pin

```
USAGE
  $ box device-pins:delete ID

ARGUMENTS
  ID  ID of the device pin to delete

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
  box device-pins:delete 12345
```

_See code: [src/commands/device-pins/delete.js](https://github.com/box/boxcli/blob/v3.3.0/src/commands/device-pins/delete.js)_

## `box device-pins:get ID`

Get information about an individual device pin

```
USAGE
  $ box device-pins:get ID

ARGUMENTS
  ID  ID of the device pin to get

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
  box device-pins:get 12345
```

_See code: [src/commands/device-pins/get.js](https://github.com/box/boxcli/blob/v3.3.0/src/commands/device-pins/get.js)_
