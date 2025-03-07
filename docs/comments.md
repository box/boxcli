`box comments`
==============

Manage comments on files

* [`box comments:create FILEID`](#box-commentscreate-fileid)
* [`box comments:delete ID`](#box-commentsdelete-id)
* [`box comments:get ID`](#box-commentsget-id)
* [`box comments:list ID`](#box-commentslist-id)
* [`box comments:reply ID`](#box-commentsreply-id)
* [`box comments:update ID`](#box-commentsupdate-id)

## `box comments:create FILEID`

Create a comment on a file

```
USAGE
  $ box comments:create FILEID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--message <value> |
    --tagged-message <value>]

ARGUMENTS
  FILEID  ID of file on which to comment

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
      --message=<value>            Message of comment
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report
      --tagged-message=<value>     The text of the comment, including @[userid:Username] somewhere in the message to
                                   mention the user

DESCRIPTION
  Create a comment on a file

EXAMPLES
  $ box comments:create 11111 --message "Thanks for the update!"
```

_See code: [src/commands/comments/create.js](https://github.com/box/boxcli/blob/v4.0.1/src/commands/comments/create.js)_

## `box comments:delete ID`

Delete a comment

```
USAGE
  $ box comments:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the comment to delete

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
  Delete a comment

EXAMPLES
  $ box comments:delete 12345
```

_See code: [src/commands/comments/delete.js](https://github.com/box/boxcli/blob/v4.0.1/src/commands/comments/delete.js)_

## `box comments:get ID`

Get information about a comment

```
USAGE
  $ box comments:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the comment to get

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
  Get information about a comment

EXAMPLES
  $ box comments:get 12345
```

_See code: [src/commands/comments/get.js](https://github.com/box/boxcli/blob/v4.0.1/src/commands/comments/get.js)_

## `box comments:list ID`

List all comments on a file

```
USAGE
  $ box comments:list ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the file to get comments for

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
  List all comments on a file

ALIASES
  $ box comments:list

EXAMPLES
  $ box files:comments 11111
```

## `box comments:reply ID`

Reply to a comment

```
USAGE
  $ box comments:reply ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--message <value> | --tagged-message
    <value>]

ARGUMENTS
  ID  ID of the comment to reply to

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
      --message=<value>            Message of comment
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report
      --tagged-message=<value>     The text of the comment, including @[userid:Username] somewhere in the message to
                                   mention the user

DESCRIPTION
  Reply to a comment

EXAMPLES
  $ box comments:reply 12345 --message "No problem!"
```

_See code: [src/commands/comments/reply.js](https://github.com/box/boxcli/blob/v4.0.1/src/commands/comments/reply.js)_

## `box comments:update ID`

Update a comment

```
USAGE
  $ box comments:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--message <value> | --tagged-message
    <value>]

ARGUMENTS
  ID  ID of the comment to update

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
      --message=<value>            The text of the comment
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report
      --tagged-message=<value>     The tagged text of the comment

DESCRIPTION
  Update a comment

EXAMPLES
  $ box comments:update 12345 --message "Thank you for the update!"
```

_See code: [src/commands/comments/update.js](https://github.com/box/boxcli/blob/v4.0.1/src/commands/comments/update.js)_
