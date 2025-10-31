`box search`
============

Search for files and folders in your Enterprise

* [`box search [QUERY]`](#box-search-query)

## `box search [QUERY]`

Search for files and folders in your Enterprise

```
USAGE
  $ box search [QUERY] [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--scope
    user_content|enterprise_content] [--type file|folder|web_link] [--file-extensions <value>] [--mdfilter <value>... |
    |  | ] [--content-types <value>] [--ancestor-folder-ids <value>] [--owner-user-ids <value>] [--created-at-from
    <value>] [--created-at-to <value>] [--updated-at-from <value>] [--updated-at-to <value>] [--trash-content
    trashed_only|non_trashed_only] [--size-from <value>] [--size-to <value>] [--direction asc|desc --sort <value>]
    [--limit <value>] [--all] [--include-recent-shared-links]

ARGUMENTS
  [QUERY]  The search term

FLAGS
  -h, --help                         Show CLI help
  -q, --quiet                        Suppress any non-error output to stderr
  -s, --save                         Save report to default reports folder on disk
  -t, --token=<value>                Provide a token to perform this call
  -v, --verbose                      Show verbose output, which can be helpful for debugging
  -y, --yes                          Automatically respond yes to all confirmation prompts
      --all                          Returns all search results.
      --ancestor-folder-ids=<value>  Search for the contents of specific folders (and folders within them). Requires a
                                     folder ID or a set of comma-delimited folder IDs
      --as-user=<value>              Provide an ID for a user
      --bulk-file-path=<value>       File path to bulk .csv or .json objects
      --content-types=<value>        Search for objects of specified content types. Requires a content type or a set of
                                     comma-delimited content types
      --created-at-from=<value>      Start of created date range. Use a RFC3339 timestamp or shorthand syntax 0t, like
                                     5w for 5 weeks
      --created-at-to=<value>        End of created date range. Use a RFC3339 timestamp or shorthand syntax 0t, like 5w
                                     for 5 weeks
      --csv                          Output formatted CSV
      --direction=<option>           The direction to sort results (ascending or descending)
                                     <options: asc|desc>
      --fields=<value>               Comma separated list of fields to show
      --file-extensions=<value>      Limit searches to specific file extensions i.e. png,md,pdf
      --include-recent-shared-links  Returns shared links that the user recently accessed
      --json                         Output formatted JSON
      --limit=<value>                Defines the maximum number of items to return. Default value is 100.
      --mdfilter=<value>...          Metadata value to filter on, in the format <scope>.<templateKey>.<field>=<value>
      --no-color                     Turn off colors for logging
      --owner-user-ids=<value>       Search for objects by owner. Requires a user ID or a set of comma-delimited user
                                     IDs
      --save-to-file-path=<value>    Override default file path to save report
      --scope=<option>               The scope on which you want search
                                     <options: user_content|enterprise_content>
      --size-from=<value>            Lower bound for file size, in bytes
      --size-to=<value>              Upper bound for file size, in bytes
      --sort=<value>                 The field to sort results by
      --trash-content=<option>       Controls whether to search in the trash. Defaults to non_trashed_only
                                     <options: trashed_only|non_trashed_only>
      --type=<option>                The type of objects you want to include in the search results
                                     <options: file|folder|web_link>
      --updated-at-from=<value>      Start of updated date range. Use a RFC3339 timestamp or shorthand syntax 0t, like
                                     5w for 5 weeks
      --updated-at-to=<value>        End of updated date range. Use a RFC3339 timestamp or shorthand syntax 0t, like 5w
                                     for 5 weeks

DESCRIPTION
  Search for files and folders in your Enterprise

EXAMPLES
  $ box search "Q3 OKR"

  $ box search --mdfilter "enterprise.employeeRecord.name=John Doe"
```

_See code: [src/commands/search.js](https://github.com/box/boxcli/blob/v4.4.1/src/commands/search.js)_
