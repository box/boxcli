`box events`
============

Get events

* [`box events`](#box-events)
* [`box events:poll`](#box-eventspoll)

## `box events`

Get events

```
USAGE
  $ box events

OPTIONS
  -e, --enterprise                       Get enterprise events
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects

  --created-after=created-after          Return enterprise events that occurred after a time. Use a timestamp or
                                         shorthand syntax 0t, like 5w for 5 weeks. If not used, defaults to 5 days
                                         before the end date

  --created-before=created-before        Return enterprise events that occurred before a time. Use a timestamp or
                                         shorthand syntax 0t, like 5w for 5 weeks. If not used, defaults to now

  --csv                                  Output formatted CSV

  --event-types=event-types              Return enterprise events filtered by event types. Format using a comma
                                         delimited list: NEW_USER,DELETE_USER,EDIT_USER

  --fields=fields                        Comma separated list of fields to show

  --json                                 Output formatted JSON

  --limit=limit                          The maximum number of items to return

  --no-color                             Turn off colors for logging

  --save-to-file-path=save-to-file-path  Override default file path to save report

  --stream-position=stream-position      The location in the event stream from which you want to start receiving events

ALIASES
  $ box events:get

EXAMPLES
  box events
  box events --enterprise --created-after 2019-01-01
```

_See code: [src/commands/events/index.js](https://github.com/box/boxcli/blob/v2.4.0/src/commands/events/index.js)_

## `box events:poll`

Poll the event stream

```
USAGE
  $ box events:poll

OPTIONS
  -e, --enterprise                       Get enterprise events
  -h, --help                             Show CLI help
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -v, --verbose                          Show verbose output, which can be helpful for debugging
  -y, --yes                              Automatically respond yes to all confirmation prompts
  --as-user=as-user                      Provide an ID for a user
  --bulk-file-path=bulk-file-path        File path to bulk .csv or .json objects
  --csv                                  Output formatted CSV

  --end-date=end-date                    Return enterprise events that occured before this time. Use a timestamp or
                                         shorthand syntax 00t, like 05w for 5 weeks.

  --event-types=event-types              Return enterprise events filtered by event types. Format using a comma
                                         delimited list: NEW_USER,DELETE_USER,EDIT_USER

  --fields=fields                        Comma separated list of fields to show

  --json                                 Output formatted JSON

  --no-color                             Turn off colors for logging

  --polling-interval=polling-interval    Number of seconds to wait before polling for new events. Default is 60 seconds.

  --save-to-file-path=save-to-file-path  Override default file path to save report

  --start-date=start-date                Return enterprise events that occured after this time. Use a timestamp or
                                         shorthand syntax 00t, like 05w for 5 weeks. If not used, defaults to now
```

_See code: [src/commands/events/poll.js](https://github.com/box/boxcli/blob/v2.4.0/src/commands/events/poll.js)_
