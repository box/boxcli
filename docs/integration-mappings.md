`box integration-mappings`
==========================

List Slack integration mappings

* [`box integration-mappings:slack`](#box-integration-mappingsslack)
* [`box integration-mappings:slack:create BOXITEMID CHANNELID`](#box-integration-mappingsslackcreate-boxitemid-channelid)
* [`box integration-mappings:slack:delete ID`](#box-integration-mappingsslackdelete-id)
* [`box integration-mappings:slack:list`](#box-integration-mappingsslacklist)
* [`box integration-mappings:slack:update ID`](#box-integration-mappingsslackupdate-id)
* [`box integration-mappings:teams`](#box-integration-mappingsteams)
* [`box integration-mappings:teams:create BOXITEMID PARTNERITEMID PARTNERITEMTYPE PARTNERITEMTEAMID PARTNERITEMTENANTID`](#box-integration-mappingsteamscreate-boxitemid-partneritemid-partneritemtype-partneritemteamid-partneritemtenantid)
* [`box integration-mappings:teams:delete ID`](#box-integration-mappingsteamsdelete-id)
* [`box integration-mappings:teams:list`](#box-integration-mappingsteamslist)
* [`box integration-mappings:teams:update ID`](#box-integration-mappingsteamsupdate-id)

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

_See code: [src/commands/integration-mappings/slack/index.js](https://github.com/box/boxcli/blob/v4.4.1/src/commands/integration-mappings/slack/index.js)_

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

_See code: [src/commands/integration-mappings/slack/create.js](https://github.com/box/boxcli/blob/v4.4.1/src/commands/integration-mappings/slack/create.js)_

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

_See code: [src/commands/integration-mappings/slack/delete.js](https://github.com/box/boxcli/blob/v4.4.1/src/commands/integration-mappings/slack/delete.js)_

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

_See code: [src/commands/integration-mappings/slack/update.js](https://github.com/box/boxcli/blob/v4.4.1/src/commands/integration-mappings/slack/update.js)_

## `box integration-mappings:teams`

List Teams integration mappings

```
USAGE
  $ box integration-mappings:teams [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>] [--partner-item-id
    <value>] [--partner-item-type <value>] [--box-item-id <value>] [--box-item-type <value>]

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --box-item-id=<value>        Box item ID, for which the mappings should be returned
      --box-item-type=<value>      Box item type, for which the mappings should be returned, value is one of: folder
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --partner-item-id=<value>    ID of the mapped item, for which the mapping should be returned
      --partner-item-type=<value>  Mapped item type, for which the mapping should be returned, value is one of: channel,
                                   team
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List Teams integration mappings

ALIASES
  $ box integration-mappings:teams:list

EXAMPLES
  $ box integration-mappings:teams --partner-item-id 123 --partner-item-type channel

  $ box integration-mappings:teams --box-item-id 456 --box-item-type folder
```

_See code: [src/commands/integration-mappings/teams/index.js](https://github.com/box/boxcli/blob/v4.4.1/src/commands/integration-mappings/teams/index.js)_

## `box integration-mappings:teams:create BOXITEMID PARTNERITEMID PARTNERITEMTYPE PARTNERITEMTEAMID PARTNERITEMTENANTID`

Create Teams integration mapping

```
USAGE
  $ box integration-mappings:teams:create BOXITEMID PARTNERITEMID PARTNERITEMTYPE PARTNERITEMTEAMID PARTNERITEMTENANTID [-t <value>]
    [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path <value>] [--fields <value>]
    [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  BOXITEMID            ID of the mapped folder
  PARTNERITEMID        ID of the mapped item
  PARTNERITEMTYPE      Type of the mapped item, value is one of: channel, team
  PARTNERITEMTEAMID    ID of the team that is registered with Microsoft Teams
  PARTNERITEMTENANTID  ID of the tenant that is registered with Microsoft Teams

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
  Create Teams integration mapping

EXAMPLES
  $ box integration-mappings:teams:create 123 19%ABCD-Avgfggkggyftdtfgghjhkhkhh%40thread:tacv2 hjgjgjg-bhhj-564a-b643-hghgj685u abcd-defg-1235-7890
```

_See code: [src/commands/integration-mappings/teams/create.js](https://github.com/box/boxcli/blob/v4.4.1/src/commands/integration-mappings/teams/create.js)_

## `box integration-mappings:teams:delete ID`

Delete Teams integration mapping

```
USAGE
  $ box integration-mappings:teams:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
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
  Delete Teams integration mapping

EXAMPLES
  $ box integration-mappings:teams:delete 123
```

_See code: [src/commands/integration-mappings/teams/delete.js](https://github.com/box/boxcli/blob/v4.4.1/src/commands/integration-mappings/teams/delete.js)_

## `box integration-mappings:teams:list`

List Teams integration mappings

```
USAGE
  $ box integration-mappings:teams:list [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>] [--partner-item-id
    <value>] [--partner-item-type <value>] [--box-item-id <value>] [--box-item-type <value>]

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --box-item-id=<value>        Box item ID, for which the mappings should be returned
      --box-item-type=<value>      Box item type, for which the mappings should be returned, value is one of: folder
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --partner-item-id=<value>    ID of the mapped item, for which the mapping should be returned
      --partner-item-type=<value>  Mapped item type, for which the mapping should be returned, value is one of: channel,
                                   team
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List Teams integration mappings

ALIASES
  $ box integration-mappings:teams:list

EXAMPLES
  $ box integration-mappings:teams --partner-item-id 123 --partner-item-type channel

  $ box integration-mappings:teams --box-item-id 456 --box-item-type folder
```

## `box integration-mappings:teams:update ID`

Update Teams integration mapping

```
USAGE
  $ box integration-mappings:teams:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--box-item-id <value>]

ARGUMENTS
  ID  ID of an integration mapping

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --box-item-id=<value>        ID of the mapped folder
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Update Teams integration mapping

EXAMPLES
  $ box integration-mappings:teams:update 123 --box-item-id 789
```

_See code: [src/commands/integration-mappings/teams/update.js](https://github.com/box/boxcli/blob/v4.4.1/src/commands/integration-mappings/teams/update.js)_
