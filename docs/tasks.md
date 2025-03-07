`box tasks`
===========

Manage tasks

* [`box tasks:assign TASKID`](#box-tasksassign-taskid)
* [`box tasks:assignments ID`](#box-tasksassignments-id)
* [`box tasks:assignments:delete ID`](#box-tasksassignmentsdelete-id)
* [`box tasks:assignments:get ID`](#box-tasksassignmentsget-id)
* [`box tasks:assignments:update ID`](#box-tasksassignmentsupdate-id)
* [`box tasks:create FILEID`](#box-taskscreate-fileid)
* [`box tasks:delete ID`](#box-tasksdelete-id)
* [`box tasks:get ID`](#box-tasksget-id)
* [`box tasks:update ID`](#box-tasksupdate-id)

## `box tasks:assign TASKID`

Create a task assignment

```
USAGE
  $ box tasks:assign TASKID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--assign-to-user-id
    <value> | --assign-to-user-login <value>]

ARGUMENTS
  TASKID  ID of the task to assign

FLAGS
  -h, --help                          Show CLI help
  -q, --quiet                         Suppress any non-error output to stderr
  -s, --save                          Save report to default reports folder on disk
  -t, --token=<value>                 Provide a token to perform this call
  -v, --verbose                       Show verbose output, which can be helpful for debugging
  -y, --yes                           Automatically respond yes to all confirmation prompts
      --as-user=<value>               Provide an ID for a user
      --assign-to-user-id=<value>     Assign task by user ID
      --assign-to-user-login=<value>  Assign task by user login
      --bulk-file-path=<value>        File path to bulk .csv or .json objects
      --csv                           Output formatted CSV
      --fields=<value>                Comma separated list of fields to show
      --json                          Output formatted JSON
      --no-color                      Turn off colors for logging
      --save-to-file-path=<value>     Override default file path to save report

DESCRIPTION
  Create a task assignment

ALIASES
  $ box task-assignments:create

EXAMPLES
  $ box tasks:assign 88888 --assign-to-user-id 33333
```

_See code: [src/commands/tasks/assign.js](https://github.com/box/boxcli/blob/v4.0.1/src/commands/tasks/assign.js)_

## `box tasks:assignments ID`

List all task assignments on a task

```
USAGE
  $ box tasks:assignments ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the task to get assignments for

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
  List all task assignments on a task

ALIASES
  $ box task-assignments:list

EXAMPLES
  $ box tasks:assignments 88888
```

_See code: [src/commands/tasks/assignments/index.js](https://github.com/box/boxcli/blob/v4.0.1/src/commands/tasks/assignments/index.js)_

## `box tasks:assignments:delete ID`

Delete a task assignment

```
USAGE
  $ box tasks:assignments:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the task assignment to delete

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
  Delete a task assignment

ALIASES
  $ box task-assignments:delete

EXAMPLES
  $ box tasks:assignments:delete 12345
```

_See code: [src/commands/tasks/assignments/delete.js](https://github.com/box/boxcli/blob/v4.0.1/src/commands/tasks/assignments/delete.js)_

## `box tasks:assignments:get ID`

Get information about a task assignment

```
USAGE
  $ box tasks:assignments:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the task assignment to get

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
  Get information about a task assignment

ALIASES
  $ box task-assignments:get

EXAMPLES
  $ box tasks:assignments:get 12345
```

_See code: [src/commands/tasks/assignments/get.js](https://github.com/box/boxcli/blob/v4.0.1/src/commands/tasks/assignments/get.js)_

## `box tasks:assignments:update ID`

Update a task assignment

```
USAGE
  $ box tasks:assignments:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--message <value>] [--status
    completed|incomplete|approved|rejected |  |  |  | ]

ARGUMENTS
  ID  ID of the task assignment to update

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
      --message=<value>            A message from the assignee about this task
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report
      --status=<option>            Set the resolution state of the task assignment
                                   <options: completed|incomplete|approved|rejected>

DESCRIPTION
  Update a task assignment

ALIASES
  $ box task-assignments:update

EXAMPLES
  $ box tasks:assignments:update 12345 --status approved
```

_See code: [src/commands/tasks/assignments/update.js](https://github.com/box/boxcli/blob/v4.0.1/src/commands/tasks/assignments/update.js)_

## `box tasks:create FILEID`

Create a task on a file

```
USAGE
  $ box tasks:create FILEID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--message <value>]
    [--due-at <value>] [--id-only] [--completion-rule all_assignees|any_assignee]

ARGUMENTS
  FILEID  ID of the file to create a task on

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --completion-rule=<option>   Rule for how many assignees must complete the task to consider it completed
                                   <options: all_assignees|any_assignee>
      --csv                        Output formatted CSV
      --due-at=<value>             When this task is due, use format 05h for 5 hours for example
      --fields=<value>             Comma separated list of fields to show
      --id-only                    Return only an ID to output from this command
      --json                       Output formatted JSON
      --message=<value>            Message for task
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Create a task on a file

EXAMPLES
  $ box tasks:create 11111 --message "Please proofread this document"
```

_See code: [src/commands/tasks/create.js](https://github.com/box/boxcli/blob/v4.0.1/src/commands/tasks/create.js)_

## `box tasks:delete ID`

Delete a task

```
USAGE
  $ box tasks:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the task to delete

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
  Delete a task

EXAMPLES
  $ box tasks:delete 88888
```

_See code: [src/commands/tasks/delete.js](https://github.com/box/boxcli/blob/v4.0.1/src/commands/tasks/delete.js)_

## `box tasks:get ID`

Get information about a task

```
USAGE
  $ box tasks:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the task to get

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
  Get information about a task

EXAMPLES
  $ box tasks:get 88888
```

_See code: [src/commands/tasks/get.js](https://github.com/box/boxcli/blob/v4.0.1/src/commands/tasks/get.js)_

## `box tasks:update ID`

Update a task on a file

```
USAGE
  $ box tasks:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--message <value>] [--due-at <value>]
    [--completion-rule all_assignees|any_assignee]

ARGUMENTS
  ID  ID of the task to update

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --completion-rule=<option>   Rule for how many assignees must complete the task to consider it completed
                                   <options: all_assignees|any_assignee>
      --csv                        Output formatted CSV
      --due-at=<value>             When this task is due, use format 05h for 5 hours for example
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --message=<value>            Message for task
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Update a task on a file

EXAMPLES
  $ box tasks:update 88888 --due-at 1w
```

_See code: [src/commands/tasks/update.js](https://github.com/box/boxcli/blob/v4.0.1/src/commands/tasks/update.js)_
