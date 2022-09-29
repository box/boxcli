`box request`
=============

Manually specify a Box API request

* [`box request RESOURCE`](#box-request-resource)

## `box request RESOURCE`

Manually specify a Box API request

```
USAGE
  $ box request RESOURCE

ARGUMENTS
  RESOURCE  The Box API resource to make a request against, e.g. /search or https://api.box.com/2.0/search

OPTIONS
  -H, --header=header                       HTTP header to add to the request, e.g. "Header: value"
  -X, --method=GET|POST|PUT|DELETE|OPTIONS  [default: GET] The HTTP method for the request
  -h, --help                                Show CLI help
  -q, --quiet                               Suppress any non-error output to stderr
  -s, --save                                Save report to default reports folder on disk
  -t, --token=token                         Provide a token to perform this call
  -v, --verbose                             Show verbose output, which can be helpful for debugging
  -y, --yes                                 Automatically respond yes to all confirmation prompts
  --as-user=as-user                         Provide an ID for a user
  --body=body                               Body of the request
  --bulk-file-path=bulk-file-path           File path to bulk .csv or .json objects
  --csv                                     Output formatted CSV
  --fields=fields                           Comma separated list of fields to show
  --json                                    Output formatted JSON
  --no-color                                Turn off colors for logging
  --query=query                             Query params to use for the request, either as k1=v1&k2=v2 or as JSON
  --save-to-file-path=save-to-file-path     Override default file path to save report
```

_See code: [src/commands/request.js](https://github.com/box/boxcli/blob/v3.4.0/src/commands/request.js)_
