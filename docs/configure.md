`box configure`
===============

Configure the Box CLI

* [`box configure:environments:add PATH`](#box-configureenvironmentsadd-path)
* [`box configure:environments:delete [NAME]`](#box-configureenvironmentsdelete-name)
* [`box configure:environments:get`](#box-configureenvironmentsget)
* [`box configure:environments:select [ID]`](#box-configureenvironmentsselect-id)
* [`box configure:environments:set-current [ID]`](#box-configureenvironmentsset-current-id)
* [`box configure:environments:switch-user [USERID]`](#box-configureenvironmentsswitch-user-userid)
* [`box configure:environments:update [NAME]`](#box-configureenvironmentsupdate-name)
* [`box configure:settings`](#box-configuresettings)

## `box configure:environments:add PATH`

Add a new Box environment

```
USAGE
  $ box configure:environments:add PATH [--no-color] [-h] [-v] [-q] [--private-key-path <value>] [--set-as-current] [-n <value>]
    [--ccg-user <value> --ccg-auth]

ARGUMENTS
  PATH  Provide a file path to configuration file

FLAGS
  -h, --help
      Show CLI help

  -n, --name=<value>
      [default: default] Set a name for the environment

  -q, --quiet
      Suppress any non-error output to stderr

  -v, --verbose
      Show verbose output, which can be helpful for debugging

  --ccg-auth
      Add a CCG environment that will use service account. You will have to provide enterprise ID with client id and
      secret.

  --ccg-user=<value>
      Provide an ID for a user for CCG. Use it to obtain user token. In order to enable generating user token you have to
      go to your application configuration that can be found here https://app.box.com/developers/console.
      In`Configuration` tab, in section `Advanced Features` select `Generate user access tokens`.
      Do not forget to re-authorize application if it was already authorized.

  --no-color
      Turn off colors for logging

  --private-key-path=<value>
      Provide a path to application private key

  --set-as-current
      Set this new environment as your current environment

DESCRIPTION
  Add a new Box environment
```

_See code: [src/commands/configure/environments/add.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/configure/environments/add.ts)_

## `box configure:environments:delete [NAME]`

Delete a Box environment

```
USAGE
  $ box configure:environments:delete [NAME] [--no-color] [-h] [-v] [-q]

ARGUMENTS
  NAME  Name of the environment

FLAGS
  -h, --help      Show CLI help
  -q, --quiet     Suppress any non-error output to stderr
  -v, --verbose   Show verbose output, which can be helpful for debugging
      --no-color  Turn off colors for logging

DESCRIPTION
  Delete a Box environment
```

_See code: [src/commands/configure/environments/delete.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/configure/environments/delete.ts)_

## `box configure:environments:get`

Get a Box environment

```
USAGE
  $ box configure:environments:get [--no-color] [-h] [-v] [-q] [-c | -n <value>]

FLAGS
  -c, --current       Get the current default Box environment
  -h, --help          Show CLI help
  -n, --name=<value>  Get a Box environment with this name
  -q, --quiet         Suppress any non-error output to stderr
  -v, --verbose       Show verbose output, which can be helpful for debugging
      --no-color      Turn off colors for logging

DESCRIPTION
  Get a Box environment
```

_See code: [src/commands/configure/environments/get.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/configure/environments/get.ts)_

## `box configure:environments:select [ID]`

Set your current Box environment to use

```
USAGE
  $ box configure:environments:select [ID] [--no-color] [-h] [-v] [-q]

ARGUMENTS
  ID  Name of the environment

FLAGS
  -h, --help      Show CLI help
  -q, --quiet     Suppress any non-error output to stderr
  -v, --verbose   Show verbose output, which can be helpful for debugging
      --no-color  Turn off colors for logging

DESCRIPTION
  Set your current Box environment to use

ALIASES
  $ box configure:environments:select
```

## `box configure:environments:set-current [ID]`

Set your current Box environment to use

```
USAGE
  $ box configure:environments:set-current [ID] [--no-color] [-h] [-v] [-q]

ARGUMENTS
  ID  Name of the environment

FLAGS
  -h, --help      Show CLI help
  -q, --quiet     Suppress any non-error output to stderr
  -v, --verbose   Show verbose output, which can be helpful for debugging
      --no-color  Turn off colors for logging

DESCRIPTION
  Set your current Box environment to use

ALIASES
  $ box configure:environments:select
```

_See code: [src/commands/configure/environments/set-current.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/configure/environments/set-current.ts)_

## `box configure:environments:switch-user [USERID]`

Switch the default Box user to run commands as

```
USAGE
  $ box configure:environments:switch-user [USERID] [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--default]

ARGUMENTS
  USERID  The user ID to switch to

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
      --default                    Switch to the default user, i.e. the Service Account
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Switch the default Box user to run commands as
```

_See code: [src/commands/configure/environments/switch-user.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/configure/environments/switch-user.ts)_

## `box configure:environments:update [NAME]`

Update a Box environment

```
USAGE
  $ box configure:environments:update [NAME] [--no-color] [-h] [-v] [-q] [--config-file-path <value>] [--name <value>]
    [--private-key-path <value>] [--user-id <value>] [--cache-tokens]

ARGUMENTS
  NAME  The name of the environment

FLAGS
  -h, --help                      Show CLI help
  -q, --quiet                     Suppress any non-error output to stderr
  -v, --verbose                   Show verbose output, which can be helpful for debugging
      --[no-]cache-tokens         Enable token caching, which significantly improves performance. Run with
                                  --no-cache-tokens and then --cache-tokens if your application config updates are not
                                  reflected in your requests.
      --config-file-path=<value>  Provide a file path to configuration file
      --name=<value>              New name of the environment
      --no-color                  Turn off colors for logging
      --private-key-path=<value>  Provide a file path to application private key
      --user-id=<value>           Store a default user ID to use with the session commands. A default user ID can be
                                  stored for each Box environment

DESCRIPTION
  Update a Box environment
```

_See code: [src/commands/configure/environments/update.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/configure/environments/update.ts)_

## `box configure:settings`

View and update CLI configuration settings

```
USAGE
  $ box configure:settings [--no-color] [-h] [-v] [-q] [--json] [--enable-proxy] [--proxy-url <value>] [--proxy-username
    <value> --proxy-password <value>] [--downloads-folder-path <value>] [--file-format csv|json|txt] [--output-json]
    [--reports-folder-path <value>] [--enable-analytics-client] [--analytics-client-name <value>]

FLAGS
  -h, --help                           Show CLI help
  -q, --quiet                          Suppress any non-error output to stderr
  -v, --verbose                        Show verbose output, which can be helpful for debugging
      --analytics-client-name=<value>  Set custom analytics client header value
      --downloads-folder-path=<value>  Set folder path for the downloads folder
      --[no-]enable-analytics-client   Enable or disable custom analytics client
      --[no-]enable-proxy              Enable or disable proxy
      --file-format=<option>           Set the file format for generated reports
                                       <options: csv|json|txt>
      --json                           Output CLI configuration settings in JSON format
      --no-color                       Turn off colors for logging
      --[no-]output-json               Default to JSON output for all commands
      --proxy-password=<value>         Set password for proxy
      --proxy-url=<value>              Set proxy url, which should contain the protocol, url, and port (i.e.
                                       http://sample.proxyurl.com:80)
      --proxy-username=<value>         Set username for proxy
      --reports-folder-path=<value>    Set folder path for the reports folder

DESCRIPTION
  View and update CLI configuration settings
```

_See code: [src/commands/configure/settings.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/configure/settings.ts)_
