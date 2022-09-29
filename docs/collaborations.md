`box collaborations`
====================

Manage collaborations

* [`box collaborations:create ITEMID ITEMTYPE`](#box-collaborationscreate-itemid-itemtype)
* [`box collaborations:delete ID`](#box-collaborationsdelete-id)
* [`box collaborations:get ID`](#box-collaborationsget-id)
* [`box collaborations:pending`](#box-collaborationspending)
* [`box collaborations:update ID`](#box-collaborationsupdate-id)

## `box collaborations:create ITEMID ITEMTYPE`

Create a collaboration for a Box item

```
USAGE
  $ box collaborations:create ITEMID ITEMTYPE

ARGUMENTS
  ITEMID    The ID of the Box item to add the collaboration to
  ITEMTYPE  (file|folder) The type of the Box item to add the collaboration to

OPTIONS
  -h, --help                                                                               Show CLI help

  -q, --quiet                                                                              Suppress any non-error output
                                                                                           to stderr

  -r, --role=editor|viewer|previewer|uploader|previewer_uploader|viewer_uploader|co-owner  An option to manually enter
                                                                                           the role

  -s, --save                                                                               Save report to default
                                                                                           reports folder on disk

  -t, --token=token                                                                        Provide a token to perform
                                                                                           this call

  -v, --verbose                                                                            Show verbose output, which
                                                                                           can be helpful for debugging

  -y, --yes                                                                                Automatically respond yes to
                                                                                           all confirmation prompts

  --as-user=as-user                                                                        Provide an ID for a user

  --bulk-file-path=bulk-file-path                                                          File path to bulk .csv or
                                                                                           .json objects

  --[no-]can-view-path                                                                     Whether view path
                                                                                           collaboration feature is
                                                                                           enabled or not

  --csv                                                                                    Output formatted CSV

  --fields=fields                                                                          Comma separated list of
                                                                                           fields to show

  --group-id=group-id                                                                      Id for group to collaborate

  --id-only                                                                                Return only an ID to output
                                                                                           from this command

  --json                                                                                   Output formatted JSON

  --login=login                                                                            Login for user to collaborate

  --no-color                                                                               Turn off colors for logging

  --[no-]notify                                                                            All users will receive email
                                                                                           notification of the
                                                                                           collaboration

  --save-to-file-path=save-to-file-path                                                    Override default file path to
                                                                                           save report

  --user-id=user-id                                                                        Id for user to collaborate

ALIASES
  $ box collaborations:add

EXAMPLE
  box collaborations:create 22222 folder --role editor --user-id 33333
```

_See code: [src/commands/collaborations/create.js](https://github.com/box/boxcli/blob/v3.4.0/src/commands/collaborations/create.js)_

## `box collaborations:delete ID`

Remove a collaboration

```
USAGE
  $ box collaborations:delete ID

ARGUMENTS
  ID  The ID of the collaboration to delete

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
  $ box files:collaborations:delete
  $ box folders:collaborations:delete

EXAMPLE
  box collaborations:delete 12345
```

_See code: [src/commands/collaborations/delete.js](https://github.com/box/boxcli/blob/v3.4.0/src/commands/collaborations/delete.js)_

## `box collaborations:get ID`

Get an individual collaboration

```
USAGE
  $ box collaborations:get ID

ARGUMENTS
  ID  ID of the collaboration to get

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
  box collaborations:get 12345
```

_See code: [src/commands/collaborations/get.js](https://github.com/box/boxcli/blob/v3.4.0/src/commands/collaborations/get.js)_

## `box collaborations:pending`

List all pending collaborations for a user

```
USAGE
  $ box collaborations:pending

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
  $ box collaborations:get-pending

EXAMPLE
  box collaborations:pending
```

_See code: [src/commands/collaborations/pending.js](https://github.com/box/boxcli/blob/v3.4.0/src/commands/collaborations/pending.js)_

## `box collaborations:update ID`

Update a collaboration

```
USAGE
  $ box collaborations:update ID

ARGUMENTS
  ID  The ID of the collaboration to update

OPTIONS
  -h, --help                                                                                     Show CLI help

  -q, --quiet                                                                                    Suppress any non-error
                                                                                                 output to stderr

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

EXAMPLE
  box collaborations:update 12345 --role viewer
```

_See code: [src/commands/collaborations/update.js](https://github.com/box/boxcli/blob/v3.4.0/src/commands/collaborations/update.js)_
