`box shuttle`
=============

Manage Box Shuttle migration jobs, systems, mappings, schedules, runs and reports

* [`box shuttle:discovered-subjects`](#box-shuttlediscovered-subjects)
* [`box shuttle:discovered-subjects:list`](#box-shuttlediscovered-subjectslist)
* [`box shuttle:job-schedules`](#box-shuttlejob-schedules)
* [`box shuttle:job-schedules:create`](#box-shuttlejob-schedulescreate)
* [`box shuttle:job-schedules:delete ID`](#box-shuttlejob-schedulesdelete-id)
* [`box shuttle:job-schedules:get ID`](#box-shuttlejob-schedulesget-id)
* [`box shuttle:job-schedules:list`](#box-shuttlejob-scheduleslist)
* [`box shuttle:job-schedules:update ID`](#box-shuttlejob-schedulesupdate-id)
* [`box shuttle:jobs`](#box-shuttlejobs)
* [`box shuttle:jobs:create NAME`](#box-shuttlejobscreate-name)
* [`box shuttle:jobs:delete ID`](#box-shuttlejobsdelete-id)
* [`box shuttle:jobs:get ID`](#box-shuttlejobsget-id)
* [`box shuttle:jobs:list`](#box-shuttlejobslist)
* [`box shuttle:jobs:prepare-migration ID`](#box-shuttlejobsprepare-migration-id)
* [`box shuttle:jobs:start ID`](#box-shuttlejobsstart-id)
* [`box shuttle:jobs:stop ID`](#box-shuttlejobsstop-id)
* [`box shuttle:jobs:update ID`](#box-shuttlejobsupdate-id)
* [`box shuttle:mapping-errors`](#box-shuttlemapping-errors)
* [`box shuttle:mapping-errors:list`](#box-shuttlemapping-errorslist)
* [`box shuttle:path-entries`](#box-shuttlepath-entries)
* [`box shuttle:path-entries:list`](#box-shuttlepath-entrieslist)
* [`box shuttle:path-mapping-imports:create`](#box-shuttlepath-mapping-importscreate)
* [`box shuttle:path-mappings`](#box-shuttlepath-mappings)
* [`box shuttle:path-mappings:create`](#box-shuttlepath-mappingscreate)
* [`box shuttle:path-mappings:delete ID`](#box-shuttlepath-mappingsdelete-id)
* [`box shuttle:path-mappings:get ID`](#box-shuttlepath-mappingsget-id)
* [`box shuttle:path-mappings:list`](#box-shuttlepath-mappingslist)
* [`box shuttle:path-mappings:update ID`](#box-shuttlepath-mappingsupdate-id)
* [`box shuttle:reports`](#box-shuttlereports)
* [`box shuttle:reports:create`](#box-shuttlereportscreate)
* [`box shuttle:reports:get ID`](#box-shuttlereportsget-id)
* [`box shuttle:reports:list`](#box-shuttlereportslist)
* [`box shuttle:runs`](#box-shuttleruns)
* [`box shuttle:runs:get ID`](#box-shuttlerunsget-id)
* [`box shuttle:runs:list`](#box-shuttlerunslist)
* [`box shuttle:subject-mapping-imports:create`](#box-shuttlesubject-mapping-importscreate)
* [`box shuttle:subject-mappings`](#box-shuttlesubject-mappings)
* [`box shuttle:subject-mappings:create`](#box-shuttlesubject-mappingscreate)
* [`box shuttle:subject-mappings:delete ID`](#box-shuttlesubject-mappingsdelete-id)
* [`box shuttle:subject-mappings:get ID`](#box-shuttlesubject-mappingsget-id)
* [`box shuttle:subject-mappings:list`](#box-shuttlesubject-mappingslist)
* [`box shuttle:subject-mappings:update ID`](#box-shuttlesubject-mappingsupdate-id)
* [`box shuttle:systems`](#box-shuttlesystems)
* [`box shuttle:systems:create NAME`](#box-shuttlesystemscreate-name)
* [`box shuttle:systems:delete ID`](#box-shuttlesystemsdelete-id)
* [`box shuttle:systems:get ID`](#box-shuttlesystemsget-id)
* [`box shuttle:systems:issue-registration-token ID`](#box-shuttlesystemsissue-registration-token-id)
* [`box shuttle:systems:list`](#box-shuttlesystemslist)
* [`box shuttle:systems:update ID`](#box-shuttlesystemsupdate-id)

## `box shuttle:discovered-subjects`

List the users and groups discovered on the source system of a Box Shuttle job, with a suggested Box target when the scan inferred one

```
USAGE
  $ box shuttle:discovered-subjects --job-id <value> [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

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
      --job-id=<value>             (required) ID of the shuttle job whose discovered subjects to list
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List the users and groups discovered on the source system of a Box Shuttle job, with a suggested Box target when the
  scan inferred one

ALIASES
  $ box shuttle:discovered-subjects:list

EXAMPLES
  $ box shuttle:discovered-subjects --job-id 6a3ba68e810d9156194530a1
```

_See code: [src/commands/shuttle/discovered-subjects/index.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/discovered-subjects/index.js)_

## `box shuttle:discovered-subjects:list`

List the users and groups discovered on the source system of a Box Shuttle job, with a suggested Box target when the scan inferred one

```
USAGE
  $ box shuttle:discovered-subjects:list --job-id <value> [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

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
      --job-id=<value>             (required) ID of the shuttle job whose discovered subjects to list
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List the users and groups discovered on the source system of a Box Shuttle job, with a suggested Box target when the
  scan inferred one

ALIASES
  $ box shuttle:discovered-subjects:list

EXAMPLES
  $ box shuttle:discovered-subjects --job-id 6a3ba68e810d9156194530a1
```

## `box shuttle:job-schedules`

List the schedules of a Box Shuttle job

```
USAGE
  $ box shuttle:job-schedules --job-id <value> [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

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
      --job-id=<value>             (required) ID of the shuttle job whose schedules to list
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List the schedules of a Box Shuttle job

ALIASES
  $ box shuttle:job-schedules:list

EXAMPLES
  $ box shuttle:job-schedules --job-id 6a3ba68e810d9156194530a1
```

_See code: [src/commands/shuttle/job-schedules/index.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/job-schedules/index.js)_

## `box shuttle:job-schedules:create`

Create a schedule that starts runs of a Box Shuttle job, either at a wall-clock time (--trigger-type=by_time) or after another job's run meets a condition (--trigger-type=by_job). Schedules cannot start a run in scan mode

```
USAGE
  $ box shuttle:job-schedules:create --job-id <value> --run-mode transfer|simulation|analysis --trigger-type by_time|by_job [-t
    <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path <value>] [--fields <value>]
    [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--state enabled|paused] [--description <value>] [--start-at <value>]
    [--time-zone <value>] [--repeat none|daily|weekly|weekdays|weekends] [--triggered-by-job-id <value>]
    [--last-run-condition always|on_success|on_finish]

FLAGS
  -h, --help                         Show CLI help
  -q, --quiet                        Suppress any non-error output to stderr
  -s, --save                         Save report to default reports folder on disk
  -t, --token=<value>                Provide a token to perform this call
  -v, --verbose                      Show verbose output, which can be helpful for debugging
  -y, --yes                          Automatically respond yes to all confirmation prompts
      --as-user=<value>              Provide an ID for a user
      --bulk-file-path=<value>       File path to bulk .csv or .json objects
      --csv                          Output formatted CSV
      --description=<value>          Human-readable description of the schedule
      --fields=<value>               Comma separated list of fields to show
      --job-id=<value>               (required) ID of the shuttle job this schedule belongs to
      --json                         Output formatted JSON
      --last-run-condition=<option>  When to start a run relative to the last run of the triggering job. One of: always,
                                     on_success, on_finish. Only with --trigger-type=by_job
                                     <options: always|on_success|on_finish>
      --no-color                     Turn off colors for logging
      --repeat=<option>              How often the schedule repeats after --start-at. One of: none, daily, weekly,
                                     weekdays, weekends. Only with --trigger-type=by_time
                                     <options: none|daily|weekly|weekdays|weekends>
      --run-mode=<option>            (required) Kind of run the schedule starts. One of: transfer, simulation, analysis.
                                     scan is not a valid schedule run mode
                                     <options: transfer|simulation|analysis>
      --save-to-file-path=<value>    Override default file path to save report
      --start-at=<value>             Local wall-clock time of the first run, without an offset or Z suffix, such as
                                     2030-01-01T09:00:00. Combined with --time-zone. Only with --trigger-type=by_time
      --state=<option>               Whether the schedule is active. One of: enabled, paused. The API uses enabled when
                                     omitted
                                     <options: enabled|paused>
      --time-zone=<value>            IANA time zone that gives --start-at its meaning, such as America/Los_Angeles.
                                     Recurrence and DST are evaluated in this zone. Only with --trigger-type=by_time
      --trigger-type=<option>        (required) When the schedule starts a run. One of: by_time (at a wall-clock time;
                                     needs --start-at, --time-zone and --repeat), by_job (after a run of another job;
                                     needs --triggered-by-job-id and --last-run-condition)
                                     <options: by_time|by_job>
      --triggered-by-job-id=<value>  ID of the shuttle job whose run starts this schedule. Only with
                                     --trigger-type=by_job

DESCRIPTION
  Create a schedule that starts runs of a Box Shuttle job, either at a wall-clock time (--trigger-type=by_time) or after
  another job's run meets a condition (--trigger-type=by_job). Schedules cannot start a run in scan mode

EXAMPLES
  $ box shuttle:job-schedules:create --job-id 6a3ba68e810d9156194530a1 --run-mode transfer --trigger-type by_time --start-at 2030-01-01T09:00:00 --time-zone America/Los_Angeles --repeat daily

  $ box shuttle:job-schedules:create --job-id 6a3ba68e810d9156194530a1 --run-mode simulation --state paused --trigger-type by_job --triggered-by-job-id 6a3ba68e810d9156194530a2 --last-run-condition on_success
```

_See code: [src/commands/shuttle/job-schedules/create.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/job-schedules/create.js)_

## `box shuttle:job-schedules:delete ID`

Permanently delete a Box Shuttle job schedule. Runs that have already started are not affected

```
USAGE
  $ box shuttle:job-schedules:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the shuttle job schedule to delete

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
  Permanently delete a Box Shuttle job schedule. Runs that have already started are not affected

EXAMPLES
  $ box shuttle:job-schedules:delete 7c1ba68e810d9156194530b2
```

_See code: [src/commands/shuttle/job-schedules/delete.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/job-schedules/delete.js)_

## `box shuttle:job-schedules:get ID`

Get a Box Shuttle job schedule

```
USAGE
  $ box shuttle:job-schedules:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the shuttle job schedule

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
  Get a Box Shuttle job schedule

EXAMPLES
  $ box shuttle:job-schedules:get 7c1ba68e810d9156194530b2
```

_See code: [src/commands/shuttle/job-schedules/get.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/job-schedules/get.js)_

## `box shuttle:job-schedules:list`

List the schedules of a Box Shuttle job

```
USAGE
  $ box shuttle:job-schedules:list --job-id <value> [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

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
      --job-id=<value>             (required) ID of the shuttle job whose schedules to list
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List the schedules of a Box Shuttle job

ALIASES
  $ box shuttle:job-schedules:list

EXAMPLES
  $ box shuttle:job-schedules --job-id 6a3ba68e810d9156194530a1
```

## `box shuttle:job-schedules:update ID`

Update a Box Shuttle job schedule. Only the passed fields are changed; the job of the schedule cannot be changed

```
USAGE
  $ box shuttle:job-schedules:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--run-mode transfer|simulation|analysis]
    [--state enabled|paused] [--clear-description | --description <value>] [--trigger-type by_time|by_job] [--start-at
    <value>] [--time-zone <value>] [--repeat none|daily|weekly|weekdays|weekends] [--triggered-by-job-id <value>]
    [--last-run-condition always|on_success|on_finish]

ARGUMENTS
  ID  ID of the shuttle job schedule to update

FLAGS
  -h, --help
      Show CLI help

  -q, --quiet
      Suppress any non-error output to stderr

  -s, --save
      Save report to default reports folder on disk

  -t, --token=<value>
      Provide a token to perform this call

  -v, --verbose
      Show verbose output, which can be helpful for debugging

  -y, --yes
      Automatically respond yes to all confirmation prompts

  --as-user=<value>
      Provide an ID for a user

  --bulk-file-path=<value>
      File path to bulk .csv or .json objects

  --clear-description
      Remove the description of the schedule (sends null)

  --csv
      Output formatted CSV

  --description=<value>
      Human-readable description of the schedule

  --fields=<value>
      Comma separated list of fields to show

  --json
      Output formatted JSON

  --last-run-condition=<option>
      When to start a run relative to the last run of the triggering job. One of: always, on_success, on_finish. Only with
      --trigger-type=by_job
      <options: always|on_success|on_finish>

  --no-color
      Turn off colors for logging

  --repeat=<option>
      How often the schedule repeats after --start-at. One of: none, daily, weekly, weekdays, weekends. Only with
      --trigger-type=by_time
      <options: none|daily|weekly|weekdays|weekends>

  --run-mode=<option>
      Kind of run the schedule starts. One of: transfer, simulation, analysis. scan is not a valid schedule run mode
      <options: transfer|simulation|analysis>

  --save-to-file-path=<value>
      Override default file path to save report

  --start-at=<value>
      Local wall-clock time of the first run, without an offset or Z suffix, such as 2030-01-01T09:00:00. Combined with
      --time-zone. Only with --trigger-type=by_time

  --state=<option>
      Whether the schedule is active. One of: enabled, paused
      <options: enabled|paused>

  --time-zone=<value>
      IANA time zone that gives --start-at its meaning, such as America/Los_Angeles. Recurrence and DST are evaluated in
      this zone. Only with --trigger-type=by_time

  --trigger-type=<option>
      When the schedule starts a run. One of: by_time (at a wall-clock time; needs --start-at, --time-zone and --repeat),
      by_job (after a run of another job; needs --triggered-by-job-id and --last-run-condition). The trigger is sent only
      with --trigger-type, together with all flags of that trigger type, and replaces the whole trigger
      <options: by_time|by_job>

  --triggered-by-job-id=<value>
      ID of the shuttle job whose run starts this schedule. Only with --trigger-type=by_job

DESCRIPTION
  Update a Box Shuttle job schedule. Only the passed fields are changed; the job of the schedule cannot be changed

EXAMPLES
  $ box shuttle:job-schedules:update 7c1ba68e810d9156194530b2 --run-mode simulation

  $ box shuttle:job-schedules:update 7c1ba68e810d9156194530b2 --state paused --trigger-type by_time --start-at 2030-01-01T09:00:00 --time-zone Europe/Warsaw --repeat weekdays
```

_See code: [src/commands/shuttle/job-schedules/update.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/job-schedules/update.js)_

## `box shuttle:jobs`

List Box Shuttle jobs accessible to the current user

```
USAGE
  $ box shuttle:jobs [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

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
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List Box Shuttle jobs accessible to the current user

ALIASES
  $ box shuttle:jobs:list

EXAMPLES
  $ box shuttle:jobs

  $ box shuttle:jobs --max-items 50
```

_See code: [src/commands/shuttle/jobs/index.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/jobs/index.js)_

## `box shuttle:jobs:create NAME`

Create a Box Shuttle job that migrates content from a source system into Box

```
USAGE
  $ box shuttle:jobs:create NAME --job-type transfer|analysis --source-system-id <value> [-t <value>] [--as-user <value>]
    [--no-color] [--json | --csv] [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h]
    [-v] [-y] [-q] [--comment <value>] [--tag <value>...] [--account-mapping-enabled] [--permission-conflict-strategy
    preserve_structure_restrict_sharing|preserve_structure_expand_sharing|preserve_sharing_modify_structure|warn_permiss
    ions_conflicts] [--external-shares-mapped] [--permissions-mapped] [--bandwidth-limit-bytes-per-sec <value>]
    [--deletions-mirrored] [--file-versions-synced] [--max-file-versions <value>] [--overwrite-enabled]
    [--completed-mappings-skipped-on-rerun] [--content-scanning-enabled] [--include-shared-source-folders]
    [--include-shared-destination-folders]

ARGUMENTS
  NAME  Human-readable name of the shuttle job

FLAGS
  -h, --help
      Show CLI help

  -q, --quiet
      Suppress any non-error output to stderr

  -s, --save
      Save report to default reports folder on disk

  -t, --token=<value>
      Provide a token to perform this call

  -v, --verbose
      Show verbose output, which can be helpful for debugging

  -y, --yes
      Automatically respond yes to all confirmation prompts

  --[no-]account-mapping-enabled
      Enable or disable account mapping, which translates source identities and permissions into Box. The API disables it
      when no account mapping flag is passed

  --as-user=<value>
      Provide an ID for a user

  --bandwidth-limit-bytes-per-sec=<value>
      Maximum transfer bandwidth in bytes per second

  --bulk-file-path=<value>
      File path to bulk .csv or .json objects

  --comment=<value>
      Free-form comment describing the shuttle job

  --[no-]completed-mappings-skipped-on-rerun
      Skip mappings that already completed successfully when the job is rerun

  --[no-]content-scanning-enabled
      Scan migrated content during the migration. Ignored when the source system does not support content scanning

  --csv
      Output formatted CSV

  --[no-]deletions-mirrored
      Mirror deletions in the source system in Box

  --[no-]external-shares-mapped
      Map external shares during the migration

  --fields=<value>
      Comma separated list of fields to show

  --[no-]file-versions-synced
      Sync prior file versions during the migration

  --[no-]include-shared-destination-folders
      Include shared folders on the destination in the migration. Ignored when the destination system does not support
      shared folders

  --[no-]include-shared-source-folders
      Include shared folders on the source in the migration. Ignored when the source system does not support shared
      folders

  --job-type=<option>
      (required) Type of work the shuttle job performs. One of: transfer, analysis
      <options: transfer|analysis>

  --json
      Output formatted JSON

  --max-file-versions=<value>
      Maximum number of file versions to sync

  --no-color
      Turn off colors for logging

  --[no-]overwrite-enabled
      Overwrite existing files in Box

  --permission-conflict-strategy=<option>
      Strategy that resolves permission conflicts. One of: preserve_structure_restrict_sharing,
      preserve_structure_expand_sharing, preserve_sharing_modify_structure, warn_permissions_conflicts
      <options: preserve_structure_restrict_sharing|preserve_structure_expand_sharing|preserve_sharing_modify_structure|wa
      rn_permissions_conflicts>

  --[no-]permissions-mapped
      Map permissions during the migration

  --save-to-file-path=<value>
      Override default file path to save report

  --source-system-id=<value>
      (required) ID of the shuttle system to migrate from, as listed by shuttle:systems

  --tag=<value>...
      Free-form tag of the shuttle job. Repeat the flag for several tags

DESCRIPTION
  Create a Box Shuttle job that migrates content from a source system into Box

EXAMPLES
  $ box shuttle:jobs:create "Finance migration" --job-type transfer --source-system-id 6a315c0754833bfc5df067bf

  $ box shuttle:jobs:create "Finance migration" --job-type transfer --source-system-id 6a315c0754833bfc5df067bf --tag finance --account-mapping-enabled --permission-conflict-strategy warn_permissions_conflicts --max-file-versions 10 --no-overwrite-enabled
```

_See code: [src/commands/shuttle/jobs/create.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/jobs/create.js)_

## `box shuttle:jobs:delete ID`

Permanently delete a Box Shuttle job. Content that has already been migrated is not affected

```
USAGE
  $ box shuttle:jobs:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the shuttle job to delete

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
  Permanently delete a Box Shuttle job. Content that has already been migrated is not affected

EXAMPLES
  $ box shuttle:jobs:delete 6a3ba68e810d9156194530a1
```

_See code: [src/commands/shuttle/jobs/delete.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/jobs/delete.js)_

## `box shuttle:jobs:get ID`

Get a Box Shuttle job, including its state, mapping-preparation state (mapping_state) and source system

```
USAGE
  $ box shuttle:jobs:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the shuttle job

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
  Get a Box Shuttle job, including its state, mapping-preparation state (mapping_state) and source system

EXAMPLES
  $ box shuttle:jobs:get 6a3ba68e810d9156194530a1
```

_See code: [src/commands/shuttle/jobs/get.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/jobs/get.js)_

## `box shuttle:jobs:list`

List Box Shuttle jobs accessible to the current user

```
USAGE
  $ box shuttle:jobs:list [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

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
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List Box Shuttle jobs accessible to the current user

ALIASES
  $ box shuttle:jobs:list

EXAMPLES
  $ box shuttle:jobs

  $ box shuttle:jobs --max-items 50
```

## `box shuttle:jobs:prepare-migration ID`

Validate the account and path mappings of a Box Shuttle job before a transfer. Only relevant when account mapping is enabled. The API accepts the request and validates asynchronously; follow progress in mapping_state of shuttle:jobs:get

```
USAGE
  $ box shuttle:jobs:prepare-migration ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the shuttle job

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
  Validate the account and path mappings of a Box Shuttle job before a transfer. Only relevant when account mapping is
  enabled. The API accepts the request and validates asynchronously; follow progress in mapping_state of
  shuttle:jobs:get

EXAMPLES
  $ box shuttle:jobs:prepare-migration 6a3ba68e810d9156194530a1
```

_See code: [src/commands/shuttle/jobs/prepare-migration.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/jobs/prepare-migration.js)_

## `box shuttle:jobs:start ID`

Start a Box Shuttle job in the given mode. The API accepts the request and starts the job asynchronously; follow it with shuttle:runs

```
USAGE
  $ box shuttle:jobs:start ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--mode
    transfer|simulation|scan|analysis]

ARGUMENTS
  ID  ID of the shuttle job to start

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
      --mode=<option>              Run mode. One of: transfer, simulation, scan, analysis. The API uses simulation when
                                   omitted
                                   <options: transfer|simulation|scan|analysis>
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Start a Box Shuttle job in the given mode. The API accepts the request and starts the job asynchronously; follow it
  with shuttle:runs

EXAMPLES
  $ box shuttle:jobs:start 6a3ba68e810d9156194530a1

  $ box shuttle:jobs:start 6a3ba68e810d9156194530a1 --mode transfer
```

_See code: [src/commands/shuttle/jobs/start.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/jobs/start.js)_

## `box shuttle:jobs:stop ID`

Stop a running Box Shuttle job. Work already in progress finishes before the job reaches the stopped state

```
USAGE
  $ box shuttle:jobs:stop ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the shuttle job to stop

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
  Stop a running Box Shuttle job. Work already in progress finishes before the job reaches the stopped state

EXAMPLES
  $ box shuttle:jobs:stop 6a3ba68e810d9156194530a1
```

_See code: [src/commands/shuttle/jobs/stop.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/jobs/stop.js)_

## `box shuttle:jobs:update ID`

Update a Box Shuttle job. Only the passed fields are changed

```
USAGE
  $ box shuttle:jobs:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--name <value>] [--clear-comment |
    --comment <value>] [--tag <value>...] [--account-mapping-enabled] [--clear-permission-conflict-strategy |
    --permission-conflict-strategy preserve_structure_restrict_sharing|preserve_structure_expand_sharing|preserve_sharin
    g_modify_structure|warn_permissions_conflicts] [--external-shares-mapped] [--permissions-mapped]
    [--clear-bandwidth-limit-bytes-per-sec | --bandwidth-limit-bytes-per-sec <value>] [--deletions-mirrored]
    [--file-versions-synced] [--clear-max-file-versions | --max-file-versions <value>] [--overwrite-enabled]
    [--completed-mappings-skipped-on-rerun] [--content-scanning-enabled] [--include-shared-source-folders]
    [--include-shared-destination-folders]

ARGUMENTS
  ID  ID of the shuttle job to update

FLAGS
  -h, --help
      Show CLI help

  -q, --quiet
      Suppress any non-error output to stderr

  -s, --save
      Save report to default reports folder on disk

  -t, --token=<value>
      Provide a token to perform this call

  -v, --verbose
      Show verbose output, which can be helpful for debugging

  -y, --yes
      Automatically respond yes to all confirmation prompts

  --[no-]account-mapping-enabled
      Enable or disable account mapping, which translates source identities and permissions into Box

  --as-user=<value>
      Provide an ID for a user

  --bandwidth-limit-bytes-per-sec=<value>
      Maximum transfer bandwidth in bytes per second

  --bulk-file-path=<value>
      File path to bulk .csv or .json objects

  --clear-bandwidth-limit-bytes-per-sec
      Remove the bandwidth limit, making it unlimited (sends null)

  --clear-comment
      Remove the comment of the shuttle job (sends null)

  --clear-max-file-versions
      Remove the file version limit, making it unlimited (sends null)

  --clear-permission-conflict-strategy
      Unset the permission conflict strategy (sends null)

  --comment=<value>
      Free-form comment describing the shuttle job

  --[no-]completed-mappings-skipped-on-rerun
      Skip mappings that already completed successfully when the job is rerun

  --[no-]content-scanning-enabled
      Scan migrated content during the migration. Ignored when the source system does not support content scanning

  --csv
      Output formatted CSV

  --[no-]deletions-mirrored
      Mirror deletions in the source system in Box

  --[no-]external-shares-mapped
      Map external shares during the migration

  --fields=<value>
      Comma separated list of fields to show

  --[no-]file-versions-synced
      Sync prior file versions during the migration

  --[no-]include-shared-destination-folders
      Include shared folders on the destination in the migration. Ignored when the destination system does not support
      shared folders

  --[no-]include-shared-source-folders
      Include shared folders on the source in the migration. Ignored when the source system does not support shared
      folders

  --json
      Output formatted JSON

  --max-file-versions=<value>
      Maximum number of file versions to sync

  --name=<value>
      Human-readable name of the shuttle job

  --no-color
      Turn off colors for logging

  --[no-]overwrite-enabled
      Overwrite existing files in Box

  --permission-conflict-strategy=<option>
      Strategy that resolves permission conflicts. One of: preserve_structure_restrict_sharing,
      preserve_structure_expand_sharing, preserve_sharing_modify_structure, warn_permissions_conflicts
      <options: preserve_structure_restrict_sharing|preserve_structure_expand_sharing|preserve_sharing_modify_structure|wa
      rn_permissions_conflicts>

  --[no-]permissions-mapped
      Map permissions during the migration

  --save-to-file-path=<value>
      Override default file path to save report

  --tag=<value>...
      Free-form tag of the shuttle job. Repeat the flag for several tags. --tag replaces the whole tag list

DESCRIPTION
  Update a Box Shuttle job. Only the passed fields are changed

EXAMPLES
  $ box shuttle:jobs:update 6a3ba68e810d9156194530a1 --name "Finance migration v2"

  $ box shuttle:jobs:update 6a3ba68e810d9156194530a1 --tag finance --tag q3 --clear-max-file-versions --no-deletions-mirrored
```

_See code: [src/commands/shuttle/jobs/update.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/jobs/update.js)_

## `box shuttle:mapping-errors`

List the mapping errors of a Box Shuttle job. Only the latest record of each error is returned; revision names the mapping revision that produced it. Import row problems have category path_import or subject_import

```
USAGE
  $ box shuttle:mapping-errors --job-id <value> [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

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
      --job-id=<value>             (required) ID of the shuttle job whose mapping errors to list
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List the mapping errors of a Box Shuttle job. Only the latest record of each error is returned; revision names the
  mapping revision that produced it. Import row problems have category path_import or subject_import

ALIASES
  $ box shuttle:mapping-errors:list

EXAMPLES
  $ box shuttle:mapping-errors --job-id 6a3ba68e810d9156194530a1
```

_See code: [src/commands/shuttle/mapping-errors/index.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/mapping-errors/index.js)_

## `box shuttle:mapping-errors:list`

List the mapping errors of a Box Shuttle job. Only the latest record of each error is returned; revision names the mapping revision that produced it. Import row problems have category path_import or subject_import

```
USAGE
  $ box shuttle:mapping-errors:list --job-id <value> [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

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
      --job-id=<value>             (required) ID of the shuttle job whose mapping errors to list
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List the mapping errors of a Box Shuttle job. Only the latest record of each error is returned; revision names the
  mapping revision that produced it. Import row problems have category path_import or subject_import

ALIASES
  $ box shuttle:mapping-errors:list

EXAMPLES
  $ box shuttle:mapping-errors --job-id 6a3ba68e810d9156194530a1
```

## `box shuttle:path-entries`

Browse the source or target paths of a Box Shuttle job, one level at a time. Pass only --job-id and --side to list the roots, then --path, --path-id or both to list the children of an entry. Each entry has path, path_id, is_directory and a scope (account or shared_space), which give the location flags of shuttle:path-mappings:create. Valid values depend on the system

```
USAGE
  $ box shuttle:path-entries --job-id <value> --side source|target [-t <value>] [--as-user <value>] [--no-color] [--json |
    --csv] [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]
    [--max-items <value>] [--path <value>] [--path-id <value>] [--account-email <value>]

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --account-email=<value>      Email of the account whose path entries are listed. A system-native identifier, not
                                   always an email address
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --job-id=<value>             (required) ID of the shuttle job whose path entries to list
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --path=<value>               Human-readable path of the parent entry whose children are listed. Leave out, or pass
                                   /, to list the roots
      --path-id=<value>            path_id of the parent entry whose children are listed. Tells apart paths with
                                   identical names on systems with stable identifiers
      --save-to-file-path=<value>  Override default file path to save report
      --side=<option>              (required) Side of the migration to browse. One of: source, target
                                   <options: source|target>

DESCRIPTION
  Browse the source or target paths of a Box Shuttle job, one level at a time. Pass only --job-id and --side to list the
  roots, then --path, --path-id or both to list the children of an entry. Each entry has path, path_id, is_directory and
  a scope (account or shared_space), which give the location flags of shuttle:path-mappings:create. Valid values depend
  on the system

ALIASES
  $ box shuttle:path-entries:list

EXAMPLES
  $ box shuttle:path-entries --job-id 6a3ba68e810d9156194530a1 --side source

  $ box shuttle:path-entries --job-id 6a3ba68e810d9156194530a1 --side source --path /finance --account-email user@example.com
```

_See code: [src/commands/shuttle/path-entries/index.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/path-entries/index.js)_

## `box shuttle:path-entries:list`

Browse the source or target paths of a Box Shuttle job, one level at a time. Pass only --job-id and --side to list the roots, then --path, --path-id or both to list the children of an entry. Each entry has path, path_id, is_directory and a scope (account or shared_space), which give the location flags of shuttle:path-mappings:create. Valid values depend on the system

```
USAGE
  $ box shuttle:path-entries:list --job-id <value> --side source|target [-t <value>] [--as-user <value>] [--no-color] [--json |
    --csv] [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]
    [--max-items <value>] [--path <value>] [--path-id <value>] [--account-email <value>]

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --account-email=<value>      Email of the account whose path entries are listed. A system-native identifier, not
                                   always an email address
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --job-id=<value>             (required) ID of the shuttle job whose path entries to list
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --path=<value>               Human-readable path of the parent entry whose children are listed. Leave out, or pass
                                   /, to list the roots
      --path-id=<value>            path_id of the parent entry whose children are listed. Tells apart paths with
                                   identical names on systems with stable identifiers
      --save-to-file-path=<value>  Override default file path to save report
      --side=<option>              (required) Side of the migration to browse. One of: source, target
                                   <options: source|target>

DESCRIPTION
  Browse the source or target paths of a Box Shuttle job, one level at a time. Pass only --job-id and --side to list the
  roots, then --path, --path-id or both to list the children of an entry. Each entry has path, path_id, is_directory and
  a scope (account or shared_space), which give the location flags of shuttle:path-mappings:create. Valid values depend
  on the system

ALIASES
  $ box shuttle:path-entries:list

EXAMPLES
  $ box shuttle:path-entries --job-id 6a3ba68e810d9156194530a1 --side source

  $ box shuttle:path-entries --job-id 6a3ba68e810d9156194530a1 --side source --path /finance --account-email user@example.com
```

## `box shuttle:path-mapping-imports:create`

Replace all path mappings of a Box Shuttle job with a mapping workbook already stored in Box. A file that is not a mapping workbook, or exceeds 10 MiB or 100,000 mapping rows, is rejected with 400 and the job is unchanged. The import runs asynchronously: poll shuttle:jobs:get while mapping_state is importing_paths. When any row is invalid the job ends with no path mappings and mapping_state paths_import_rejected; shuttle:mapping-errors lists the row problems with category path_import. Only one import may run per job

```
USAGE
  $ box shuttle:path-mapping-imports:create --job-id <value> --file-id <value> [-t <value>] [--as-user <value>] [--no-color] [--json |
    --csv] [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

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
      --file-id=<value>            (required) ID of the Box file holding the mapping workbook. The file is read as the
                                   calling user, who must be able to download it
      --job-id=<value>             (required) ID of the shuttle job whose path mappings are replaced
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Replace all path mappings of a Box Shuttle job with a mapping workbook already stored in Box. A file that is not a
  mapping workbook, or exceeds 10 MiB or 100,000 mapping rows, is rejected with 400 and the job is unchanged. The import
  runs asynchronously: poll shuttle:jobs:get while mapping_state is importing_paths. When any row is invalid the job
  ends with no path mappings and mapping_state paths_import_rejected; shuttle:mapping-errors lists the row problems with
  category path_import. Only one import may run per job

EXAMPLES
  $ box shuttle:path-mapping-imports:create --job-id 6a3ba68e810d9156194530a1 --file-id 12345
```

_See code: [src/commands/shuttle/path-mapping-imports/create.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/path-mapping-imports/create.js)_

## `box shuttle:path-mappings`

List the path mappings of a Box Shuttle job

```
USAGE
  $ box shuttle:path-mappings --job-id <value> [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

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
      --job-id=<value>             (required) ID of the shuttle job whose path mappings to list
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List the path mappings of a Box Shuttle job

ALIASES
  $ box shuttle:path-mappings:list

EXAMPLES
  $ box shuttle:path-mappings --job-id 6a3ba68e810d9156194530a1
```

_See code: [src/commands/shuttle/path-mappings/index.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/path-mappings/index.js)_

## `box shuttle:path-mappings:create`

Create a path mapping that connects a source location of a Box Shuttle job to a destination in Box. Leave out the --target-* flags when the source path is skipped. Values for the location flags can be taken from shuttle:path-entries

```
USAGE
  $ box shuttle:path-mappings:create --job-id <value> --source-type account|shared_space [-t <value>] [--as-user <value>]
    [--no-color] [--json | --csv] [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h]
    [-v] [-y] [-q] [--path-skipped] [--source-path <value>] [--source-path-id <value>] [--source-account-id <value>]
    [--source-account-email <value>] [--source-space <value>] [--source-directory] [--target-type account|shared_space]
    [--target-path <value>] [--target-path-id <value>] [--target-account-id <value>] [--target-account-email <value>]
    [--target-space <value>]

FLAGS
  -h, --help                          Show CLI help
  -q, --quiet                         Suppress any non-error output to stderr
  -s, --save                          Save report to default reports folder on disk
  -t, --token=<value>                 Provide a token to perform this call
  -v, --verbose                       Show verbose output, which can be helpful for debugging
  -y, --yes                           Automatically respond yes to all confirmation prompts
      --as-user=<value>               Provide an ID for a user
      --bulk-file-path=<value>        File path to bulk .csv or .json objects
      --csv                           Output formatted CSV
      --fields=<value>                Comma separated list of fields to show
      --job-id=<value>                (required) ID of the shuttle job this mapping belongs to
      --json                          Output formatted JSON
      --no-color                      Turn off colors for logging
      --[no-]path-skipped             Skip the source path during the migration. The API uses false when omitted
      --save-to-file-path=<value>     Override default file path to save report
      --source-account-email=<value>  Email address of the account that owns the source location. Only with
                                      --source-type=account
      --source-account-id=<value>     Platform-native ID of the account that owns the source location. Only with
                                      --source-type=account
      --[no-]source-directory         Whether the source location is a directory (--no-source-directory for a file).
                                      When set, the destination must be the same kind of object
      --source-path=<value>           Human-readable path of the source location, relative to the account root or the
                                      shared container
      --source-path-id=<value>        Stable identifier of the source location, as path_id from shuttle:path-entries
      --source-space=<value>          Display name of the shared container of the source location. Required for systems
                                      with several containers. Only with --source-type=shared_space
      --source-type=<option>          (required) Type of the source location. One of: account (needs --source-path and
                                      --source-account-id or --source-account-email), shared_space (needs --source-path)
                                      <options: account|shared_space>
      --target-account-email=<value>  Email address of the account that owns the destination. Only with
                                      --target-type=account
      --target-account-id=<value>     Platform-native ID of the account that owns the destination. Only with
                                      --target-type=account
      --target-path=<value>           Human-readable path of the destination, relative to the account root or the shared
                                      container
      --target-path-id=<value>        Stable identifier of the destination, as path_id from shuttle:path-entries
      --target-space=<value>          Display name of the shared container of the destination. Required for systems with
                                      several containers. Only with --target-type=shared_space
      --target-type=<option>          Type of the destination. One of: account (needs --target-path and
                                      --target-account-id or --target-account-email), shared_space (needs --target-path)
                                      <options: account|shared_space>

DESCRIPTION
  Create a path mapping that connects a source location of a Box Shuttle job to a destination in Box. Leave out the
  --target-* flags when the source path is skipped. Values for the location flags can be taken from shuttle:path-entries

EXAMPLES
  $ box shuttle:path-mappings:create --job-id 6a3ba68e810d9156194530a1 --source-type account --source-path /finance --source-account-email user@example.com --target-type account --target-path /Finance --target-account-id 11111

  $ box shuttle:path-mappings:create --job-id 6a3ba68e810d9156194530a1 --source-type shared_space --source-space "Team Drive" --source-path /archive --path-skipped
```

_See code: [src/commands/shuttle/path-mappings/create.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/path-mappings/create.js)_

## `box shuttle:path-mappings:delete ID`

Permanently delete a Box Shuttle path mapping. Content that has already been migrated is not affected

```
USAGE
  $ box shuttle:path-mappings:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the shuttle path mapping to delete

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
  Permanently delete a Box Shuttle path mapping. Content that has already been migrated is not affected

EXAMPLES
  $ box shuttle:path-mappings:delete 6a3ba7a24ea17bc9461eeacd
```

_See code: [src/commands/shuttle/path-mappings/delete.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/path-mappings/delete.js)_

## `box shuttle:path-mappings:get ID`

Get a Box Shuttle path mapping, including its source location and destination, if any

```
USAGE
  $ box shuttle:path-mappings:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the shuttle path mapping

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
  Get a Box Shuttle path mapping, including its source location and destination, if any

EXAMPLES
  $ box shuttle:path-mappings:get 6a3ba7a24ea17bc9461eeacd
```

_See code: [src/commands/shuttle/path-mappings/get.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/path-mappings/get.js)_

## `box shuttle:path-mappings:list`

List the path mappings of a Box Shuttle job

```
USAGE
  $ box shuttle:path-mappings:list --job-id <value> [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

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
      --job-id=<value>             (required) ID of the shuttle job whose path mappings to list
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List the path mappings of a Box Shuttle job

ALIASES
  $ box shuttle:path-mappings:list

EXAMPLES
  $ box shuttle:path-mappings --job-id 6a3ba68e810d9156194530a1
```

## `box shuttle:path-mappings:update ID`

Update a Box Shuttle path mapping. Only the passed fields are changed

```
USAGE
  $ box shuttle:path-mappings:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--path-skipped] [--source-type
    account|shared_space] [--source-path <value>] [--source-path-id <value>] [--source-account-id <value>]
    [--source-account-email <value>] [--source-space <value>] [--source-directory] [--clear-target | --target-type
    account|shared_space | --target-path <value> | --target-path-id <value> | --target-account-id <value> |
    --target-account-email <value> | --target-space <value>]

ARGUMENTS
  ID  ID of the shuttle path mapping to update

FLAGS
  -h, --help                          Show CLI help
  -q, --quiet                         Suppress any non-error output to stderr
  -s, --save                          Save report to default reports folder on disk
  -t, --token=<value>                 Provide a token to perform this call
  -v, --verbose                       Show verbose output, which can be helpful for debugging
  -y, --yes                           Automatically respond yes to all confirmation prompts
      --as-user=<value>               Provide an ID for a user
      --bulk-file-path=<value>        File path to bulk .csv or .json objects
      --clear-target                  Remove the destination, for example when skipping the source path (sends null)
      --csv                           Output formatted CSV
      --fields=<value>                Comma separated list of fields to show
      --json                          Output formatted JSON
      --no-color                      Turn off colors for logging
      --[no-]path-skipped             Skip the source path during the migration
      --save-to-file-path=<value>     Override default file path to save report
      --source-account-email=<value>  Email address of the account that owns the source location. Only with
                                      --source-type=account
      --source-account-id=<value>     Platform-native ID of the account that owns the source location. Only with
                                      --source-type=account
      --[no-]source-directory         Whether the source location is a directory (--no-source-directory for a file).
                                      When set, the destination must be the same kind of object
      --source-path=<value>           Human-readable path of the source location, relative to the account root or the
                                      shared container
      --source-path-id=<value>        Stable identifier of the source location, as path_id from shuttle:path-entries
      --source-space=<value>          Display name of the shared container of the source location. Required for systems
                                      with several containers. Only with --source-type=shared_space
      --source-type=<option>          Type of the source location. One of: account (needs --source-path and
                                      --source-account-id or --source-account-email), shared_space (needs
                                      --source-path). The source is sent only with --source-type, together with all
                                      flags of that type, and replaces the whole source
                                      <options: account|shared_space>
      --target-account-email=<value>  Email address of the account that owns the destination. Only with
                                      --target-type=account
      --target-account-id=<value>     Platform-native ID of the account that owns the destination. Only with
                                      --target-type=account
      --target-path=<value>           Human-readable path of the destination, relative to the account root or the shared
                                      container
      --target-path-id=<value>        Stable identifier of the destination, as path_id from shuttle:path-entries
      --target-space=<value>          Display name of the shared container of the destination. Required for systems with
                                      several containers. Only with --target-type=shared_space
      --target-type=<option>          Type of the destination. One of: account (needs --target-path and
                                      --target-account-id or --target-account-email), shared_space (needs
                                      --target-path). The target is sent only with --target-type, together with all
                                      flags of that type, and replaces the whole target
                                      <options: account|shared_space>

DESCRIPTION
  Update a Box Shuttle path mapping. Only the passed fields are changed

EXAMPLES
  $ box shuttle:path-mappings:update 6a3ba7a24ea17bc9461eeacd --path-skipped --clear-target

  $ box shuttle:path-mappings:update 6a3ba7a24ea17bc9461eeacd --target-type account --target-path /Finance/2026 --target-account-id 11111
```

_See code: [src/commands/shuttle/path-mappings/update.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/path-mappings/update.js)_

## `box shuttle:reports`

List the reports generated for a Box Shuttle run

```
USAGE
  $ box shuttle:reports --run-id <value> [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

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
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --run-id=<value>             (required) ID of the shuttle run whose reports to list, in the form
                                   <job_id>:<run_number>
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List the reports generated for a Box Shuttle run

ALIASES
  $ box shuttle:reports:list

EXAMPLES
  $ box shuttle:reports --run-id 6a3ba68e810d9156194530a1:42
```

_See code: [src/commands/shuttle/reports/index.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/reports/index.js)_

## `box shuttle:reports:create`

Request generation of a report for a Box Shuttle run. The report is returned at once with status pending or processing; poll shuttle:reports:get until status is complete, failed, canceled or unknown. Repeating the request with the same values returns the existing report instead of a duplicate

```
USAGE
  $ box shuttle:reports:create --run-id <value> --format xlsx|csv --section <value>... [-t <value>] [--as-user <value>]
    [--no-color] [--json | --csv] [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h]
    [-v] [-y] [-q] [--users-scope migrated|all]

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
      --format=<option>            (required) Output file format of the report. One of: xlsx, csv
                                   <options: xlsx|csv>
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --run-id=<value>             (required) ID of the shuttle run to generate a report for, in the form
                                   <job_id>:<run_number>
      --save-to-file-path=<value>  Override default file path to save report
      --section=<value>...         (required) Section to include in the report. Repeat the flag for several sections.
                                   Must be one of available_report_sections of the run (shuttle:runs:get). The list is
                                   open; documented values include files_and_folders, event_log, transfer_overview,
                                   source_users, target_users, source_collaborators, target_collaborators,
                                   source_collaborations, target_collaborations
      --users-scope=<option>       Which users to include in user-related sections. One of: migrated, all. The API uses
                                   migrated when omitted
                                   <options: migrated|all>

DESCRIPTION
  Request generation of a report for a Box Shuttle run. The report is returned at once with status pending or
  processing; poll shuttle:reports:get until status is complete, failed, canceled or unknown. Repeating the request with
  the same values returns the existing report instead of a duplicate

EXAMPLES
  $ box shuttle:reports:create --run-id 6a3ba68e810d9156194530a1:42 --format xlsx --section transfer_overview --section files_and_folders

  $ box shuttle:reports:create --run-id 6a3ba68e810d9156194530a1:42 --format csv --section source_users --users-scope all
```

_See code: [src/commands/shuttle/reports/create.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/reports/create.js)_

## `box shuttle:reports:get ID`

Get a Box Shuttle report, including its generation status and, once status is complete, the generated Box file or folder in output. Keep polling while status is pending or processing; stop on complete, failed, canceled or any other value

```
USAGE
  $ box shuttle:reports:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the shuttle report

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
  Get a Box Shuttle report, including its generation status and, once status is complete, the generated Box file or
  folder in output. Keep polling while status is pending or processing; stop on complete, failed, canceled or any other
  value

EXAMPLES
  $ box shuttle:reports:get 6a3ba8d14f2c91e8370b4d12
```

_See code: [src/commands/shuttle/reports/get.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/reports/get.js)_

## `box shuttle:reports:list`

List the reports generated for a Box Shuttle run

```
USAGE
  $ box shuttle:reports:list --run-id <value> [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

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
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --run-id=<value>             (required) ID of the shuttle run whose reports to list, in the form
                                   <job_id>:<run_number>
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List the reports generated for a Box Shuttle run

ALIASES
  $ box shuttle:reports:list

EXAMPLES
  $ box shuttle:reports --run-id 6a3ba68e810d9156194530a1:42
```

## `box shuttle:runs`

List the runs of a Box Shuttle job

```
USAGE
  $ box shuttle:runs --job-id <value> [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

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
      --job-id=<value>             (required) ID of the shuttle job whose runs to list
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List the runs of a Box Shuttle job

ALIASES
  $ box shuttle:runs:list

EXAMPLES
  $ box shuttle:runs --job-id 6a3ba68e810d9156194530a1
```

_See code: [src/commands/shuttle/runs/index.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/runs/index.js)_

## `box shuttle:runs:get ID`

Get a Box Shuttle run, including its mode, state, timing, transfer statistics and the report sections that can be requested for it

```
USAGE
  $ box shuttle:runs:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the shuttle run, in the form <job_id>:<run_number>

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
  Get a Box Shuttle run, including its mode, state, timing, transfer statistics and the report sections that can be
  requested for it

EXAMPLES
  $ box shuttle:runs:get 6a3ba68e810d9156194530a1:42
```

_See code: [src/commands/shuttle/runs/get.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/runs/get.js)_

## `box shuttle:runs:list`

List the runs of a Box Shuttle job

```
USAGE
  $ box shuttle:runs:list --job-id <value> [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

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
      --job-id=<value>             (required) ID of the shuttle job whose runs to list
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List the runs of a Box Shuttle job

ALIASES
  $ box shuttle:runs:list

EXAMPLES
  $ box shuttle:runs --job-id 6a3ba68e810d9156194530a1
```

## `box shuttle:subject-mapping-imports:create`

Replace all subject (user and group) mappings of a Box Shuttle job with a mapping workbook already stored in Box. The job must have account mapping enabled and a finished source scan, otherwise the API answers 409. A file that is not a subject-mapping workbook, or exceeds 10 MiB or 50,000 mapping rows, is rejected with 400 and the job is unchanged. The import runs asynchronously: poll shuttle:jobs:get while mapping_state is importing_subjects. When any row is invalid the job ends with no subject mappings and mapping_state subjects_import_rejected; shuttle:mapping-errors lists the row problems with category subject_import. Only one import may run per job.

```
USAGE
  $ box shuttle:subject-mapping-imports:create --job-id <value> --file-id <value> [-t <value>] [--as-user <value>] [--no-color] [--json |
    --csv] [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

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
      --file-id=<value>            (required) ID of the Box file holding the mapping workbook. The file is read as the
                                   calling user, who must be able to download it
      --job-id=<value>             (required) ID of the shuttle job whose subject mappings are replaced
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Replace all subject (user and group) mappings of a Box Shuttle job with a mapping workbook already stored in Box. The
  job must have account mapping enabled and a finished source scan, otherwise the API answers 409. A file that is not a
  subject-mapping workbook, or exceeds 10 MiB or 50,000 mapping rows, is rejected with 400 and the job is unchanged. The
  import runs asynchronously: poll shuttle:jobs:get while mapping_state is importing_subjects. When any row is invalid
  the job ends with no subject mappings and mapping_state subjects_import_rejected; shuttle:mapping-errors lists the row
  problems with category subject_import. Only one import may run per job.

  Workbook format: sheets Users and/or Groups (a sheet named Subjects is also accepted). Columns are "Source User
  <Key>", "Target User <Key>", "Skip" on Users, and "Source Group <Key>", "Target Group <Key>", "Skip" on Groups. <Key>
  is Email for users on most systems, ID for SharePoint 2007/2010/2013, Name for Windows (windows_union); Name for
  groups on most systems, Email for Google Drive admin groups. Source rows can be taken from shuttle:discovered-subjects

EXAMPLES
  $ box shuttle:subject-mapping-imports:create --job-id 6a3ba68e810d9156194530a1 --file-id 12345
```

_See code: [src/commands/shuttle/subject-mapping-imports/create.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/subject-mapping-imports/create.js)_

## `box shuttle:subject-mappings`

List the subject (user and group) mappings of a Box Shuttle job

```
USAGE
  $ box shuttle:subject-mappings --job-id <value> [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

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
      --job-id=<value>             (required) ID of the shuttle job whose subject mappings to list
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List the subject (user and group) mappings of a Box Shuttle job

ALIASES
  $ box shuttle:subject-mappings:list

EXAMPLES
  $ box shuttle:subject-mappings --job-id 6a3ba68e810d9156194530a1
```

_See code: [src/commands/shuttle/subject-mappings/index.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/subject-mappings/index.js)_

## `box shuttle:subject-mappings:create`

Create a subject mapping that connects a discovered source subject of a Box Shuttle job to a Box user or group. Leave out --target-type and --target-id when the subject is skipped. Discovered subjects are listed by shuttle:discovered-subjects

```
USAGE
  $ box shuttle:subject-mappings:create --job-id <value> --discovered-subject-id <value> [-t <value>] [--as-user <value>]
    [--no-color] [--json | --csv] [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h]
    [-v] [-y] [-q] [--revision <value>] [--subject-skipped] [--target-type user|group] [--target-id <value>]

FLAGS
  -h, --help                           Show CLI help
  -q, --quiet                          Suppress any non-error output to stderr
  -s, --save                           Save report to default reports folder on disk
  -t, --token=<value>                  Provide a token to perform this call
  -v, --verbose                        Show verbose output, which can be helpful for debugging
  -y, --yes                            Automatically respond yes to all confirmation prompts
      --as-user=<value>                Provide an ID for a user
      --bulk-file-path=<value>         File path to bulk .csv or .json objects
      --csv                            Output formatted CSV
      --discovered-subject-id=<value>  (required) ID of the discovered subject to map, as listed by
                                       shuttle:discovered-subjects
      --fields=<value>                 Comma separated list of fields to show
      --job-id=<value>                 (required) ID of the shuttle job this mapping belongs to
      --json                           Output formatted JSON
      --no-color                       Turn off colors for logging
      --revision=<value>               Discovery revision to resolve the subject against. The API uses the latest
                                       revision when omitted
      --save-to-file-path=<value>      Override default file path to save report
      --[no-]subject-skipped           Skip the subject during the migration. The API uses false when omitted
      --target-id=<value>              ID of the Box user or group to map to
      --target-type=<option>           Whether the Box target is a user or a group. One of: user, group. Needs
                                       --target-id
                                       <options: user|group>

DESCRIPTION
  Create a subject mapping that connects a discovered source subject of a Box Shuttle job to a Box user or group. Leave
  out --target-type and --target-id when the subject is skipped. Discovered subjects are listed by
  shuttle:discovered-subjects

EXAMPLES
  $ box shuttle:subject-mappings:create --job-id 6a3ba68e810d9156194530a1 --discovered-subject-id 6a3ba7a24ea17bc9461eeacf --target-type user --target-id 11111

  $ box shuttle:subject-mappings:create --job-id 6a3ba68e810d9156194530a1 --discovered-subject-id 6a3ba7a24ea17bc9461eeacf --subject-skipped
```

_See code: [src/commands/shuttle/subject-mappings/create.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/subject-mappings/create.js)_

## `box shuttle:subject-mappings:delete ID`

Permanently delete a Box Shuttle subject mapping

```
USAGE
  $ box shuttle:subject-mappings:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the shuttle subject mapping to delete

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
  Permanently delete a Box Shuttle subject mapping

EXAMPLES
  $ box shuttle:subject-mappings:delete 6a3ba7a24ea17bc9461eeace
```

_See code: [src/commands/shuttle/subject-mappings/delete.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/subject-mappings/delete.js)_

## `box shuttle:subject-mappings:get ID`

Get a Box Shuttle subject mapping, including its source subject and Box target, if any

```
USAGE
  $ box shuttle:subject-mappings:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the shuttle subject mapping

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
  Get a Box Shuttle subject mapping, including its source subject and Box target, if any

EXAMPLES
  $ box shuttle:subject-mappings:get 6a3ba7a24ea17bc9461eeace
```

_See code: [src/commands/shuttle/subject-mappings/get.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/subject-mappings/get.js)_

## `box shuttle:subject-mappings:list`

List the subject (user and group) mappings of a Box Shuttle job

```
USAGE
  $ box shuttle:subject-mappings:list --job-id <value> [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

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
      --job-id=<value>             (required) ID of the shuttle job whose subject mappings to list
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List the subject (user and group) mappings of a Box Shuttle job

ALIASES
  $ box shuttle:subject-mappings:list

EXAMPLES
  $ box shuttle:subject-mappings --job-id 6a3ba68e810d9156194530a1
```

## `box shuttle:subject-mappings:update ID`

Update a Box Shuttle subject mapping. Only the passed fields are changed

```
USAGE
  $ box shuttle:subject-mappings:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--subject-skipped] [--clear-target |
    --target-type user|group | --target-id <value>]

ARGUMENTS
  ID  ID of the shuttle subject mapping to update

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --clear-target               Remove the Box target (sends null). Allowed only for a skipped subject; the API
                                   rejects it while the mapping is active
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report
      --[no-]subject-skipped       Skip the subject during the migration. Changing only this flag keeps the existing
                                   target
      --target-id=<value>          ID of the Box user or group to map to
      --target-type=<option>       Whether the Box target is a user or a group. One of: user, group. Needs --target-id.
                                   The target is sent only with --target-type and --target-id, and replaces the whole
                                   target
                                   <options: user|group>

DESCRIPTION
  Update a Box Shuttle subject mapping. Only the passed fields are changed

EXAMPLES
  $ box shuttle:subject-mappings:update 6a3ba7a24ea17bc9461eeace --target-type group --target-id 22222

  $ box shuttle:subject-mappings:update 6a3ba7a24ea17bc9461eeace --subject-skipped --clear-target
```

_See code: [src/commands/shuttle/subject-mappings/update.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/subject-mappings/update.js)_

## `box shuttle:systems`

List Box Shuttle systems (migration sources and destinations) accessible to the current user

```
USAGE
  $ box shuttle:systems [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

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
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List Box Shuttle systems (migration sources and destinations) accessible to the current user

ALIASES
  $ box shuttle:systems:list

EXAMPLES
  $ box shuttle:systems
```

_See code: [src/commands/shuttle/systems/index.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/systems/index.js)_

## `box shuttle:systems:create NAME`

Create a Box Shuttle system. Only Windows agent systems can be created through the API; other system types are configured in the Shuttle application. Register the agent with a token from shuttle:systems:issue-registration-token

```
USAGE
  $ box shuttle:systems:create NAME --system-type windows [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s
    | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  NAME  Display name of the shuttle system

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
      --system-type=<option>       (required) Type of the new system. One of: windows (the only type the API supports
                                   today)
                                   <options: windows>

DESCRIPTION
  Create a Box Shuttle system. Only Windows agent systems can be created through the API; other system types are
  configured in the Shuttle application. Register the agent with a token from shuttle:systems:issue-registration-token

EXAMPLES
  $ box shuttle:systems:create "Finance file server" --system-type windows
```

_See code: [src/commands/shuttle/systems/create.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/systems/create.js)_

## `box shuttle:systems:delete ID`

Permanently delete a Box Shuttle system. Content that has already been migrated is not affected

```
USAGE
  $ box shuttle:systems:delete ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the shuttle system to delete

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
  Permanently delete a Box Shuttle system. Content that has already been migrated is not affected

EXAMPLES
  $ box shuttle:systems:delete 6a315c0754833bfc5df067bf
```

_See code: [src/commands/shuttle/systems/delete.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/systems/delete.js)_

## `box shuttle:systems:get ID`

Get a Box Shuttle system, including its type and connection state

```
USAGE
  $ box shuttle:systems:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the shuttle system

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
  Get a Box Shuttle system, including its type and connection state

EXAMPLES
  $ box shuttle:systems:get 6a315c0754833bfc5df067bf
```

_See code: [src/commands/shuttle/systems/get.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/systems/get.js)_

## `box shuttle:systems:issue-registration-token ID`

Issue a new installation token for a Windows Box Shuttle system. Paste registration_token into the Windows agent installer to register the agent with the system before expires_at

```
USAGE
  $ box shuttle:systems:issue-registration-token ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the Windows shuttle system

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
  Issue a new installation token for a Windows Box Shuttle system. Paste registration_token into the Windows agent
  installer to register the agent with the system before expires_at

EXAMPLES
  $ box shuttle:systems:issue-registration-token 6a315c0754833bfc5df067bf
```

_See code: [src/commands/shuttle/systems/issue-registration-token.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/systems/issue-registration-token.js)_

## `box shuttle:systems:list`

List Box Shuttle systems (migration sources and destinations) accessible to the current user

```
USAGE
  $ box shuttle:systems:list [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--max-items <value>]

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
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List Box Shuttle systems (migration sources and destinations) accessible to the current user

ALIASES
  $ box shuttle:systems:list

EXAMPLES
  $ box shuttle:systems
```

## `box shuttle:systems:update ID`

Update a Box Shuttle system. Only the passed fields are changed

```
USAGE
  $ box shuttle:systems:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--name <value>]

ARGUMENTS
  ID  ID of the shuttle system to update

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
      --name=<value>               Display name of the shuttle system
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Update a Box Shuttle system. Only the passed fields are changed

EXAMPLES
  $ box shuttle:systems:update 6a315c0754833bfc5df067bf --name "Finance file server 2"
```

_See code: [src/commands/shuttle/systems/update.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/systems/update.js)_
