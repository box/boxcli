`box web-links`
===============

Manage web links

* [`box web-links:create URL`](#box-web-linkscreate-url)
* [`box web-links:delete ID`](#box-web-linksdelete-id)
* [`box web-links:get ID`](#box-web-linksget-id)
* [`box web-links:move ID PARENTID`](#box-web-linksmove-id-parentid)
* [`box web-links:update ID`](#box-web-linksupdate-id)

## `box web-links:create URL`

Create a new web link

```
USAGE
  $ box web-links:create URL

ARGUMENTS
  URL  The URL the web link points to. Must start with "http://" or "https://"

OPTIONS
  -d, --description=description          Description of the web link
  -h, --help                             Show CLI help
  -n, --name=name                        Name of the web link. Defaults to the URL if not set
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
  --parent-id=parent-id                  (required) ID of the folder to create the web link in
  --save-to-file-path=save-to-file-path  Override default file path to save report

EXAMPLE
  box web-links:create http://example.com --parent-id 0
```

_See code: [src/commands/web-links/create.js](https://github.com/box/boxcli/blob/v3.14.0/src/commands/web-links/create.js)_

## `box web-links:delete ID`

Delete a web link

```
USAGE
  $ box web-links:delete ID

ARGUMENTS
  ID  ID of the web link to delete

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
  box web-links:delete 12345
```

_See code: [src/commands/web-links/delete.js](https://github.com/box/boxcli/blob/v3.14.0/src/commands/web-links/delete.js)_

## `box web-links:get ID`

Get information about a web link

```
USAGE
  $ box web-links:get ID

ARGUMENTS
  ID  ID of the web link to get

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
  box web-links:get 12345
```

_See code: [src/commands/web-links/get.js](https://github.com/box/boxcli/blob/v3.14.0/src/commands/web-links/get.js)_

## `box web-links:move ID PARENTID`

Move a web link

```
USAGE
  $ box web-links:move ID PARENTID

ARGUMENTS
  ID        ID of the web link to move
  PARENTID  ID of the parent folder to move the web link into

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
  box web-links:move 12345 22222
```

_See code: [src/commands/web-links/move.js](https://github.com/box/boxcli/blob/v3.14.0/src/commands/web-links/move.js)_

## `box web-links:update ID`

Update a web link

```
USAGE
  $ box web-links:update ID

ARGUMENTS
  ID  ID of the web link to update

OPTIONS
  -d, --description=description          Description of the web link
  -h, --help                             Show CLI help
  -n, --name=name                        Name of the web link
  -q, --quiet                            Suppress any non-error output to stderr
  -s, --save                             Save report to default reports folder on disk
  -t, --token=token                      Provide a token to perform this call
  -u, --url=url                          The URL the web link points to. Must start with "http://" or "https://"
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
  box web-links:update 12345 --name "Example Site"
```

_See code: [src/commands/web-links/update.js](https://github.com/box/boxcli/blob/v3.14.0/src/commands/web-links/update.js)_
