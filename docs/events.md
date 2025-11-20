`box events`
============

Get events

* [`box events`](#box-events)
* [`box events:get`](#box-eventsget)
* [`box events:poll`](#box-eventspoll)

## `box events`

Get events

```
USAGE
  $ box events [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--event-types <value>]
    [--stream-position <value> | [--created-before <value> ] | [--created-after <value> -e]] [--limit <value>]
    [--stream-type admin_logs|admin_logs_streaming ]

FLAGS
  -e, --enterprise
      Get all enterprise events form a given criteria.
      CLI will use the `next_stream_position` automatically to fetch all records.

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

  --created-after=<value>
      Return enterprise events that occurred after a time. Use a timestamp or shorthand syntax 0t, like 5w for 5 weeks. If
      not used, defaults to 5 days before the end date

  --created-before=<value>
      Return enterprise events that occurred before a time. Use a timestamp or shorthand syntax 0t, like 5w for 5 weeks.
      If not used, defaults to now

  --csv
      Output formatted CSV

  --event-types=<value>
      Return enterprise events filtered by event types. Format using a comma delimited list:
      NEW_USER,DELETE_USER,EDIT_USER

  --fields=<value>
      Comma separated list of fields to show

  --json
      Output formatted JSON

  --limit=<value>
      The maximum number of items to return.
      When using it with `enterprise` events, it determines the number of items to return per API call. The CLI will
      automatically use the `next_stream_position` to fetch all records.

  --no-color
      Turn off colors for logging

  --save-to-file-path=<value>
      Override default file path to save report

  --stream-position=<value>
      The location in the event stream from which you want to start receiving events

  --stream-type=<option>
      Stream type admin_logs or admin_logs_streaming.
      Unless specified `admin_logs` stream type is used.

      The emphasis for `admin_logs` stream is on completeness over latency, which means that Box will deliver admin events
      in chronological order and without duplicates, but with higher latency. You can specify start and end time/dates.

      The emphasis for `admin_logs_streaming` feed is on low latency rather than chronological accuracy, which means that
      Box may return events more than once and out of chronological order. Events are returned via the API around 12
      seconds after they are processed by Box (the 12 seconds buffer ensures that new events are not written after your
      cursor position). Only two weeks of events are available via this feed, and you cannot set start and end time/dates.
      <options: admin_logs|admin_logs_streaming>

DESCRIPTION
  Get events

ALIASES
  $ box events:get

EXAMPLES
  $ box events

  $ box events --enterprise --created-after 2019-01-01
```

_See code: [src/commands/events/index.js](https://github.com/box/boxcli/blob/v4.5.0/src/commands/events/index.js)_

## `box events:get`

Get events

```
USAGE
  $ box events:get [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--event-types <value>]
    [--stream-position <value> | [--created-before <value> ] | [--created-after <value> -e]] [--limit <value>]
    [--stream-type admin_logs|admin_logs_streaming ]

FLAGS
  -e, --enterprise
      Get all enterprise events form a given criteria.
      CLI will use the `next_stream_position` automatically to fetch all records.

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

  --created-after=<value>
      Return enterprise events that occurred after a time. Use a timestamp or shorthand syntax 0t, like 5w for 5 weeks. If
      not used, defaults to 5 days before the end date

  --created-before=<value>
      Return enterprise events that occurred before a time. Use a timestamp or shorthand syntax 0t, like 5w for 5 weeks.
      If not used, defaults to now

  --csv
      Output formatted CSV

  --event-types=<value>
      Return enterprise events filtered by event types. Format using a comma delimited list:
      NEW_USER,DELETE_USER,EDIT_USER

  --fields=<value>
      Comma separated list of fields to show

  --json
      Output formatted JSON

  --limit=<value>
      The maximum number of items to return.
      When using it with `enterprise` events, it determines the number of items to return per API call. The CLI will
      automatically use the `next_stream_position` to fetch all records.

  --no-color
      Turn off colors for logging

  --save-to-file-path=<value>
      Override default file path to save report

  --stream-position=<value>
      The location in the event stream from which you want to start receiving events

  --stream-type=<option>
      Stream type admin_logs or admin_logs_streaming.
      Unless specified `admin_logs` stream type is used.

      The emphasis for `admin_logs` stream is on completeness over latency, which means that Box will deliver admin events
      in chronological order and without duplicates, but with higher latency. You can specify start and end time/dates.

      The emphasis for `admin_logs_streaming` feed is on low latency rather than chronological accuracy, which means that
      Box may return events more than once and out of chronological order. Events are returned via the API around 12
      seconds after they are processed by Box (the 12 seconds buffer ensures that new events are not written after your
      cursor position). Only two weeks of events are available via this feed, and you cannot set start and end time/dates.
      <options: admin_logs|admin_logs_streaming>

DESCRIPTION
  Get events

ALIASES
  $ box events:get

EXAMPLES
  $ box events

  $ box events --enterprise --created-after 2019-01-01
```

## `box events:poll`

Poll the event stream

```
USAGE
  $ box events:poll [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [-e] [--event-types <value>]
    [--start-date <value>] [--end-date <value>] [--polling-interval <value>]

FLAGS
  -e, --enterprise                 Get enterprise events
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --end-date=<value>           Return enterprise events that occured before this time. Use a timestamp or shorthand
                                   syntax 00t, like 05w for 5 weeks.
      --event-types=<value>        Return enterprise events filtered by event types. Format using a comma delimited
                                   list: NEW_USER,DELETE_USER,EDIT_USER
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --polling-interval=<value>   Number of seconds to wait before polling for new events. Default is 60 seconds.
      --save-to-file-path=<value>  Override default file path to save report
      --start-date=<value>         Return enterprise events that occured after this time. Use a timestamp or shorthand
                                   syntax 00t, like 05w for 5 weeks. If not used, defaults to now

DESCRIPTION
  Poll the event stream
```

_See code: [src/commands/events/poll.js](https://github.com/box/boxcli/blob/v4.5.0/src/commands/events/poll.js)_
