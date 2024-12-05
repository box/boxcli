`box integration-mappings`
==========================

List Slack integration mappings

* [`box integration-mappings:slack`](#box-integration-mappingsslack)
* [`box integration-mappings:slack:create BOXITEMID CHANNELID`](#box-integration-mappingsslackcreate-boxitemid-channelid)
* [`box integration-mappings:slack:delete ID`](#box-integration-mappingsslackdelete-id)
* [`box integration-mappings:slack:update ID`](#box-integration-mappingsslackupdate-id)

## `box integration-mappings:slack`

List Slack integration mappings

```
USAGE
  $ box integration-mappings:slack

OPTIONS
  -h, --help                             Show CLI help
  -q, --quiet                            Suppress any non-error output to stderr
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --box-item-id=box-item-id              ID of the mapped Box folder, for which the mapping should be returned
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON
  --[no-]manually-created                Whether the mapping has been manually created

  --max-items=max-items                  A value that indicates the maximum number of results to return. This only
                                         specifies a maximum boundary and will not guarantee the minimum number of
                                         results returned. When the max-items (x) is greater than 1000, then the maximum
                                         ceil(x/1000) requests will be made.

  --no-color                             Turn off colors for logging

  --partner-item-id=partner-item-id      ID of the mapped Slack channel, for which the mapping should be returned

  --save-to-file-path=save-to-file-path  Override default file path to save report

ALIASES
  $ box integration-mappings:slack:list

EXAMPLES
  box integration-mappings:slack --partner-item-id 123 --manually-created
  box integration-mappings:slack --box-item-id 456 --no-manually-created
```

_See code: [src/commands/integration-mappings/slack/index.js](https://github.com/box/boxcli/blob/v3.16.0/src/commands/integration-mappings/slack/index.js)_

## `box integration-mappings:slack:create BOXITEMID CHANNELID`

Create Slack integration mapping

```
USAGE
  $ box integration-mappings:slack:create BOXITEMID CHANNELID

ARGUMENTS
  BOXITEMID  ID of the mapped folder
  CHANNELID  ID of the mapped Slack channel

OPTIONS
  -h, --help                               Show CLI help
  -q, --quiet                              Suppress any non-error output to stderr
  -s, --save                               Save report to default reports folder on disk
  -t, --token=token                        Provide a token to perform this call
  -v, --verbose                            Show verbose output, which can be helpful for debugging
  -y, --yes                                Automatically respond yes to all confirmation prompts
  --as-user=as-user                        Provide an ID for a user
  --bulk-file-path=bulk-file-path          File path to bulk .csv or .json objects
  --csv                                    Output formatted CSV

  --[no-]disable-access-management         Indicates whether or not channel member access to the underlying box item
                                           should be automatically managed. Depending on type of channel, access is
                                           managed through creating collaborations or shared links.

  --fields=fields                          Comma separated list of fields to show

  --json                                   Output formatted JSON

  --no-color                               Turn off colors for logging

  --save-to-file-path=save-to-file-path    Override default file path to save report

  --slack-org-id=slack-org-id              ID of the Slack organization with which the item would be associated

  --slack-workspace-id=slack-workspace-id  ID of the Slack workspace with which the item would be associated

EXAMPLES
  box integration-mappings:slack:create 123 AB89X56Y --slack-org-id 789
  box integration-mappings:slack:create 123 AB89X56Y --slack-workspace-id 999 --disable-access-management
```

_See code: [src/commands/integration-mappings/slack/create.js](https://github.com/box/boxcli/blob/v3.16.0/src/commands/integration-mappings/slack/create.js)_

## `box integration-mappings:slack:delete ID`

Delete Slack integration mapping

```
USAGE
  $ box integration-mappings:slack:delete ID

ARGUMENTS
  ID  ID of the integration mapping

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
  box integration-mappings:slack:delete 123
```

_See code: [src/commands/integration-mappings/slack/delete.js](https://github.com/box/boxcli/blob/v3.16.0/src/commands/integration-mappings/slack/delete.js)_

## `box integration-mappings:slack:update ID`

Update Slack integration mapping

```
USAGE
  $ box integration-mappings:slack:update ID

ARGUMENTS
  ID  ID of an integration mapping

OPTIONS
  -h, --help                             Show CLI help
  -q, --quiet                            Suppress any non-error output to stderr
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --box-item-id=box-item-id              ID of the mapped folder
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV

  --[no-]disable-access-management       Indicates whether or not channel member access to the underlying box item
                                         should be automatically managed. Depending on type of channel, access is
                                         managed through creating collaborations or shared links.

  --fields=fields                        Comma separated list of fields to show

  --json                                 Output formatted JSON

  --no-color                             Turn off colors for logging

  --save-to-file-path=save-to-file-path  Override default file path to save report

EXAMPLE
  box integration-mappings:slack:update 123 --box-item-id 789 --disable-access-management
```

_See code: [src/commands/integration-mappings/slack/update.js](https://github.com/box/boxcli/blob/v3.16.0/src/commands/integration-mappings/slack/update.js)_
