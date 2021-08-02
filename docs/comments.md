`box comments`
==============

Manage comments on files

* [`box comments:create FILEID`](#box-commentscreate-fileid)
* [`box comments:delete ID`](#box-commentsdelete-id)
* [`box comments:get ID`](#box-commentsget-id)
* [`box comments:reply ID`](#box-commentsreply-id)
* [`box comments:update ID`](#box-commentsupdate-id)

## `box comments:create FILEID`

Create a comment on a file

```
USAGE
  $ box comments:create FILEID

ARGUMENTS
  FILEID  ID of file on which to comment

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
  --message=message                      Message of comment
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

  --tagged-message=tagged-message        The text of the comment, including @[userid:Username] somewhere in the message
                                         to mention the user

EXAMPLE
  box comments:create 11111 --message "Thanks for the update!"
```

_See code: [src/commands/comments/create.js](https://github.com/box/boxcli/blob/v2.9.0/src/commands/comments/create.js)_

## `box comments:delete ID`

Delete a comment

```
USAGE
  $ box comments:delete ID

ARGUMENTS
  ID  ID of the comment to delete

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
  box comments:delete 12345
```

_See code: [src/commands/comments/delete.js](https://github.com/box/boxcli/blob/v2.9.0/src/commands/comments/delete.js)_

## `box comments:get ID`

Get information about a comment

```
USAGE
  $ box comments:get ID

ARGUMENTS
  ID  ID of the comment to get

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
  box comments:get 12345
```

_See code: [src/commands/comments/get.js](https://github.com/box/boxcli/blob/v2.9.0/src/commands/comments/get.js)_

## `box comments:reply ID`

Reply to a comment

```
USAGE
  $ box comments:reply ID

ARGUMENTS
  ID  ID of the comment to reply to

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
  --message=message                      Message of comment
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report

  --tagged-message=tagged-message        The text of the comment, including @[userid:Username] somewhere in the message
                                         to mention the user

EXAMPLE
  box comments:reply 12345 --message "No problem!"
```

_See code: [src/commands/comments/reply.js](https://github.com/box/boxcli/blob/v2.9.0/src/commands/comments/reply.js)_

## `box comments:update ID`

Update a comment

```
USAGE
  $ box comments:update ID

ARGUMENTS
  ID  ID of the comment to update

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
  --message=message                      The text of the comment
  --no-color                             Turn off colors for logging
  --save-to-file-path=save-to-file-path  Override default file path to save report
  --tagged-message=tagged-message        The tagged text of the comment

EXAMPLE
  box comments:update 12345 --message "Thank you for the update!"
```

_See code: [src/commands/comments/update.js](https://github.com/box/boxcli/blob/v2.9.0/src/commands/comments/update.js)_
