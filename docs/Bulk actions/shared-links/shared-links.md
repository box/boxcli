`box shared-links`
===========

Manage shared links

* [`box shared-links:delete ITEMID ITEMTYPE`](#box-shared-linksdelete-itemid-itemtype)



## `box shared-links:delete ITEMID ITEMTYPE`

Delete a shared link for a Box item

```
USAGE
  $ box shared-links:delete ITEMID ITEMTYPE

ARGUMENTS
  ITEMID    ID of the Box item to remove the shared link from
  ITEMTYPE  (file|folder) Type of item for shared link: either file or folder

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
  box shared-links:delete --bulk-file-path path/to/csv/shared-links-delete.csv
```

_See documentation [shared-links.md](https://github.com/box/boxcli/blob/main/docs/shared-links.md#box-shared-linksdelete-itemid-itemtype)_
_See example: [shared-links/shared-links-delete.csv](shared-links-delete.csv)_
