`box terms-of-service`
======================

List terms of services for your enterprise

* [`box terms-of-service`](#box-terms-of-service)
* [`box terms-of-service:create`](#box-terms-of-servicecreate)
* [`box terms-of-service:get ID`](#box-terms-of-serviceget-id)
* [`box terms-of-service:get-user-status TOSID`](#box-terms-of-serviceget-user-status-tosid)
* [`box terms-of-service:set-user-status ID`](#box-terms-of-serviceset-user-status-id)
* [`box terms-of-service:update ID`](#box-terms-of-serviceupdate-id)

## `box terms-of-service`

List terms of services for your enterprise

```
USAGE
  $ box terms-of-service

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
  --type=managed|external                Filter by terms of service type

EXAMPLE
  box terms-of-service
```

_See code: [src/commands/terms-of-service/index.js](https://github.com/box/boxcli/blob/v3.8.0/src/commands/terms-of-service/index.js)_

## `box terms-of-service:create`

Create a terms of service

```
USAGE
  $ box terms-of-service:create

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
  --status=enabled|disabled              (required) Status of the terms of service
  --text=text                            (required) Text for the terms of service
  --type=managed|external                (required) Type of terms of service

EXAMPLE
  box terms-of-service:create --type external --status enabled --text "By using this service, you agree to...."
```

_See code: [src/commands/terms-of-service/create.js](https://github.com/box/boxcli/blob/v3.8.0/src/commands/terms-of-service/create.js)_

## `box terms-of-service:get ID`

Get information on a terms of service

```
USAGE
  $ box terms-of-service:get ID

ARGUMENTS
  ID  ID for the terms of service to get

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
  box terms-of-service:get 55555
```

_See code: [src/commands/terms-of-service/get.js](https://github.com/box/boxcli/blob/v3.8.0/src/commands/terms-of-service/get.js)_

## `box terms-of-service:get-user-status TOSID`

Get a user's status on a terms of service

```
USAGE
  $ box terms-of-service:get-user-status TOSID

ARGUMENTS
  TOSID  ID of the terms of service to get user status for

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
  --user-id=user-id                      ID for a user to get status for; defaults to the current user ID

EXAMPLE
  box terms-of-service:get-user-status 55555
```

_See code: [src/commands/terms-of-service/get-user-status.js](https://github.com/box/boxcli/blob/v3.8.0/src/commands/terms-of-service/get-user-status.js)_

## `box terms-of-service:set-user-status ID`

Set a user's status on a terms of service with a terms of service Id

```
USAGE
  $ box terms-of-service:set-user-status ID

ARGUMENTS
  ID  ID of the terms of service to set the user status on

OPTIONS
  -h, --help                             Show CLI help
  -q, --quiet                            Suppress any non-error output to stderr
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --accept                               Set the user's status as accepted
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --reject                               Set the user's status as rejected
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --user-id=user-id                      ID of the user to set status for; defaults to the current user

EXAMPLE
  box terms-of-service:set-user-status 55555 --accept
```

_See code: [src/commands/terms-of-service/set-user-status.js](https://github.com/box/boxcli/blob/v3.8.0/src/commands/terms-of-service/set-user-status.js)_

## `box terms-of-service:update ID`

Update a terms of service

```
USAGE
  $ box terms-of-service:update ID

ARGUMENTS
  ID  ID of the terms of service to update

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
  --status=enabled|disabled              Status of the terms of service
  --text=text                            Text for the terms of service

EXAMPLE
  box terms-of-service:update 55555 --status disabled
```

_See code: [src/commands/terms-of-service/update.js](https://github.com/box/boxcli/blob/v3.8.0/src/commands/terms-of-service/update.js)_
