`box watermarking`
==================

Apply a watermark on an item

* [`box watermarking:apply ITEMTYPE ITEMID`](#box-watermarkingapply-itemtype-itemid)
* [`box watermarking:get ITEMTYPE ITEMID`](#box-watermarkingget-itemtype-itemid)
* [`box watermarking:remove ITEMTYPE ITEMID`](#box-watermarkingremove-itemtype-itemid)

## `box watermarking:apply ITEMTYPE ITEMID`

Apply a watermark on an item

```
USAGE
  $ box watermarking:apply ITEMTYPE ITEMID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ITEMTYPE  (file|folder) Type of item to apply a watermark to
  ITEMID    ID of the item to apply a watermark to

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
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Apply a watermark on an item

EXAMPLES
  $ box watermarking:apply folder 22222
```

_See code: [src/commands/watermarking/apply.js](https://github.com/box/boxcli/blob/v4.4.1/src/commands/watermarking/apply.js)_

## `box watermarking:get ITEMTYPE ITEMID`

Get the watermark on an item

```
USAGE
  $ box watermarking:get ITEMTYPE ITEMID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ITEMTYPE  (file|folder) Type of item to get watermark for
  ITEMID    ID of the item to get watermark for

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
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Get the watermark on an item

EXAMPLES
  $ box watermarking:get folder 22222
```

_See code: [src/commands/watermarking/get.js](https://github.com/box/boxcli/blob/v4.4.1/src/commands/watermarking/get.js)_

## `box watermarking:remove ITEMTYPE ITEMID`

Remove a watermark from an item

```
USAGE
  $ box watermarking:remove ITEMTYPE ITEMID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ITEMTYPE  (file|folder) Type of item to remove watermark from
  ITEMID    ID of the item to remove watermark from

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
      --fields=<value>             Comma separated list of fields to show
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Remove a watermark from an item

EXAMPLES
  $ box watermarking:remove folder 22222
```

_See code: [src/commands/watermarking/remove.js](https://github.com/box/boxcli/blob/v4.4.1/src/commands/watermarking/remove.js)_
