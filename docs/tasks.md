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
  $ box tasks:assign TASKID

ARGUMENTS
  TASKID  ID of the task to assign

OPTIONS
  -h, --help                                   Show CLI help
  -q, --quiet                                  Suppress any non-error output to stderr
  -s, --save                                   Save report to default reports folder on disk
  -t, --token=token                            Provide a token to perform this call
  -v, --verbose                                Show verbose output, which can be helpful for debugging
  -y, --yes                                    Automatically respond yes to all confirmation prompts
  --as-user=as-user                            Provide an ID for a user
  --assign-to-user-id=assign-to-user-id        Assign task by user ID
  --assign-to-user-login=assign-to-user-login  Assign task by user login
  --bulk-file-path=bulk-file-path              File path to bulk .csv or .json objects
  --csv                                        Output formatted CSV
  --fields=fields                              Comma separated list of fields to show
  --json                                       Output formatted JSON
  --no-color                                   Turn off colors for logging
  --save-to-file-path=save-to-file-path        Override default file path to save report

ALIASES
  $ box task-assignments:create

EXAMPLE
  box tasks:assign 88888 --assign-to-user-id 33333
```

_See code: [src/commands/tasks/assign.js](https://github.com/box/boxcli/blob/v3.16.0/src/commands/tasks/assign.js)_

## `box tasks:assignments ID`

List all task assignments on a task

```
USAGE
  $ box tasks:assignments ID

ARGUMENTS
  ID  ID of the task to get assignments for

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
  $ box task-assignments:list

EXAMPLE
  box tasks:assignments 88888
```

_See code: [src/commands/tasks/assignments/index.js](https://github.com/box/boxcli/blob/v3.16.0/src/commands/tasks/assignments/index.js)_

## `box tasks:assignments:delete ID`

Delete a task assignment

```
USAGE
  $ box tasks:assignments:delete ID

ARGUMENTS
  ID  ID of the task assignment to delete

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
  $ box task-assignments:delete

EXAMPLE
  box tasks:assignments:delete 12345
```

_See code: [src/commands/tasks/assignments/delete.js](https://github.com/box/boxcli/blob/v3.16.0/src/commands/tasks/assignments/delete.js)_

## `box tasks:assignments:get ID`

Get information about a task assignment

```
USAGE
  $ box tasks:assignments:get ID

ARGUMENTS
  ID  ID of the task assignment to get

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
  $ box task-assignments:get

EXAMPLE
  box tasks:assignments:get 12345
```

_See code: [src/commands/tasks/assignments/get.js](https://github.com/box/boxcli/blob/v3.16.0/src/commands/tasks/assignments/get.js)_

## `box tasks:assignments:update ID`

Update a task assignment

```
USAGE
  $ box tasks:assignments:update ID

ARGUMENTS
  ID  ID of the task assignment to update

OPTIONS
  -h, --help                                       Show CLI help
  -q, --quiet                                      Suppress any non-error output to stderr
  -s, --save                                       Save report to default reports folder on disk
  -t, --token=token                                Provide a token to perform this call
  -v, --verbose                                    Show verbose output, which can be helpful for debugging
  -y, --yes                                        Automatically respond yes to all confirmation prompts
  --as-user=as-user                                Provide an ID for a user
  --bulk-file-path=bulk-file-path                  File path to bulk .csv or .json objects
  --csv                                            Output formatted CSV
  --fields=fields                                  Comma separated list of fields to show
  --json                                           Output formatted JSON
  --message=message                                A message from the assignee about this task
  --no-color                                       Turn off colors for logging
  --save-to-file-path=save-to-file-path            Override default file path to save report
  --status=completed|incomplete|approved|rejected  Set the resolution state of the task assignment

ALIASES
  $ box task-assignments:update

EXAMPLE
  box tasks:assignments:update 12345 --status approved
```

_See code: [src/commands/tasks/assignments/update.js](https://github.com/box/boxcli/blob/v3.16.0/src/commands/tasks/assignments/update.js)_

## `box tasks:create FILEID`

Create a task on a file

```
USAGE
  $ box tasks:create FILEID

ARGUMENTS
  FILEID  ID of the file to create a task on

OPTIONS
  -h, --help                                    Show CLI help
  -q, --quiet                                   Suppress any non-error output to stderr
  -s, --save                                    Save report to default reports folder on disk
  -t, --token=token                             Provide a token to perform this call
  -v, --verbose                                 Show verbose output, which can be helpful for debugging
  -y, --yes                                     Automatically respond yes to all confirmation prompts
  --as-user=as-user                             Provide an ID for a user
  --bulk-file-path=bulk-file-path               File path to bulk .csv or .json objects

  --completion-rule=all_assignees|any_assignee  Rule for how many assignees must complete the task to consider it
                                                completed

  --csv                                         Output formatted CSV

  --due-at=due-at                               When this task is due, use format 05h for 5 hours for example

  --fields=fields                               Comma separated list of fields to show

  --id-only                                     Return only an ID to output from this command

  --json                                        Output formatted JSON

  --message=message                             Message for task

  --no-color                                    Turn off colors for logging

  --save-to-file-path=save-to-file-path         Override default file path to save report

EXAMPLE
  box tasks:create 11111 --message "Please proofread this document"
```

_See code: [src/commands/tasks/create.js](https://github.com/box/boxcli/blob/v3.16.0/src/commands/tasks/create.js)_

## `box tasks:delete ID`

Delete a task

```
USAGE
  $ box tasks:delete ID

ARGUMENTS
  ID  ID of the task to delete

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
  box tasks:delete 88888
```

_See code: [src/commands/tasks/delete.js](https://github.com/box/boxcli/blob/v3.16.0/src/commands/tasks/delete.js)_

## `box tasks:get ID`

Get information about a task

```
USAGE
  $ box tasks:get ID

ARGUMENTS
  ID  ID of the task to get

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
  box tasks:get 88888
```

_See code: [src/commands/tasks/get.js](https://github.com/box/boxcli/blob/v3.16.0/src/commands/tasks/get.js)_

## `box tasks:update ID`

Update a task on a file

```
USAGE
  $ box tasks:update ID

ARGUMENTS
  ID  ID of the task to update

OPTIONS
  -h, --help                                    Show CLI help
  -q, --quiet                                   Suppress any non-error output to stderr
  -s, --save                                    Save report to default reports folder on disk
  -t, --token=token                             Provide a token to perform this call
  -v, --verbose                                 Show verbose output, which can be helpful for debugging
  -y, --yes                                     Automatically respond yes to all confirmation prompts
  --as-user=as-user                             Provide an ID for a user
  --bulk-file-path=bulk-file-path               File path to bulk .csv or .json objects

  --completion-rule=all_assignees|any_assignee  Rule for how many assignees must complete the task to consider it
                                                completed

  --csv                                         Output formatted CSV

  --due-at=due-at                               When this task is due, use format 05h for 5 hours for example

  --fields=fields                               Comma separated list of fields to show

  --json                                        Output formatted JSON

  --message=message                             Message for task

  --no-color                                    Turn off colors for logging

  --save-to-file-path=save-to-file-path         Override default file path to save report

EXAMPLE
  box tasks:update 88888 --due-at 1w
```

_See code: [src/commands/tasks/update.js](https://github.com/box/boxcli/blob/v3.16.0/src/commands/tasks/update.js)_
