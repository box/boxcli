`box search`
============

Search for files and folders in your Enterprise

* [`box search [QUERY]`](#box-search-query)

## `box search [QUERY]`

Search for files and folders in your Enterprise

```
USAGE
  $ box search [QUERY]

ARGUMENTS
  QUERY  The search term

OPTIONS
  -h, --help                                     Show CLI help
  -q, --quiet                                    Suppress any non-error output to stderr
  -s, --save                                     Save report to default reports folder on disk
  -t, --token=token                              Provide a token to perform this call
  -v, --verbose                                  Show verbose output, which can be helpful for debugging
  -y, --yes                                      Automatically respond yes to all confirmation prompts
  --all                                          Returns all search results.

  --ancestor-folder-ids=ancestor-folder-ids      Search for the contents of specific folders (and folders within them).
                                                 Requires a folder ID or a set of comma-delimited folder IDs

  --as-user=as-user                              Provide an ID for a user

  --bulk-file-path=bulk-file-path                File path to bulk .csv or .json objects

  --content-types=content-types                  Search for objects of specified content types. Requires a content type
                                                 or a set of comma-delimited content types

  --created-at-from=created-at-from              Start of created date range. Use a RFC3339 timestamp or shorthand
                                                 syntax 0t, like 5w for 5 weeks

  --created-at-to=created-at-to                  End of created date range. Use a RFC3339 timestamp or shorthand syntax
                                                 0t, like 5w for 5 weeks

  --csv                                          Output formatted CSV

  --direction=asc|desc                           The direction to sort results (ascending or descending)

  --fields=fields                                Comma separated list of fields to show

  --file-extensions=file-extensions              Limit searches to specific file extensions i.e. png,md,pdf

  --include-recent-shared-links                  Returns shared links that the user recently accessed

  --json                                         Output formatted JSON

  --limit=limit                                  Defines the maximum number of items to return. Default value is 100.

  --mdfilter=mdfilter                            Metadata value to filter on, in the format
                                                 <scope>.<templateKey>.<field>=<value>

  --no-color                                     Turn off colors for logging

  --owner-user-ids=owner-user-ids                Search for objects by owner. Requires a user ID or a set of
                                                 comma-delimited user IDs

  --save-to-file-path=save-to-file-path          Override default file path to save report

  --scope=user_content|enterprise_content        The scope on which you want search

  --size-from=size-from                          Lower bound for file size, in bytes

  --size-to=size-to                              Upper bound for file size, in bytes

  --sort=sort                                    The field to sort results by

  --trash-content=trashed_only|non_trashed_only  Controls whether to search in the trash. Defaults to non_trashed_only

  --type=file|folder|web_link                    The type of objects you want to include in the search results

  --updated-at-from=updated-at-from              Start of updated date range. Use a RFC3339 timestamp or shorthand
                                                 syntax 0t, like 5w for 5 weeks

  --updated-at-to=updated-at-to                  End of updated date range. Use a RFC3339 timestamp or shorthand syntax
                                                 0t, like 5w for 5 weeks

EXAMPLES
  box search "Q3 OKR"
  box search --mdfilter "enterprise.employeeRecord.name=John Doe"
```

_See code: [src/commands/search.js](https://github.com/box/boxcli/blob/v3.14.1/src/commands/search.js)_
