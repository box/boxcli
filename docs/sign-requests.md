`box sign-requests`
===================

List sign requests

* [`box sign-requests`](#box-sign-requests)
* [`box sign-requests:cancel ID`](#box-sign-requestscancel-id)
* [`box sign-requests:create`](#box-sign-requestscreate)
* [`box sign-requests:get ID`](#box-sign-requestsget-id)
* [`box sign-requests:resend ID`](#box-sign-requestsresend-id)

## `box sign-requests`

List sign requests

```
USAGE
  $ box sign-requests [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--limit <value>] [--marker <value>]

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
      --limit=<value>              The maximum number of items to return per page.
      --marker=<value>             Defines the position marker at which to begin returning results. This is used when
                                   paginating using marker-based pagination. This requires `usemarker` to be set to
                                   `true`.
      --no-color                   Turn off colors for logging
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  List sign requests

EXAMPLES
  $ box sign-requests
```

_See code: [src/commands/sign-requests/index.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/sign-requests/index.ts)_

## `box sign-requests:cancel ID`

Cancel sign request

```
USAGE
  $ box sign-requests:cancel ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  The ID of the sign request

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
  Cancel sign request

EXAMPLES
  $ box sign-requests:cancel 12345
```

_See code: [src/commands/sign-requests/cancel.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/sign-requests/cancel.ts)_

## `box sign-requests:create`

Create sign request

```
USAGE
  $ box sign-requests:create --signer <value>... [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s |
    --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q] [--source-files
    <value>] [--parent-folder <value>] [--document-preparation-needed] [--text-signatures-enabled] [--email-subject
    <value>] [--email-message <value>] [--reminders-enabled] [--prefill-tag <value>...] [--days-valid <value>]
    [--external-id <value>] [--redirect-url <value>] [--declined-redirect-url <value>] [--template-id <value>]

FLAGS
  -h, --help
      Show CLI help

  -q, --quiet
      Suppress any non-error output to stderr

  -s, --save
      Save report to default reports folder on disk

  -t, --token=<value>
      Provide a token to perform this call

  -v, --verbose
      Show verbose output, which can be helpful for debugging

  -y, --yes
      Automatically respond yes to all confirmation prompts

  --as-user=<value>
      Provide an ID for a user

  --bulk-file-path=<value>
      File path to bulk .csv or .json objects

  --csv
      Output formatted CSV

  --days-valid=<value>
      Number of days after which this request will automatically expire if not completed

  --declined-redirect-url=<value>
      The URL that a signer will be redirected to after declining to sign a document. Defining this URL overrides the
      default redirect URL for all signers.

  --[no-]document-preparation-needed
      Indicates if the sender should receive a `prepare_url` in the response to complete document preparation via UI.

  --email-message=<value>
      Message to include in sign request email. The field is cleaned through sanitization of specific characters. However,
      some html tags are allowed. Links included in the message are also converted to hyperlinks in the email. The message
      may contain the following html tags including `a`, `abbr`, `acronym`, `b`, `blockquote`, `code`, `em`, `i`, `ul`,
      `li`, `ol`, and `strong`. Be aware that when the text to html ratio is too high, the email may end up in spam
      filters. Custom styles on these tags are not allowed. If this field is not passed, a default message will be used.

  --email-subject=<value>
      Subject of sign request email. This is cleaned by sign request. If this field is not passed, a default subject will
      be used.

  --external-id=<value>
      This can be used to reference an ID in an external system that the sign request is related to.

  --fields=<value>
      Comma separated list of fields to show

  --json
      Output formatted JSON

  --no-color
      Turn off colors for logging

  --parent-folder=<value>
      The destination folder to place final, signed document and signing log

  --prefill-tag=<value>...
      Prefills a sign related tag in the content. Pass in a comma-separated dictionary of fields: id,text,checkbox,date.
      Can be added multiple times.

  --redirect-url=<value>
      The URL that a signer will be redirected to after signing a document. Defining this URL overrides the default
      redirect URL for all signers. If no declined redirect URL is specified, this URL will be used for decline actions as
      well.

  --[no-]reminders-enabled
      Reminds signers to sign a document on day 3, 8, 13 and 18. Reminders are only sent to outstanding signers.

  --save-to-file-path=<value>
      Override default file path to save report

  --signer=<value>...
      (required) A signer for the sign request. 35 is the max number of signers permitted. Can be added multiple times.
      Allowed (recommended) properties:
      email,role,is-in-person,order,embed-url-external-user-id,redirect-url,declined-redirect-url,group-id but snake case
      is also supported for: is_in_person,order,embed_url_external_user_id,redirect_url,declined_redirect_url,group_id

  --source-files=<value>
      Comma separated list of files to create a signing document from. This is currently limited to 10 files, e.g. 12345

  --template-id=<value>
      When a signature request is created from a template this field will indicate the id of that template.

  --[no-]text-signatures-enabled
      Disables the usage of signatures generated by typing (text)

DESCRIPTION
  Create sign request

EXAMPLES
  $ box sign-requests:create --signer email=alice@example.com --source-files 12345 --parent-folder 23456  --prefill-tag id=1,value=Test
```

_See code: [src/commands/sign-requests/create.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/sign-requests/create.ts)_

## `box sign-requests:get ID`

Get sign request by ID

```
USAGE
  $ box sign-requests:get ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  The ID of the sign request

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
  Get sign request by ID

EXAMPLES
  $ box sign-requests:get 12345
```

_See code: [src/commands/sign-requests/get.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/sign-requests/get.ts)_

## `box sign-requests:resend ID`

Resend sign request

```
USAGE
  $ box sign-requests:resend ID [-t <value>] [--as-user <value>] [--no-color] [--json | --csv] [-s | --save-to-file-path
    <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

ARGUMENTS
  ID  The ID of the sign request

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
  Resend sign request

EXAMPLES
  $ box sign-requests:resend 12345
```

_See code: [src/commands/sign-requests/resend.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/sign-requests/resend.ts)_
