`box ai`
========

Sends an AI request to supported LLMs and returns an answer

* [`box ai:ask`](#box-aiask)
* [`box ai:text-gen`](#box-aitext-gen)

## `box ai:ask`

Sends an AI request to supported LLMs and returns an answer

```
USAGE
  $ box ai:ask --prompt <value> --items <value>... [-t <value>] [--as-user <value>] [--no-color] [--json |
    --csv] [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]

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
      --items=<value>...           (required) The items for the AI request
      --json                       Output formatted JSON
      --no-color                   Turn off colors for logging
      --prompt=<value>             (required) The prompt for the AI request
      --save-to-file-path=<value>  Override default file path to save report

DESCRIPTION
  Sends an AI request to supported LLMs and returns an answer

EXAMPLES
  $ box ai:ask --items=id=12345,type=file --prompt "What is the status of this document?"
```

_See code: [src/commands/ai/ask.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/ai/ask.ts)_

## `box ai:text-gen`

Sends an AI request to supported LLMs and returns an answer specifically focused on the creation of new text.

```
USAGE
  $ box ai:text-gen --items <value>... --prompt <value> [-t <value>] [--as-user <value>] [--no-color] [--json |
    --csv] [-s | --save-to-file-path <value>] [--fields <value>] [--bulk-file-path <value>] [-h] [-v] [-y] [-q]
    [--dialogue-history <value>...]

FLAGS
  -h, --help                         Show CLI help
  -q, --quiet                        Suppress any non-error output to stderr
  -s, --save                         Save report to default reports folder on disk
  -t, --token=<value>                Provide a token to perform this call
  -v, --verbose                      Show verbose output, which can be helpful for debugging
  -y, --yes                          Automatically respond yes to all confirmation prompts
      --as-user=<value>              Provide an ID for a user
      --bulk-file-path=<value>       File path to bulk .csv or .json objects
      --csv                          Output formatted CSV
      --dialogue-history=<value>...  The history of prompts and answers previously passed to the LLM.
      --fields=<value>               Comma separated list of fields to show
      --items=<value>...             (required) The items to be processed by the LLM, often files. The array can include
                                     exactly one element.
      --json                         Output formatted JSON
      --no-color                     Turn off colors for logging
      --prompt=<value>               (required) The prompt for the AI request
      --save-to-file-path=<value>    Override default file path to save report

DESCRIPTION
  Sends an AI request to supported LLMs and returns an answer specifically focused on the creation of new text.

EXAMPLES
  $ box ai:text-gen --dialogue-history=prompt="What is the status of this document?",answer="It is in review",created-at="2024-07-09T11:29:46.835Z" --items=id=12345,type=file --prompt="What is the status of this document?"
```

_See code: [src/commands/ai/text-gen.ts](https://github.com/box/boxcli/blob/v3.16.0/src/commands/ai/text-gen.ts)_
