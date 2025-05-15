`box request`
=============

Manually specify a Box API request

* [`box request RESOURCE`](#box-request-resource)

## `box request RESOURCE`

Manually specify a Box API request

```
USAGE
  $ box request RESOURCE [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [-X
    GET|POST|PUT|DELETE|OPTIONS] [--query <value>] [--body <value>] [-H <value>...]

ARGUMENTS
  RESOURCE  The Box API resource to make a request against, e.g. /search or https://api.box.com/2.0/search

FLAGS
  -H, --header=<value>...          HTTP header to add to the request, e.g. "Header: value"
  -X, --method=<option>            [default: GET] The HTTP method for the request
                                   <options: GET|POST|PUT|DELETE|OPTIONS>
  -h, --help                       Show CLI help
  -q, --quiet                      Suppress any non-error output to stderr
  -s, --save                       Save report to default reports folder on disk
  -t, --token=<value>              Provide a token to perform this call
  -v, --verbose                    Show verbose output, which can be helpful for debugging
  -y, --yes                        Automatically respond yes to all confirmation prompts
      --as-user=<value>            Provide an ID for a user
      --body=<value>               Body of the request
      --bulk-file-path=<value>     File path to bulk .csv or .json objects
      --csv                        Output formatted CSV
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --query=<value>              Query params to use for the request, either as k1=v1&k2=v2 or as JSON
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Manually specify a Box API request
```

_See code: [src/commands/request.js](https://github.com/box/boxcli/blob/v4.1.0/src/commands/request.js)_
