`box configure`
===============

Configure the Box CLI

* [`box configure:environments:add PATH`](#box-configureenvironmentsadd-path)
* [`box configure:environments:delete [NAME]`](#box-configureenvironmentsdelete-name)
* [`box configure:environments:get`](#box-configureenvironmentsget)
* [`box configure:environments:set-current [NAME]`](#box-configureenvironmentsset-current-name)
* [`box configure:environments:switch-user [USERID]`](#box-configureenvironmentsswitch-user-userid)
* [`box configure:environments:update [NAME]`](#box-configureenvironmentsupdate-name)
* [`box configure:settings`](#box-configuresettings)

## `box configure:environments:add PATH`

Add a new Box environment

```
USAGE
  $ box configure:environments:add PATH

ARGUMENTS
  PATH  Provide a file path to configuration file

OPTIONS
  -h, --help
      Show CLI help

  -n, --name=name
      [default: default] Set a name for the environment

  -q, --quiet
      Suppress any non-error output to stderr

  -v, --verbose
      Show verbose output, which can be helpful for debugging

  --ccg-auth
      Add a CCG environment that will use service account. You will have to provide enterprise ID with client id and 
      secret.

  --ccg-user=ccg-user
      Provide an ID for a user for CCG. Use it to obtain user token. In order to enable generating user token you have to 
      go to your application configuration that can be found here https://app.box.com/developers/console.
      In`Configuration` tab, in section `Advanced Features` select `Generate user access tokens`. 
      Do not forget to re-authorize application if it was already authorized.

  --no-color
      Turn off colors for logging

  --private-key-path=private-key-path
      Provide a path to application private key

  --set-as-current
      Set this new environment as your current environment
```

_See code: [src/commands/configure/environments/add.js](https://github.com/box/boxcli/blob/v3.9.0/src/commands/configure/environments/add.js)_

## `box configure:environments:delete [NAME]`

Delete a Box environment

```
USAGE
  $ box configure:environments:delete [NAME]

ARGUMENTS
  NAME  Name of the environment

OPTIONS
  -h, --help     Show CLI help
  -q, --quiet    Suppress any non-error output to stderr
  -v, --verbose  Show verbose output, which can be helpful for debugging
  --no-color     Turn off colors for logging
```

_See code: [src/commands/configure/environments/delete.js](https://github.com/box/boxcli/blob/v3.9.0/src/commands/configure/environments/delete.js)_

## `box configure:environments:get`

Get a Box environment

```
USAGE
  $ box configure:environments:get

OPTIONS
  -c, --current    Get the current default Box environment
  -h, --help       Show CLI help
  -n, --name=name  Get a Box environment with this name
  -q, --quiet      Suppress any non-error output to stderr
  -v, --verbose    Show verbose output, which can be helpful for debugging
  --no-color       Turn off colors for logging
```

_See code: [src/commands/configure/environments/get.js](https://github.com/box/boxcli/blob/v3.9.0/src/commands/configure/environments/get.js)_

## `box configure:environments:set-current [NAME]`

Set your current Box environment to use

```
USAGE
  $ box configure:environments:set-current [NAME]

ARGUMENTS
  NAME  Name of the environment

OPTIONS
  -h, --help     Show CLI help
  -q, --quiet    Suppress any non-error output to stderr
  -v, --verbose  Show verbose output, which can be helpful for debugging
  --no-color     Turn off colors for logging

ALIASES
  $ box configure:environments:select
```

_See code: [src/commands/configure/environments/set-current.js](https://github.com/box/boxcli/blob/v3.9.0/src/commands/configure/environments/set-current.js)_

## `box configure:environments:switch-user [USERID]`

Switch the default Box user to run commands as

```
USAGE
  $ box configure:environments:switch-user [USERID]

ARGUMENTS
  USERID  The user ID to switch to

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
  --default                              Switch to the default user, i.e. the Service Account
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/configure/environments/switch-user.js](https://github.com/box/boxcli/blob/v3.9.0/src/commands/configure/environments/switch-user.js)_

## `box configure:environments:update [NAME]`

Update a Box environment

```
USAGE
  $ box configure:environments:update [NAME]

ARGUMENTS
  NAME  The name of the environment

OPTIONS
  -h, --help                           Show CLI help
  -q, --quiet                          Suppress any non-error output to stderr
  -v, --verbose                        Show verbose output, which can be helpful for debugging

  --[no-]cache-tokens                  Enable token caching, which significantly improves performance. Run with
                                       --no-cache-tokens and then --cache-tokens if your application config updates are
                                       not reflected in your requests.

  --config-file-path=config-file-path  Provide a file path to configuration file

  --name=name                          New name of the environment

  --no-color                           Turn off colors for logging

  --private-key-path=private-key-path  Provide a file path to application private key

  --user-id=user-id                    Store a default user ID to use with the session commands. A default user ID can
                                       be stored for each Box environment
```

_See code: [src/commands/configure/environments/update.js](https://github.com/box/boxcli/blob/v3.9.0/src/commands/configure/environments/update.js)_

## `box configure:settings`

View and update CLI configuration settings

```
USAGE
  $ box configure:settings

OPTIONS
  -h, --help                                     Show CLI help
  -q, --quiet                                    Suppress any non-error output to stderr
  -v, --verbose                                  Show verbose output, which can be helpful for debugging
  --analytics-client-name=analytics-client-name  Set custom analytics client header value
  --downloads-folder-path=downloads-folder-path  Set folder path for the downloads folder
  --[no-]enable-analytics-client                 Enable or disable custom analytics client
  --[no-]enable-proxy                            Enable or disable proxy
  --file-format=csv|json|txt                     Set the file format for generated reports
  --json                                         Output CLI configuration settings in JSON format
  --no-color                                     Turn off colors for logging
  --[no-]output-json                             Default to JSON output for all commands
  --proxy-password=proxy-password                Set password for proxy

  --proxy-url=proxy-url                          Set proxy url, which should contain the protocol, url, and port (i.e.
                                                 http://sample.proxyurl.com:80)

  --proxy-username=proxy-username                Set username for proxy

  --reports-folder-path=reports-folder-path      Set folder path for the reports folder
```

_See code: [src/commands/configure/settings.js](https://github.com/box/boxcli/blob/v3.9.0/src/commands/configure/settings.js)_
