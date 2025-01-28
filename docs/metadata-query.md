`box metadata-query`
====================

Create a search using SQL-like syntax to return items that match specific metadata

* [`box metadata-query FROM ANCESTORFOLDERID`](#box-metadata-query-from-ancestorfolderid)

## `box metadata-query FROM ANCESTORFOLDERID`

Create a search using SQL-like syntax to return items that match specific metadata

```
USAGE
  $ box metadata-query FROM ANCESTORFOLDERID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--query-params
    <value> --query <value>] [--use-index <value>] [--order-by <value>] [--limit <value>] [--marker <value>]
    [--extra-fields <value>]

ARGUMENTS
  FROM              The template used in the query. Must be in the form scope.templateKey
  ANCESTORFOLDERID  The folder_id to which to restrain the query

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
      --extra-fields=<value>       A list of additional attributes to return for any item, including its metadata.
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --limit=<value>              A value between 0 and 100 that indicates the maximum number of results to return for
                                   a single request. This only specifies a maximum boundary and will not guarantee the
                                   minimum number of results returned.
      --marker=<value>             Marker to use for requesting the next page.
      --no-color                   Turn off colors for logging
      --order-by=<value>           A list of template fields and directions to sort the metadata query results by.
      --query=<value>              The logical expression of the query
      --query-params=<value>       Required if query present. The arguments for the query.
      --save-to-file-path=<value>  Override default file path to save report
      --use-index=<value>          The name of the search index to use for this query.

DESCRIPTION
  Create a search using SQL-like syntax to return items that match specific metadata

EXAMPLES
  $ box metadata-query enterprise_12345.someTemplate 5555 --query "amount >= :minAmount AND amount <= :maxAmount" --query-params minAmount=100f,maxAmount=200f --use-index amountAsc --order-by amount=ASC --extra-fields created_at,metadata.enterprise_1234.contracts
```

_See code: [src/commands/metadata-query.ts](https://github.com/box/boxcli/blob/v4.0.0/src/commands/metadata-query.ts)_
