`box shuttle`
=============

Manage Box Shuttle migrations (systems, jobs, mappings, runs, reports)

* [`box shuttle:discovered-subjects`](#box-shuttlediscovered-subjects)
* [`box shuttle:discovered-subjects:list`](#box-shuttlediscovered-subjectslist)
* [`box shuttle:job-schedules`](#box-shuttlejob-schedules)
* [`box shuttle:job-schedules:create`](#box-shuttlejob-schedulescreate)
* [`box shuttle:job-schedules:delete ID`](#box-shuttlejob-schedulesdelete-id)
* [`box shuttle:job-schedules:get ID`](#box-shuttlejob-schedulesget-id)
* [`box shuttle:job-schedules:list`](#box-shuttlejob-scheduleslist)
* [`box shuttle:job-schedules:update ID`](#box-shuttlejob-schedulesupdate-id)
* [`box shuttle:jobs`](#box-shuttlejobs)
* [`box shuttle:jobs:create [NAME]`](#box-shuttlejobscreate-name)
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

List discovered subjects for shuttle jobs Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
      --job-id=<value>             (required) Shuttle job ID whose discovered subjects to list
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List discovered subjects for shuttle jobs Requires a token with the manage_enterprise_properties scope (and Shuttle
  access for the enterprise).

ALIASES
  $ box shuttle:discovered-subjects:list

EXAMPLES
  $ box shuttle:discovered-subjects --job-id 6a315c0754833bfc5df067bf
```

_See code: [src/commands/shuttle/discovered-subjects/index.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/discovered-subjects/index.js)_

## `box shuttle:discovered-subjects:list`

List discovered subjects for shuttle jobs Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
      --job-id=<value>             (required) Shuttle job ID whose discovered subjects to list
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List discovered subjects for shuttle jobs Requires a token with the manage_enterprise_properties scope (and Shuttle
  access for the enterprise).

ALIASES
  $ box shuttle:discovered-subjects:list

EXAMPLES
  $ box shuttle:discovered-subjects --job-id 6a315c0754833bfc5df067bf
```

## `box shuttle:job-schedules`

List shuttle job schedules Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
      --job-id=<value>             (required) Shuttle job ID whose schedules to list
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List shuttle job schedules Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

ALIASES
  $ box shuttle:job-schedules:list

EXAMPLES
  $ box shuttle:job-schedules --job-id 6a315c0754833bfc5df067bf
```

_See code: [src/commands/shuttle/job-schedules/index.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/job-schedules/index.js)_

## `box shuttle:job-schedules:create`

Create a shuttle job schedule Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

```
USAGE
  $ box shuttle:job-schedules:create [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--body-file <value> | --body <value>]
    [--job-id <value>] [--run-mode transfer|simulation|analysis] [--state enabled|paused] [--description <value>]
    [--trigger-type by_time|by_job] [--start-at <value>] [--time-zone <value>] [--repeat
    none|daily|weekly|weekdays|weekends] [--triggered-by-job-id <value>] [--last-run-condition
    always|on_success|on_finish]

FLAGS
  -h, --help                         Show CLI help
  -q, --quiet                        Suppress any non-error output to stderr
  -s, --save                         Save report to default reports folder on disk
  -t, --token=<value>                Provide a token to perform this call
  -v, --verbose                      Show verbose output, which can be helpful for debugging
  -y, --yes                          Automatically respond yes to all confirmation prompts
      --as-user=<value>              Provide an ID for a user
      --body=<value>                 Escape hatch: full JSON request body (snake_case or camelCase). When set, other
                                     body-building flags are ignored.
      --body-file=<value>            Escape hatch: path to a JSON file used as the full request body.
      --bulk-file-path=<value>       File path to bulk .csv or .json objects
      --csv                          Output formatted CSV
      --description=<value>          Optional schedule description
      --fields=<value>               Comma separated list of fields to show
      --job-id=<value>               Shuttle job ID (required unless --body / --body-file)
      --json                         Output formatted JSON
      --last-run-condition=<option>  Condition on the triggering job last run. Accepted values: always, on_success,
                                     on_finish
                                     <options: always|on_success|on_finish>
      --no-color                     Turn off colors for logging
      --repeat=<option>              Repeat cadence for by_time trigger. Accepted values: none, daily, weekly, weekdays,
                                     weekends
                                     <options: none|daily|weekly|weekdays|weekends>
      --run-mode=<option>            Schedule run mode (required unless --body / --body-file). Accepted values:
                                     transfer, simulation, analysis
                                     <options: transfer|simulation|analysis>
      --save-to-file-path=<value>    Override default file path to save report
      --start-at=<value>             Local start time for by_time trigger (YYYY-MM-DDTHH:MM:SS, no Z)
      --state=<option>               Schedule state. Accepted values: enabled, paused
                                     <options: enabled|paused>
      --time-zone=<value>            IANA time zone for by_time trigger
      --trigger-type=<option>        Schedule trigger type. Accepted values: by_time, by_job
                                     <options: by_time|by_job>
      --triggered-by-job-id=<value>  Triggering job ID for by_job trigger

DESCRIPTION
  Create a shuttle job schedule Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

EXAMPLES
  $ box shuttle:job-schedules:create --job-id 6a315c0754833bfc5df067bf --run-mode transfer --trigger-type by_time --start-at 2026-03-16T09:00:00 --time-zone America/Los_Angeles --repeat daily

  $ box shuttle:job-schedules:create --job-id 6a315c0754833bfc5df067bf --run-mode simulation --trigger-type by_job --triggered-by-job-id 8d2ca68e810d9156194530c3 --last-run-condition on_success
```

_See code: [src/commands/shuttle/job-schedules/create.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/job-schedules/create.js)_

## `box shuttle:job-schedules:delete ID`

Delete a shuttle job schedule Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
  Delete a shuttle job schedule Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

EXAMPLES
  $ box shuttle:job-schedules:delete 6a315c0754833bfc5df067bf
```

_See code: [src/commands/shuttle/job-schedules/delete.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/job-schedules/delete.js)_

## `box shuttle:job-schedules:get ID`

Get a shuttle job schedule by ID Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
  Get a shuttle job schedule by ID Requires a token with the manage_enterprise_properties scope (and Shuttle access for
  the enterprise).

EXAMPLES
  $ box shuttle:job-schedules:get 6a315c0754833bfc5df067bf
```

_See code: [src/commands/shuttle/job-schedules/get.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/job-schedules/get.js)_

## `box shuttle:job-schedules:list`

List shuttle job schedules Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
      --job-id=<value>             (required) Shuttle job ID whose schedules to list
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List shuttle job schedules Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

ALIASES
  $ box shuttle:job-schedules:list

EXAMPLES
  $ box shuttle:job-schedules --job-id 6a315c0754833bfc5df067bf
```

## `box shuttle:job-schedules:update ID`

Update a shuttle job schedule Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

```
USAGE
  $ box shuttle:job-schedules:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--body-file <value> | --body <value>]
    [--state enabled|paused] [--run-mode transfer|simulation|analysis] [--description <value>] [--trigger-type
    by_time|by_job] [--start-at <value>] [--time-zone <value>] [--repeat none|daily|weekly|weekdays|weekends]
    [--triggered-by-job-id <value>] [--last-run-condition always|on_success|on_finish]

ARGUMENTS
  ID  ID of the shuttle job schedule to update

FLAGS
  -h, --help                         Show CLI help
  -q, --quiet                        Suppress any non-error output to stderr
  -s, --save                         Save report to default reports folder on disk
  -t, --token=<value>                Provide a token to perform this call
  -v, --verbose                      Show verbose output, which can be helpful for debugging
  -y, --yes                          Automatically respond yes to all confirmation prompts
      --as-user=<value>              Provide an ID for a user
      --body=<value>                 Escape hatch: full JSON request body (snake_case or camelCase). When set, other
                                     body-building flags are ignored.
      --body-file=<value>            Escape hatch: path to a JSON file used as the full request body.
      --bulk-file-path=<value>       File path to bulk .csv or .json objects
      --csv                          Output formatted CSV
      --description=<value>          Updated description
      --fields=<value>               Comma separated list of fields to show
      --json                         Output formatted JSON
      --last-run-condition=<option>  Condition on the triggering job last run. Accepted values: always, on_success,
                                     on_finish
                                     <options: always|on_success|on_finish>
      --no-color                     Turn off colors for logging
      --repeat=<option>              Repeat cadence for by_time trigger. Accepted values: none, daily, weekly, weekdays,
                                     weekends
                                     <options: none|daily|weekly|weekdays|weekends>
      --run-mode=<option>            Schedule run mode. Accepted values: transfer, simulation, analysis
                                     <options: transfer|simulation|analysis>
      --save-to-file-path=<value>    Override default file path to save report
      --start-at=<value>             Local start time for by_time trigger (YYYY-MM-DDTHH:MM:SS, no Z)
      --state=<option>               Schedule state. Accepted values: enabled, paused
                                     <options: enabled|paused>
      --time-zone=<value>            IANA time zone for by_time trigger
      --trigger-type=<option>        Schedule trigger type. Accepted values: by_time, by_job
                                     <options: by_time|by_job>
      --triggered-by-job-id=<value>  Triggering job ID for by_job trigger

DESCRIPTION
  Update a shuttle job schedule Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

EXAMPLES
  $ box shuttle:job-schedules:update 6a315c0754833bfc5df067bf --state paused

  $ box shuttle:job-schedules:update 6a315c0754833bfc5df067bf --trigger-type by_time --start-at 2026-03-16T09:00:00 --time-zone America/Los_Angeles --repeat weekdays
```

_See code: [src/commands/shuttle/job-schedules/update.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/job-schedules/update.js)_

## `box shuttle:jobs`

List shuttle jobs Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
  List shuttle jobs Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

ALIASES
  $ box shuttle:jobs:list

EXAMPLES
  $ box shuttle:jobs
```

_See code: [src/commands/shuttle/jobs/index.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/jobs/index.js)_

## `box shuttle:jobs:create [NAME]`

Create a shuttle job Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

```
USAGE
  $ box shuttle:jobs:create [NAME] [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--body-file <value>
    | --body <value>] [--job-type transfer|analysis] [--source-system-id <value>] [--comment <value>] [--tag <value>...]
    [--account-mapping-enabled] [--permission-conflict-strategy preserve_structure_restrict_sharing|preserve_structure_e
    xpand_sharing|preserve_sharing_modify_structure|warn_permissions_conflicts] [--are-external-shares-mapped]
    [--are-permissions-mapped] [--bandwidth-limit-bytes-per-sec <value>] [--are-deletions-mirrored]
    [--are-file-versions-synced] [--max-file-versions <value>] [--is-overwrite-enabled]
    [--are-completed-mappings-skipped-on-rerun] [--is-content-scanning-enabled] [--include-shared-source-folders]
    [--include-shared-destination-folders]

ARGUMENTS
  [NAME]  Display name for the new shuttle job (required unless --body / --body-file)

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
      Enable account mapping for the job

  --[no-]are-completed-mappings-skipped-on-rerun
      Skip completed mappings on rerun

  --[no-]are-deletions-mirrored
      Mirror source deletions in Box

  --[no-]are-external-shares-mapped
      Map external shares

  --[no-]are-file-versions-synced
      Sync prior file versions

  --[no-]are-permissions-mapped
      Map permissions

  --as-user=<value>
      Provide an ID for a user

  --bandwidth-limit-bytes-per-sec=<value>
      Max transfer bandwidth in bytes/sec

  --body=<value>
      Escape hatch: full JSON request body (snake_case or camelCase). When set, other body-building flags are ignored.

  --body-file=<value>
      Escape hatch: path to a JSON file used as the full request body.

  --bulk-file-path=<value>
      File path to bulk .csv or .json objects

  --comment=<value>
      Optional comment for the job

  --csv
      Output formatted CSV

  --fields=<value>
      Comma separated list of fields to show

  --[no-]include-shared-destination-folders
      Include shared folders on the destination

  --[no-]include-shared-source-folders
      Include shared folders on the source

  --[no-]is-content-scanning-enabled
      Enable content scanning when supported

  --[no-]is-overwrite-enabled
      Overwrite existing files in Box

  --job-type=<option>
      Job type (required unless --body / --body-file). Accepted values: transfer, analysis
      <options: transfer|analysis>

  --json
      Output formatted JSON

  --max-file-versions=<value>
      Max file versions to sync

  --no-color
      Turn off colors for logging

  --permission-conflict-strategy=<option>
      Permission conflict strategy. Accepted values: preserve_structure_restrict_sharing,
      preserve_structure_expand_sharing, preserve_sharing_modify_structure, warn_permissions_conflicts
      <options: preserve_structure_restrict_sharing|preserve_structure_expand_sharing|preserve_sharing_modify_structure|wa
      rn_permissions_conflicts>

  --save-to-file-path=<value>
      Override default file path to save report

  --source-system-id=<value>
      Source shuttle system ID (required unless --body / --body-file)

  --tag=<value>...
      Tag to attach (repeatable)

DESCRIPTION
  Create a shuttle job Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

EXAMPLES
  $ box shuttle:jobs:create "Q4 Migration" --job-type transfer --source-system-id 6a3ba68e810d9156194530a1

  $ box shuttle:jobs:create "Q4 Migration" --job-type transfer --source-system-id 6a3ba68e810d9156194530a1 --account-mapping-enabled --are-permissions-mapped --is-overwrite-enabled
```

_See code: [src/commands/shuttle/jobs/create.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/jobs/create.js)_

## `box shuttle:jobs:delete ID`

Delete a shuttle job Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
  Delete a shuttle job Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

EXAMPLES
  $ box shuttle:jobs:delete 6a315c0754833bfc5df067bf
```

_See code: [src/commands/shuttle/jobs/delete.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/jobs/delete.js)_

## `box shuttle:jobs:get ID`

Get a shuttle job by ID Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
  Get a shuttle job by ID Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

EXAMPLES
  $ box shuttle:jobs:get 6a315c0754833bfc5df067bf
```

_See code: [src/commands/shuttle/jobs/get.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/jobs/get.js)_

## `box shuttle:jobs:list`

List shuttle jobs Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
  List shuttle jobs Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

ALIASES
  $ box shuttle:jobs:list

EXAMPLES
  $ box shuttle:jobs
```

## `box shuttle:jobs:prepare-migration ID`

Prepare a shuttle job for migration Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
  Prepare a shuttle job for migration Requires a token with the manage_enterprise_properties scope (and Shuttle access
  for the enterprise).

EXAMPLES
  $ box shuttle:jobs:prepare-migration 6a315c0754833bfc5df067bf
```

_See code: [src/commands/shuttle/jobs/prepare-migration.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/jobs/prepare-migration.js)_

## `box shuttle:jobs:start ID`

Start a shuttle job run Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

```
USAGE
  $ box shuttle:jobs:start ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--body-file <value> | --body <value>]
    [--mode transfer|simulation|scan|analysis]

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
      --body=<value>               Escape hatch: full JSON request body (snake_case or camelCase). When set, other
                                   body-building flags are ignored.
      --body-file=<value>          Escape hatch: path to a JSON file used as the full request body.
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --mode=<option>              Run mode (defaults to simulation when omitted). Accepted values: transfer,
                                   simulation, scan, analysis
                                   <options: transfer|simulation|scan|analysis>
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Start a shuttle job run Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

EXAMPLES
  $ box shuttle:jobs:start 6a315c0754833bfc5df067bf

  $ box shuttle:jobs:start 6a315c0754833bfc5df067bf --mode transfer
```

_See code: [src/commands/shuttle/jobs/start.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/jobs/start.js)_

## `box shuttle:jobs:stop ID`

Stop a running shuttle job Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
  Stop a running shuttle job Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

EXAMPLES
  $ box shuttle:jobs:stop 6a315c0754833bfc5df067bf
```

_See code: [src/commands/shuttle/jobs/stop.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/jobs/stop.js)_

## `box shuttle:jobs:update ID`

Update a shuttle job Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

```
USAGE
  $ box shuttle:jobs:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--body-file <value> | --body <value>]
    [-n <value>] [--comment <value>] [--tag <value>...] [--account-mapping-enabled] [--permission-conflict-strategy
    preserve_structure_restrict_sharing|preserve_structure_expand_sharing|preserve_sharing_modify_structure|warn_permiss
    ions_conflicts] [--are-external-shares-mapped] [--are-permissions-mapped] [--bandwidth-limit-bytes-per-sec <value>]
    [--are-deletions-mirrored] [--are-file-versions-synced] [--max-file-versions <value>] [--is-overwrite-enabled]
    [--are-completed-mappings-skipped-on-rerun] [--is-content-scanning-enabled] [--include-shared-source-folders]
    [--include-shared-destination-folders]

ARGUMENTS
  ID  ID of the shuttle job to update

FLAGS
  -h, --help
      Show CLI help

  -n, --name=<value>
      Updated display name

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
      Enable account mapping for the job

  --[no-]are-completed-mappings-skipped-on-rerun
      Skip completed mappings on rerun

  --[no-]are-deletions-mirrored
      Mirror source deletions in Box

  --[no-]are-external-shares-mapped
      Map external shares

  --[no-]are-file-versions-synced
      Sync prior file versions

  --[no-]are-permissions-mapped
      Map permissions

  --as-user=<value>
      Provide an ID for a user

  --bandwidth-limit-bytes-per-sec=<value>
      Max transfer bandwidth in bytes/sec

  --body=<value>
      Escape hatch: full JSON request body (snake_case or camelCase). When set, other body-building flags are ignored.

  --body-file=<value>
      Escape hatch: path to a JSON file used as the full request body.

  --bulk-file-path=<value>
      File path to bulk .csv or .json objects

  --comment=<value>
      Updated comment

  --csv
      Output formatted CSV

  --fields=<value>
      Comma separated list of fields to show

  --[no-]include-shared-destination-folders
      Include shared folders on the destination

  --[no-]include-shared-source-folders
      Include shared folders on the source

  --[no-]is-content-scanning-enabled
      Enable content scanning when supported

  --[no-]is-overwrite-enabled
      Overwrite existing files in Box

  --json
      Output formatted JSON

  --max-file-versions=<value>
      Max file versions to sync

  --no-color
      Turn off colors for logging

  --permission-conflict-strategy=<option>
      Permission conflict strategy. Accepted values: preserve_structure_restrict_sharing,
      preserve_structure_expand_sharing, preserve_sharing_modify_structure, warn_permissions_conflicts
      <options: preserve_structure_restrict_sharing|preserve_structure_expand_sharing|preserve_sharing_modify_structure|wa
      rn_permissions_conflicts>

  --save-to-file-path=<value>
      Override default file path to save report

  --tag=<value>...
      Replacement tags (repeatable)

DESCRIPTION
  Update a shuttle job Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

EXAMPLES
  $ box shuttle:jobs:update 6a315c0754833bfc5df067bf --name "Q4 Migration (revised)"

  $ box shuttle:jobs:update 6a315c0754833bfc5df067bf --account-mapping-enabled --no-are-permissions-mapped
```

_See code: [src/commands/shuttle/jobs/update.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/jobs/update.js)_

## `box shuttle:mapping-errors`

List shuttle mapping errors Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
      --job-id=<value>             (required) Shuttle job ID whose mapping errors to list
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List shuttle mapping errors Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

ALIASES
  $ box shuttle:mapping-errors:list

EXAMPLES
  $ box shuttle:mapping-errors --job-id 6a315c0754833bfc5df067bf
```

_See code: [src/commands/shuttle/mapping-errors/index.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/mapping-errors/index.js)_

## `box shuttle:mapping-errors:list`

List shuttle mapping errors Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
      --job-id=<value>             (required) Shuttle job ID whose mapping errors to list
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List shuttle mapping errors Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

ALIASES
  $ box shuttle:mapping-errors:list

EXAMPLES
  $ box shuttle:mapping-errors --job-id 6a315c0754833bfc5df067bf
```

## `box shuttle:path-entries`

List shuttle path entries for a job side Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
      --account-email=<value>      Filter by account email
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --job-id=<value>             (required) Shuttle job ID
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --path=<value>               Filter by path
      --path-id=<value>            Filter by path ID
      --save-to-file-path=<value>  Override default file path to save report
      --side=<option>              (required) Which side of the migration to browse. Accepted values: source, target
                                   <options: source|target>

DESCRIPTION
  List shuttle path entries for a job side Requires a token with the manage_enterprise_properties scope (and Shuttle
  access for the enterprise).

ALIASES
  $ box shuttle:path-entries:list

EXAMPLES
  $ box shuttle:path-entries --job-id 6a315c0754833bfc5df067bf --side source
```

_See code: [src/commands/shuttle/path-entries/index.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/path-entries/index.js)_

## `box shuttle:path-entries:list`

List shuttle path entries for a job side Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
      --account-email=<value>      Filter by account email
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --job-id=<value>             (required) Shuttle job ID
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --path=<value>               Filter by path
      --path-id=<value>            Filter by path ID
      --save-to-file-path=<value>  Override default file path to save report
      --side=<option>              (required) Which side of the migration to browse. Accepted values: source, target
                                   <options: source|target>

DESCRIPTION
  List shuttle path entries for a job side Requires a token with the manage_enterprise_properties scope (and Shuttle
  access for the enterprise).

ALIASES
  $ box shuttle:path-entries:list

EXAMPLES
  $ box shuttle:path-entries --job-id 6a315c0754833bfc5df067bf --side source
```

## `box shuttle:path-mapping-imports:create`

Import shuttle path mappings from a Box spreadsheet file (async; empty response on accept) Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

```
USAGE
  $ box shuttle:path-mapping-imports:create [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--body-file <value> | --body <value>]
    [--job-id <value>] [--file-id <value>]

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --body=<value>               Escape hatch: full JSON request body (snake_case or camelCase). When set, other
                                   body-building flags are ignored.
      --body-file=<value>          Escape hatch: path to a JSON file used as the full request body.
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --file-id=<value>            Box file ID of the mapping workbook (required unless --body / --body-file)
      --job-id=<value>             Shuttle job ID (required unless --body / --body-file)
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Import shuttle path mappings from a Box spreadsheet file (async; empty response on accept) Requires a token with the
  manage_enterprise_properties scope (and Shuttle access for the enterprise).

EXAMPLES
  $ box shuttle:path-mapping-imports:create --job-id 6a315c0754833bfc5df067bf --file-id 12345678901
```

_See code: [src/commands/shuttle/path-mapping-imports/create.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/path-mapping-imports/create.js)_

## `box shuttle:path-mappings`

List shuttle path mappings Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
      --job-id=<value>             (required) Shuttle job ID whose path mappings to list
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List shuttle path mappings Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

ALIASES
  $ box shuttle:path-mappings:list

EXAMPLES
  $ box shuttle:path-mappings --job-id 6a315c0754833bfc5df067bf
```

_See code: [src/commands/shuttle/path-mappings/index.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/path-mappings/index.js)_

## `box shuttle:path-mappings:create`

Create a shuttle path mapping Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

```
USAGE
  $ box shuttle:path-mappings:create [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--body-file <value> | --body <value>]
    [--job-id <value>] [--is-path-skipped] [--clear-target] [--source-type account|shared_space] [--source-path <value>]
    [--source-path-id <value>] [--source-account-id <value>] [--source-account-email <value>] [--source-space <value>]
    [--source-is-directory] [--target-type account|shared_space] [--target-path <value>] [--target-path-id <value>]
    [--target-account-id <value>] [--target-account-email <value>] [--target-space <value>]

FLAGS
  -h, --help                          Show CLI help
  -q, --quiet                         Suppress any non-error output to stderr
  -s, --save                          Save report to default reports folder on disk
  -t, --token=<value>                 Provide a token to perform this call
  -v, --verbose                       Show verbose output, which can be helpful for debugging
  -y, --yes                           Automatically respond yes to all confirmation prompts
      --as-user=<value>               Provide an ID for a user
      --body=<value>                  Escape hatch: full JSON request body (snake_case or camelCase). When set, other
                                      body-building flags are ignored.
      --body-file=<value>             Escape hatch: path to a JSON file used as the full request body.
      --bulk-file-path=<value>        File path to bulk .csv or .json objects
      --clear-target                  Set target to null (e.g. when skipping the path)
      --csv                           Output formatted CSV
      --fields=<value>                Comma separated list of fields to show
      --[no-]is-path-skipped          Skip this source path during migration
      --job-id=<value>                Shuttle job ID (required unless --body / --body-file)
      --json                          Output formatted JSON
      --no-color                      Turn off colors for logging
      --save-to-file-path=<value>     Override default file path to save report
      --source-account-email=<value>  source account email (account type)
      --source-account-id=<value>     source account id (account type)
      --[no-]source-is-directory      Whether the source path is a directory
      --source-path=<value>           source path
      --source-path-id=<value>        source path ID from browsing
      --source-space=<value>          source shared container name (shared_space type)
      --source-type=<option>          source location type. Accepted values: account, shared_space
                                      <options: account|shared_space>
      --target-account-email=<value>  target account email (account type)
      --target-account-id=<value>     target account id (account type)
      --target-path=<value>           target path
      --target-path-id=<value>        target path ID from browsing
      --target-space=<value>          target shared container name (shared_space type)
      --target-type=<option>          target location type. Accepted values: account, shared_space
                                      <options: account|shared_space>

DESCRIPTION
  Create a shuttle path mapping Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

EXAMPLES
  $ box shuttle:path-mappings:create --job-id 6a315c0754833bfc5df067bf --source-type account --source-path "/Finance" --source-account-email admin@company.com --target-type account --target-path "/HR Migration" --target-account-email admin@company.box.com
```

_See code: [src/commands/shuttle/path-mappings/create.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/path-mappings/create.js)_

## `box shuttle:path-mappings:delete ID`

Delete a shuttle path mapping Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
  Delete a shuttle path mapping Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

EXAMPLES
  $ box shuttle:path-mappings:delete 6a315c0754833bfc5df067bf
```

_See code: [src/commands/shuttle/path-mappings/delete.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/path-mappings/delete.js)_

## `box shuttle:path-mappings:get ID`

Get a shuttle path mapping by ID Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
  Get a shuttle path mapping by ID Requires a token with the manage_enterprise_properties scope (and Shuttle access for
  the enterprise).

EXAMPLES
  $ box shuttle:path-mappings:get 6a315c0754833bfc5df067bf
```

_See code: [src/commands/shuttle/path-mappings/get.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/path-mappings/get.js)_

## `box shuttle:path-mappings:list`

List shuttle path mappings Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
      --job-id=<value>             (required) Shuttle job ID whose path mappings to list
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List shuttle path mappings Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

ALIASES
  $ box shuttle:path-mappings:list

EXAMPLES
  $ box shuttle:path-mappings --job-id 6a315c0754833bfc5df067bf
```

## `box shuttle:path-mappings:update ID`

Update a shuttle path mapping Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

```
USAGE
  $ box shuttle:path-mappings:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--body-file <value> | --body <value>]
    [--is-path-skipped] [--clear-target] [--source-type account|shared_space] [--source-path <value>] [--source-path-id
    <value>] [--source-account-id <value>] [--source-account-email <value>] [--source-space <value>]
    [--source-is-directory] [--target-type account|shared_space] [--target-path <value>] [--target-path-id <value>]
    [--target-account-id <value>] [--target-account-email <value>] [--target-space <value>]

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
      --body=<value>                  Escape hatch: full JSON request body (snake_case or camelCase). When set, other
                                      body-building flags are ignored.
      --body-file=<value>             Escape hatch: path to a JSON file used as the full request body.
      --bulk-file-path=<value>        File path to bulk .csv or .json objects
      --clear-target                  Set target to null
      --csv                           Output formatted CSV
      --fields=<value>                Comma separated list of fields to show
      --[no-]is-path-skipped          Skip this source path during migration
      --json                          Output formatted JSON
      --no-color                      Turn off colors for logging
      --save-to-file-path=<value>     Override default file path to save report
      --source-account-email=<value>  source account email (account type)
      --source-account-id=<value>     source account id (account type)
      --[no-]source-is-directory      Whether the source path is a directory
      --source-path=<value>           source path
      --source-path-id=<value>        source path ID from browsing
      --source-space=<value>          source shared container name (shared_space type)
      --source-type=<option>          source location type. Accepted values: account, shared_space
                                      <options: account|shared_space>
      --target-account-email=<value>  target account email (account type)
      --target-account-id=<value>     target account id (account type)
      --target-path=<value>           target path
      --target-path-id=<value>        target path ID from browsing
      --target-space=<value>          target shared container name (shared_space type)
      --target-type=<option>          target location type. Accepted values: account, shared_space
                                      <options: account|shared_space>

DESCRIPTION
  Update a shuttle path mapping Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

EXAMPLES
  $ box shuttle:path-mappings:update 6a315c0754833bfc5df067bf --is-path-skipped --clear-target

  $ box shuttle:path-mappings:update 6a315c0754833bfc5df067bf --target-type account --target-path "/HR" --target-account-email admin@company.box.com
```

_See code: [src/commands/shuttle/path-mappings/update.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/path-mappings/update.js)_

## `box shuttle:reports`

List shuttle reports Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
      --run-id=<value>             (required) Shuttle run ID whose reports to list
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List shuttle reports Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

ALIASES
  $ box shuttle:reports:list

EXAMPLES
  $ box shuttle:reports --run-id 6a315c0754833bfc5df067bf:42
```

_See code: [src/commands/shuttle/reports/index.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/reports/index.js)_

## `box shuttle:reports:create`

Create (generate) a shuttle report for a run Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

```
USAGE
  $ box shuttle:reports:create [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--body-file <value> | --body <value>]
    [--run-id <value>] [--format xlsx|csv] [--section <value>...] [--users-scope migrated|all]

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --body=<value>               Escape hatch: full JSON request body (snake_case or camelCase). When set, other
                                   body-building flags are ignored.
      --body-file=<value>          Escape hatch: path to a JSON file used as the full request body.
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --format=<option>            Report format (required unless --body / --body-file). Accepted values: xlsx, csv
                                   <options: xlsx|csv>
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --run-id=<value>             Shuttle run ID (required unless --body / --body-file)
      --save-to-file-path=<value>  Override default file path to save report
      --section=<value>...         Report section to include (repeatable; required unless --body / --body-file)
      --users-scope=<option>       Users scope for user-related sections. Accepted values: migrated, all
                                   <options: migrated|all>

DESCRIPTION
  Create (generate) a shuttle report for a run Requires a token with the manage_enterprise_properties scope (and Shuttle
  access for the enterprise).

EXAMPLES
  $ box shuttle:reports:create --run-id 6a315c0754833bfc5df067bf:42 --format xlsx --section event_log --section transfer_overview
```

_See code: [src/commands/shuttle/reports/create.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/reports/create.js)_

## `box shuttle:reports:get ID`

Get a shuttle report by ID Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
  Get a shuttle report by ID Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

EXAMPLES
  $ box shuttle:reports:get 6a315c0754833bfc5df067bf
```

_See code: [src/commands/shuttle/reports/get.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/reports/get.js)_

## `box shuttle:reports:list`

List shuttle reports Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
      --run-id=<value>             (required) Shuttle run ID whose reports to list
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List shuttle reports Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

ALIASES
  $ box shuttle:reports:list

EXAMPLES
  $ box shuttle:reports --run-id 6a315c0754833bfc5df067bf:42
```

## `box shuttle:runs`

List shuttle runs Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
      --job-id=<value>             (required) Shuttle job ID whose runs to list
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List shuttle runs Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

ALIASES
  $ box shuttle:runs:list

EXAMPLES
  $ box shuttle:runs --job-id 6a315c0754833bfc5df067bf
```

_See code: [src/commands/shuttle/runs/index.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/runs/index.js)_

## `box shuttle:runs:get ID`

Get a shuttle run by ID Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

```
USAGE
  $ box shuttle:runs:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  ID of the shuttle run

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
  Get a shuttle run by ID Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

EXAMPLES
  $ box shuttle:runs:get 6a315c0754833bfc5df067bf:42
```

_See code: [src/commands/shuttle/runs/get.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/runs/get.js)_

## `box shuttle:runs:list`

List shuttle runs Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
      --job-id=<value>             (required) Shuttle job ID whose runs to list
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List shuttle runs Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

ALIASES
  $ box shuttle:runs:list

EXAMPLES
  $ box shuttle:runs --job-id 6a315c0754833bfc5df067bf
```

## `box shuttle:subject-mapping-imports:create`

Import shuttle subject mappings from a Box spreadsheet file (async; empty response on accept) Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

```
USAGE
  $ box shuttle:subject-mapping-imports:create [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--body-file <value> | --body <value>]
    [--job-id <value>] [--file-id <value>]

FLAGS
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --body=<value>               Escape hatch: full JSON request body (snake_case or camelCase). When set, other
                                   body-building flags are ignored.
      --body-file=<value>          Escape hatch: path to a JSON file used as the full request body.
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --file-id=<value>            Box file ID of the mapping workbook (required unless --body / --body-file)
      --job-id=<value>             Shuttle job ID (required unless --body / --body-file)
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Import shuttle subject mappings from a Box spreadsheet file (async; empty response on accept) Requires a token with
  the manage_enterprise_properties scope (and Shuttle access for the enterprise).

EXAMPLES
  $ box shuttle:subject-mapping-imports:create --job-id 6a315c0754833bfc5df067bf --file-id 12345678901
```

_See code: [src/commands/shuttle/subject-mapping-imports/create.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/subject-mapping-imports/create.js)_

## `box shuttle:subject-mappings`

List shuttle subject mappings Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
      --job-id=<value>             (required) Shuttle job ID whose subject mappings to list
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List shuttle subject mappings Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

ALIASES
  $ box shuttle:subject-mappings:list

EXAMPLES
  $ box shuttle:subject-mappings --job-id 6a315c0754833bfc5df067bf
```

_See code: [src/commands/shuttle/subject-mappings/index.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/subject-mappings/index.js)_

## `box shuttle:subject-mappings:create`

Create a shuttle subject mapping Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

```
USAGE
  $ box shuttle:subject-mappings:create [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--body-file <value> | --body <value>]
    [--job-id <value>] [--discovered-subject-id <value>] [--revision <value>] [--is-subject-skipped] [--target-type
    user|group] [--target-id <value>] [--clear-target]

FLAGS
  -h, --help                           Show CLI help
  -q, --quiet                          Suppress any non-error output to stderr
  -s, --save                           Save report to default reports folder on disk
  -t, --token=<value>                  Provide a token to perform this call
  -v, --verbose                        Show verbose output, which can be helpful for debugging
  -y, --yes                            Automatically respond yes to all confirmation prompts
      --as-user=<value>                Provide an ID for a user
      --body=<value>                   Escape hatch: full JSON request body (snake_case or camelCase). When set, other
                                       body-building flags are ignored.
      --body-file=<value>              Escape hatch: path to a JSON file used as the full request body.
      --bulk-file-path=<value>         File path to bulk .csv or .json objects
      --clear-target                   Set target to null (e.g. when skipping the subject)
      --csv                            Output formatted CSV
      --discovered-subject-id=<value>  Discovered subject ID (required unless --body / --body-file)
      --fields=<value>                 Comma separated list of fields to show
      --[no-]is-subject-skipped        Skip this subject during migration
      --job-id=<value>                 Shuttle job ID (required unless --body / --body-file)
      --json                           Output formatted JSON
      --no-color                       Turn off colors for logging
      --revision=<value>               Discovery-requirements revision to resolve against
      --save-to-file-path=<value>      Override default file path to save report
      --target-id=<value>              Box target subject ID
      --target-type=<option>           Box target subject type. Accepted values: user, group
                                       <options: user|group>

DESCRIPTION
  Create a shuttle subject mapping Requires a token with the manage_enterprise_properties scope (and Shuttle access for
  the enterprise).

EXAMPLES
  $ box shuttle:subject-mappings:create --job-id 6a315c0754833bfc5df067bf --discovered-subject-id 6a3ba7c02ea17bc9461eeacf --target-type user --target-id 12345678

  $ box shuttle:subject-mappings:create --job-id 6a315c0754833bfc5df067bf --discovered-subject-id 6a3ba7c02ea17bc9461eeacf --is-subject-skipped --clear-target
```

_See code: [src/commands/shuttle/subject-mappings/create.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/subject-mappings/create.js)_

## `box shuttle:subject-mappings:delete ID`

Delete a shuttle subject mapping Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
  Delete a shuttle subject mapping Requires a token with the manage_enterprise_properties scope (and Shuttle access for
  the enterprise).

EXAMPLES
  $ box shuttle:subject-mappings:delete 6a315c0754833bfc5df067bf
```

_See code: [src/commands/shuttle/subject-mappings/delete.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/subject-mappings/delete.js)_

## `box shuttle:subject-mappings:get ID`

Get a shuttle subject mapping by ID Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
  Get a shuttle subject mapping by ID Requires a token with the manage_enterprise_properties scope (and Shuttle access
  for the enterprise).

EXAMPLES
  $ box shuttle:subject-mappings:get 6a315c0754833bfc5df067bf
```

_See code: [src/commands/shuttle/subject-mappings/get.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/subject-mappings/get.js)_

## `box shuttle:subject-mappings:list`

List shuttle subject mappings Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
      --job-id=<value>             (required) Shuttle job ID whose subject mappings to list
      --json                       Output formatted JSON
      --max-items=<value>          A value that indicates the maximum number of results to return. This only specifies a
                                   maximum boundary and will not guarantee the minimum number of results returned. When
                                   the max-items (x) is greater than 1000, then the maximum ceil(x/1000) requests will
                                   be made.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List shuttle subject mappings Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

ALIASES
  $ box shuttle:subject-mappings:list

EXAMPLES
  $ box shuttle:subject-mappings --job-id 6a315c0754833bfc5df067bf
```

## `box shuttle:subject-mappings:update ID`

Update a shuttle subject mapping Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

```
USAGE
  $ box shuttle:subject-mappings:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--body-file <value> | --body <value>]
    [--is-subject-skipped] [--target-type user|group] [--target-id <value>] [--clear-target]

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
      --body=<value>               Escape hatch: full JSON request body (snake_case or camelCase). When set, other
                                   body-building flags are ignored.
      --body-file=<value>          Escape hatch: path to a JSON file used as the full request body.
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --clear-target               Set target to null (e.g. when skipping the subject)
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --[no-]is-subject-skipped    Skip this subject during migration
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report
      --target-id=<value>          Box target subject ID
      --target-type=<option>       Box target subject type. Accepted values: user, group
                                   <options: user|group>

DESCRIPTION
  Update a shuttle subject mapping Requires a token with the manage_enterprise_properties scope (and Shuttle access for
  the enterprise).

EXAMPLES
  $ box shuttle:subject-mappings:update 6a315c0754833bfc5df067bf --target-type user --target-id 12345678

  $ box shuttle:subject-mappings:update 6a315c0754833bfc5df067bf --is-subject-skipped --clear-target
```

_See code: [src/commands/shuttle/subject-mappings/update.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/subject-mappings/update.js)_

## `box shuttle:systems`

List shuttle systems Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
  List shuttle systems Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

ALIASES
  $ box shuttle:systems:list

EXAMPLES
  $ box shuttle:systems

  $ box shuttle:systems --max-items 50
```

_See code: [src/commands/shuttle/systems/index.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/systems/index.js)_

## `box shuttle:systems:create NAME`

Create a shuttle system (Windows agent systems only via public API) Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

```
USAGE
  $ box shuttle:systems:create NAME --system-type windows [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s
    | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  NAME  Display name for the new shuttle system

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
      --system-type=<option>       (required) System type. Only windows is supported through the public API.
                                   <options: windows>

DESCRIPTION
  Create a shuttle system (Windows agent systems only via public API) Requires a token with the
  manage_enterprise_properties scope (and Shuttle access for the enterprise).

EXAMPLES
  $ box shuttle:systems:create "NYC File Server" --system-type windows
```

_See code: [src/commands/shuttle/systems/create.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/systems/create.js)_

## `box shuttle:systems:delete ID`

Delete a shuttle system Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
  Delete a shuttle system Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

EXAMPLES
  $ box shuttle:systems:delete 6a315c0754833bfc5df067bf
```

_See code: [src/commands/shuttle/systems/delete.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/systems/delete.js)_

## `box shuttle:systems:get ID`

Get a shuttle system by ID Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
  Get a shuttle system by ID Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

EXAMPLES
  $ box shuttle:systems:get 6a315c0754833bfc5df067bf
```

_See code: [src/commands/shuttle/systems/get.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/systems/get.js)_

## `box shuttle:systems:issue-registration-token ID`

Issue a registration token for a Windows shuttle agent system Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

```
USAGE
  $ box shuttle:systems:issue-registration-token ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
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
  Issue a registration token for a Windows shuttle agent system Requires a token with the manage_enterprise_properties
  scope (and Shuttle access for the enterprise).

EXAMPLES
  $ box shuttle:systems:issue-registration-token 6a315c0754833bfc5df067bf
```

_See code: [src/commands/shuttle/systems/issue-registration-token.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/systems/issue-registration-token.js)_

## `box shuttle:systems:list`

List shuttle systems Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

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
  List shuttle systems Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

ALIASES
  $ box shuttle:systems:list

EXAMPLES
  $ box shuttle:systems

  $ box shuttle:systems --max-items 50
```

## `box shuttle:systems:update ID`

Update a shuttle system Requires a token with the manage_enterprise_properties scope (and Shuttle access for the enterprise).

```
USAGE
  $ box shuttle:systems:update ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [-n <value>]

ARGUMENTS
  ID  ID of the shuttle system to update

FLAGS
  -h, --help                       Show CLI help
  -n, --name=<value>               Updated display name for the shuttle system
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
  Update a shuttle system Requires a token with the manage_enterprise_properties scope (and Shuttle access for the
  enterprise).

EXAMPLES
  $ box shuttle:systems:update 6a315c0754833bfc5df067bf --name "NYC File Server (Primary)"
```

_See code: [src/commands/shuttle/systems/update.js](https://github.com/box/boxcli/blob/v4.10.1/src/commands/shuttle/systems/update.js)_
