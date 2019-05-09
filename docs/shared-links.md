`box shared-links`
==================

Manage shared links

* [`box shared-links:get URL`](#box-shared-linksget-url)

## `box shared-links:get URL`

Get information from a shared item URL

```
USAGE
  $ box shared-links:get URL

ARGUMENTS
  URL  Shared item URL to resolve

OPTIONS
  -h, --help                             Show CLI help
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
  --password=password                    Shared item password
  --save-to-file-path=save-to-file-path  Override default file path to save report
```

_See code: [src/commands/shared-links/get.js](https://github.com/box/boxcli/blob/v2.2.0/src/commands/shared-links/get.js)_
