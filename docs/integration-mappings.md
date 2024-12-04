`box integration-mappings`
==========================

List Slack integration mappings

* [`box integration-mappings:slack`](#box-integration-mappingsslack)
* [`box integration-mappings:slack:create BOXITEMID CHANNELID`](#box-integration-mappingsslackcreate-boxitemid-channelid)
* [`box integration-mappings:slack:delete ID`](#box-integration-mappingsslackdelete-id)
* [`box integration-mappings:slack:list`](#box-integration-mappingsslacklist)
* [`box integration-mappings:slack:update ID`](#box-integration-mappingsslackupdate-id)

## `box integration-mappings:slack`

List Slack integration mappings

```
USAGE
  $ box integration-mappings:slack [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>] [--partner-item-id
    <value>] [--box-item-id <value>] [--manually-created]

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --box-item-id=<value>        ID of the mapped Box folder, for which the mapping should be returned
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --[no-]manually-created      Whether the mapping has been manually created
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --partner-item-id=<value>    ID of the mapped Slack channel, for which the mapping should be returned
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List Slack integration mappings

ALIASES
  $ box integration-mappings:slack:list

EXAMPLES
  $ box integration-mappings:slack --partner-item-id 123 --manually-created

  $ box integration-mappings:slack --box-item-id 456 --no-manually-created
```

_See code: [src/commands/integration-mappings/slack/index.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/integration-mappings/slack/index.ts)_

## `box integration-mappings:slack:create BOXITEMID CHANNELID`

Create Slack integration mapping

```
USAGE
  $ box integration-mappings:slack:create BOXITEMID CHANNELID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--slack-workspace-id
    <value> | --slack-org-id <value>] [--disable-access-management]

ARGUMENTS
  BOXITEMID  ID of the mapped folder
  CHANNELID  ID of the mapped Slack channel

FLAGS
  -h, --help                            Show CLI help
  -q, --quiet                           Suppress any non-error output to stderr
  -s, --save                            Save report to default reports folder on disk
  -t, --token=<value>                   Provide a token to perform this call
  -v, --verbose                         Show verbose output, which can be helpful for debugging
  -y, --yes                             Automatically respond yes to all confirmation prompts
      --as-user=<value>                 Provide an ID for a user
      --bulk-file-path=<value>          File path to bulk .csv or .json objects
      --csv                             Output formatted CSV
      --[no-]disable-access-management  Indicates whether or not channel member access to the underlying box item should
                                        be automatically managed. Depending on type of channel, access is managed
                                        through creating collaborations or shared links.
      --fields=<value>                  Comma separated list of fields to show
      --json                            Output formatted JSON
      --no-color                        Turn off colors for logging
      --save-to-file-path=<value>       Override default file path to save report
      --slack-org-id=<value>            ID of the Slack organization with which the item would be associated
      --slack-workspace-id=<value>      ID of the Slack workspace with which the item would be associated

DESCRIPTION
  Create Slack integration mapping

EXAMPLES
  $ box integration-mappings:slack:create 123 AB89X56Y --slack-org-id 789

  $ box integration-mappings:slack:create 123 AB89X56Y --slack-workspace-id 999 --disable-access-management
```

_See code: [src/commands/integration-mappings/slack/create.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/integration-mappings/slack/create.ts)_

## `box integration-mappings:slack:delete ID`

Delete Slack integration mapping

```
USAGE
  $ box integration-mappings:slack:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the integration mapping

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
  Delete Slack integration mapping

EXAMPLES
  $ box integration-mappings:slack:delete 123
```

_See code: [src/commands/integration-mappings/slack/delete.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/integration-mappings/slack/delete.ts)_

## `box integration-mappings:slack:list`

List Slack integration mappings

```
USAGE
  $ box integration-mappings:slack:list [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>] [--partner-item-id
    <value>] [--box-item-id <value>] [--manually-created]

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --box-item-id=<value>        ID of the mapped Box folder, for which the mapping should be returned
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --[no-]manually-created      Whether the mapping has been manually created
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --partner-item-id=<value>    ID of the mapped Slack channel, for which the mapping should be returned
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List Slack integration mappings

ALIASES
  $ box integration-mappings:slack:list

EXAMPLES
  $ box integration-mappings:slack --partner-item-id 123 --manually-created

  $ box integration-mappings:slack --box-item-id 456 --no-manually-created
```

## `box integration-mappings:slack:update ID`

Update Slack integration mapping

```
USAGE
  $ box integration-mappings:slack:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--box-item-id <value>]
    [--disable-access-management]

ARGUMENTS
  ID  ID of an integration mapping

FLAGS
  -h, --help                            Show CLI help
  -q, --quiet                           Suppress any non-error output to stderr
  -s, --save                            Save report to default reports folder on disk
  -t, --token=<value>                   Provide a token to perform this call
  -v, --verbose                         Show verbose output, which can be helpful for debugging
  -y, --yes                             Automatically respond yes to all confirmation prompts
      --as-user=<value>                 Provide an ID for a user
      --box-item-id=<value>             ID of the mapped folder
      --bulk-file-path=<value>          File path to bulk .csv or .json objects
      --csv                             Output formatted CSV
      --[no-]disable-access-management  Indicates whether or not channel member access to the underlying box item should
                                        be automatically managed. Depending on type of channel, access is managed
                                        through creating collaborations or shared links.
      --fields=<value>                  Comma separated list of fields to show
      --json                            Output formatted JSON
      --no-color                        Turn off colors for logging
      --save-to-file-path=<value>       Override default file path to save report

DESCRIPTION
  Update Slack integration mapping

EXAMPLES
  $ box integration-mappings:slack:update 123 --box-item-id 789 --disable-access-management
```

_See code: [src/commands/integration-mappings/slack/update.ts](https://github.com/box/boxcli/blob/v3.15.0/src/commands/integration-mappings/slack/update.ts)_
