`box metadata-query`
====================

Create a search using SQL-like syntax to return items that match specific metadata

* [`box metadata-query FROM ANCESTORFOLDERID`](#box-metadata-query-from-ancestorfolderid)

## `box metadata-query FROM ANCESTORFOLDERID`

Create a search using SQL-like syntax to return items that match specific metadata

```
USAGE
  $ box metadata-query FROM ANCESTORFOLDERID

ARGUMENTS
  FROM              The template used in the query. Must be in the form scope.templateKey
  ANCESTORFOLDERID  The folder_id to which to restrain the query

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
  --extra-fields=extra-fields            A list of additional attributes to return for any item, including its metadata.
  --fields=fields                        Comma separated list of fields to show
  --json                                 Output formatted JSON

  --limit=limit                          A value between 0 and 100 that indicates the maximum number of results to
                                         return for a single request. This only specifies a maximum boundary and will
                                         not guarantee the minimum number of results returned.

  --marker=marker                        Marker to use for requesting the next page.

  --no-color                             Turn off colors for logging

  --order-by=order-by                    A list of template fields and directions to sort the metadata query results by.

  --query=query                          The logical expression of the query

  --query-params=query-params            Required if query present. The arguments for the query.

  --save-to-file-path=save-to-file-path  Override default file path to save report

  --use-index=use-index                  The name of the search index to use for this query.

EXAMPLE
  box metadata-query enterprise_12345.someTemplate 5555 --query "amount >= :minAmount AND amount <= :maxAmount" 
  --query-params minAmount=100f,maxAmount=200f --use-index amountAsc --order-by amount=ASC --extra-fields 
  created_at,metadata.enterprise_1234.contracts
```

_See code: [src/commands/metadata-query.js](https://github.com/box/boxcli/blob/v3.16.0/src/commands/metadata-query.js)_
