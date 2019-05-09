`box collaborations`
====================

Manage collaborations

* [`box collaborations:delete ID`](#box-collaborationsdelete-id)
* [`box collaborations:get ID`](#box-collaborationsget-id)
* [`box collaborations:pending`](#box-collaborationspending)
* [`box collaborations:update ID`](#box-collaborationsupdate-id)

## `box collaborations:delete ID`

Remove a collaboration

```
USAGE
  $ box collaborations:delete ID

ARGUMENTS
  ID  The ID of the collaboration to delete

OPTIONS
  -h, --help                             Show CLI help
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
  $ box files:collaborations:delete
  $ box folders:collaborations:delete
```

_See code: [src/commands/collaborations/delete.js](https://github.com/box/boxcli/blob/v2.2.0/src/commands/collaborations/delete.js)_

## `box collaborations:get ID`

Get an individual collaboration

```
USAGE
  $ box collaborations:get ID

ARGUMENTS
  ID  ID of the collaboration to get

OPTIONS
  -h, --help                             Show CLI help
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
```

_See code: [src/commands/collaborations/get.js](https://github.com/box/boxcli/blob/v2.2.0/src/commands/collaborations/get.js)_

## `box collaborations:pending`

List all pending collaborations for a user

```
USAGE
  $ box collaborations:pending

OPTIONS
  -h, --help                             Show CLI help
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
  $ box collaborations:get-pending
```

_See code: [src/commands/collaborations/pending.js](https://github.com/box/boxcli/blob/v2.2.0/src/commands/collaborations/pending.js)_

## `box collaborations:update ID`

Update a collaboration

```
USAGE
  $ box collaborations:update ID

ARGUMENTS
  ID  The ID of the collaboration to update

OPTIONS
  -h, --help                                                                                     Show CLI help

  -r, --role=editor|viewer|previewer|uploader|previewer_uploader|viewer_uploader|co-owner|owner  An option to manually
                                                                                                 enter the role

  -s, --save                                                                                     Save report to default
                                                                                                 reports folder on disk

  -t, --token=token                                                                              Provide a token to
                                                                                                 perform this call

  -v, --verbose                                                                                  Show verbose output,
                                                                                                 which can be helpful
                                                                                                 for debugging

  -y, --yes                                                                                      Automatically respond
                                                                                                 yes to all confirmation
                                                                                                 prompts

  --as-user=as-user                                                                              Provide an ID for a
                                                                                                 user

  --bulk-file-path=bulk-file-path                                                                File path to bulk .csv
                                                                                                 or .json objects

  --[no-]can-view-path                                                                           Whether view path
                                                                                                 collaboration feature
                                                                                                 is enabled or not

  --csv                                                                                          Output formatted CSV

  --expires-at=expires-at                                                                        When the collaboration
                                                                                                 should expire

  --fields=fields                                                                                Comma separated list of
                                                                                                 fields to show

  --json                                                                                         Output formatted JSON

  --no-color                                                                                     Turn off colors for
                                                                                                 logging

  --save-to-file-path=save-to-file-path                                                          Override default file
                                                                                                 path to save report

  --status=accepted|pending|rejected                                                             Update the
                                                                                                 collaboration status

ALIASES
  $ box files:collaborations:update
  $ box folders:collaborations:update
```

_See code: [src/commands/collaborations/update.js](https://github.com/box/boxcli/blob/v2.2.0/src/commands/collaborations/update.js)_
